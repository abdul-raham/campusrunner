import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

const getSessionSupabase = async () => {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
};

const requireAdmin = async () => {
  const supabase = await getSessionSupabase();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return { error: 'Unauthorized' };

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || profile?.role !== 'admin') return { error: 'Forbidden' };
  return { userId: user.id };
};

const getAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return null;
  return createClient(supabaseUrl, serviceRoleKey);
};

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if ('error' in auth) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.error === 'Forbidden' ? 403 : 401 }
    );
  }

  const admin = getAdminClient();
  if (!admin) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  const orderId = body?.orderId as string | undefined;
  if (!orderId) {
    return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
  }

  try {
    const { data: order, error: orderErr } = await admin
      .from('orders')
      .select('id, student_id, final_amount, budget_amount, status')
      .eq('id', orderId)
      .single();
    if (orderErr || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const amount = Number(order.final_amount || order.budget_amount || 0);

    // refund held funds if any
    const { data: hold } = await admin
      .from('wallet_holds')
      .select('id, amount, status')
      .eq('order_id', orderId)
      .eq('user_id', order.student_id)
      .maybeSingle();

    if (hold && hold.status === 'held' && amount > 0) {
      const { data: w } = await admin
        .from('wallets')
        .select('id, balance, user_id, student_id')
        .or(`user_id.eq.${order.student_id},student_id.eq.${order.student_id}`)
        .maybeSingle();

      const balance = Number(w?.balance || 0);
      if (w) {
        const col = w.user_id ? 'user_id' : 'student_id';
        await admin
          .from('wallets')
          .update({ balance: balance + amount, updated_at: new Date().toISOString() })
          .eq(col, order.student_id);
      } else {
        await admin.from('wallets').insert({
          user_id: order.student_id,
          balance: amount,
          updated_at: new Date().toISOString(),
        });
      }

      await admin.from('wallet_holds')
        .update({ status: 'refunded' })
        .eq('id', hold.id);

      await admin.from('wallet_transactions')
        .update({ status: 'refunded' })
        .eq('order_id', orderId)
        .eq('user_id', order.student_id)
        .eq('status', 'held');

      await admin.from('wallet_transactions').insert({
        user_id: order.student_id,
        order_id: orderId,
        amount,
        type: 'credit',
        status: 'refunded',
        note: 'Order cancelled refund',
      });
    }

    const { error: updateErr } = await admin
      .from('orders')
      .update({ status: 'cancelled', payment_status: 'refunded' })
      .eq('id', orderId);
    if (updateErr) throw updateErr;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Cancel order error:', error);
    return NextResponse.json({ error: 'Failed to cancel order' }, { status: 500 });
  }
}
