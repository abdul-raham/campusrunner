import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

const getSessionSupabase = () => {
  const cookieStore = cookies();
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
  const supabase = getSessionSupabase();
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

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.error === 'Forbidden' ? 403 : 401 });
  }

  const body = await req.json().catch(() => null);
  const orderId = body?.orderId as string | undefined;
  const runnerId = body?.runnerId as string | undefined;

  if (!orderId || !runnerId) {
    return NextResponse.json({ error: 'Missing orderId or runnerId' }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  try {
    const { data: order, error: orderError } = await adminClient
      .from('orders')
      .select('id, title, student_id')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const { data: runnerProfile } = await adminClient
      .from('profiles')
      .select('full_name')
      .eq('id', runnerId)
      .single();

    const { error: updateError } = await adminClient
      .from('orders')
      .update({
        runner_id: runnerId,
        status: 'accepted',
        accepted_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (updateError) throw updateError;

    await adminClient.from('notifications').insert({
      user_id: order.student_id,
      title: 'Runner Assigned',
      message: `${runnerProfile?.full_name || 'A runner'} has been assigned to your order "${order.title}".`,
      is_read: false,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Assign runner error:', error);
    return NextResponse.json({ error: 'Failed to assign runner' }, { status: 500 });
  }
}
