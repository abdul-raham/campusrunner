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

export async function GET() {
  const supabase = await getSessionSupabase();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || profile?.role !== 'runner') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  try {
    const { data, error } = await adminClient
      .from('runners')
      .select('verification_status, rating, total_jobs, runner_tier, student_id_number')
      .eq('profile_id', user.id)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({
      verification_status: data?.verification_status || 'pending',
      rating: data?.rating ?? 0,
      total_jobs: data?.total_jobs ?? 0,
      runner_tier: data?.runner_tier ?? 'normal',
      student_id_number: data?.student_id_number ?? null,
    });
  } catch (error) {
    console.error('Runner status error:', error);
    return NextResponse.json({ error: 'Failed to load runner status' }, { status: 500 });
  }
}
