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

export async function GET() {
  const auth = await requireAdmin();
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.error === 'Forbidden' ? 403 : 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  try {
    const { data: students } = await adminClient
      .from('profiles')
      .select('id')
      .eq('role', 'student');

    const { data: runners } = await adminClient
      .from('profiles')
      .select('id, runners(verification_status)')
      .eq('role', 'runner');

    const pendingRunnersCount = (runners || []).filter((runner) => {
      const status = Array.isArray(runner.runners) ? runner.runners[0]?.verification_status : runner.runners?.verification_status;
      return !status || status === 'pending';
    }).length;

    const { data: orders } = await adminClient
      .from('orders')
      .select('id, status, platform_fee');

    const completedOrders = (orders || []).filter(o => o.status === 'completed');
    const revenue = completedOrders.reduce((sum, order) => sum + (order.platform_fee || 0), 0);

    return NextResponse.json({
      totalStudents: students?.length || 0,
      totalRunners: runners?.length || 0,
      pendingRunners: pendingRunnersCount || 0,
      totalOrders: orders?.length || 0,
      completedOrders: completedOrders.length,
      revenue,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 });
  }
}
