import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { rateLimit } from '@/lib/rateLimit';
import { sendEmail } from '@/lib/mailer';

const getAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return null;
  return createClient(supabaseUrl, serviceRoleKey);
};

const getUserFromToken = async (token?: string | null) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey || !token) return null;
  const client = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
  const { data } = await client.auth.getUser(token);
  return data.user ?? null;
};

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rl = rateLimit(`admin_withdrawals_update:${ip}`, 20, 60_000);
    if (!rl.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const user = await getUserFromToken(token);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => null);
    const id = body?.id as string | undefined;
    const status = body?.status as string | undefined;
    if (!id || !status) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

    const admin = getAdminClient();
    if (!admin) return NextResponse.json({ error: 'Server not configured' }, { status: 500 });

    const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).maybeSingle();
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { data: reqRow } = await admin
      .from('withdrawal_requests')
      .select('id,user_id,amount,status')
      .eq('id', id)
      .maybeSingle();
    if (!reqRow) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (status === 'paid') {
      // deduct from runner wallet if possible
      const { data: w } = await admin
        .from('wallets')
        .select('id,balance,user_id,student_id')
        .or(`user_id.eq.${reqRow.user_id},student_id.eq.${reqRow.user_id}`)
        .maybeSingle();
      const balance = Number(w?.balance || 0);
      if (balance < Number(reqRow.amount || 0)) {
        return NextResponse.json({ error: 'Insufficient runner balance' }, { status: 400 });
      }
      const col = w?.user_id ? 'user_id' : 'student_id';
      await admin
        .from('wallets')
        .update({ balance: balance - Number(reqRow.amount), updated_at: new Date().toISOString() })
        .eq(col, reqRow.user_id);

      await admin.from('wallet_transactions').insert({
        user_id: reqRow.user_id,
        amount: Number(reqRow.amount),
        type: 'debit',
        status: 'completed',
        note: 'Withdrawal paid',
      });
    }

    await admin.from('withdrawal_requests').update({ status }).eq('id', id);

    // Notify runner (in-app + email)
    const { data: runnerProfile } = await admin
      .from('profiles')
      .select('email, full_name')
      .eq('id', reqRow.user_id)
      .maybeSingle();

    const statusLabel = status === 'approved' ? 'approved' : status === 'paid' ? 'paid' : status === 'rejected' ? 'rejected' : status;
    const notifMessage =
      status === 'approved'
        ? `Your withdrawal request has been approved.`
        : status === 'paid'
        ? `Your withdrawal has been marked as paid.`
        : status === 'rejected'
        ? `Your withdrawal request was rejected. Please contact support if you need help.`
        : `Your withdrawal request status is now ${statusLabel}.`;

    await admin.from('notifications').insert({
      user_id: reqRow.user_id,
      title: 'Withdrawal update',
      message: notifMessage,
      type: 'wallet_update',
    });

    if (runnerProfile?.email) {
      await sendEmail(
        runnerProfile.email,
        'Withdrawal request update',
        `<p>Hi ${runnerProfile.full_name || 'there'},</p><p>${notifMessage}</p>`
      );
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('Admin withdrawal update error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
