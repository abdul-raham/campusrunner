import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

type RunnerStatus = 'pending' | 'approved' | 'rejected' | 'declined' | 'suspended';

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

export async function GET() {
  const auth = await requireAdmin();
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.error === 'Forbidden' ? 403 : 401 });
  }

  const adminClient = getAdminClient();
  if (!adminClient) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  try {
    const { data, error } = await adminClient
      .from('profiles')
      .select(`
        id,
        full_name,
        email,
        phone,
        university,
        hostel_location,
        matric_number,
        created_at,
        runners (
          id,
          verification_status,
          rating,
          total_jobs
        )
      `)
      .eq('role', 'runner')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase query error:', JSON.stringify(error));
      throw error;
    }

    const normalized = (data || []).map((runner) => {
      const runnerRow = Array.isArray(runner.runners) ? runner.runners[0] : runner.runners;
      return {
        ...runner,
        runners: runnerRow || {
          id: null,
          verification_status: 'pending',
          rating: 0,
          total_jobs: 0,
        },
      };
    });

    return NextResponse.json({ runners: normalized });
  } catch (error) {
    console.error('Admin runners error:', error);
    return NextResponse.json({ error: 'Failed to load runners' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const auth = await requireAdmin();
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.error === 'Forbidden' ? 403 : 401 });
  }

  const adminClient = getAdminClient();
  if (!adminClient) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  const profileId = body?.profileId as string | undefined;
  const status = body?.status as RunnerStatus | undefined;

  if (!profileId || !status) {
    return NextResponse.json({ error: 'Missing profileId or status' }, { status: 400 });
  }

  try {
    const { data: existingRunner, error: findError } = await adminClient
      .from('runners')
      .select('id')
      .eq('profile_id', profileId)
      .maybeSingle();

    if (findError) throw findError;

    const normalized = status === 'declined' ? 'rejected' : status;

    if (!existingRunner) {
      const { error: insertError } = await adminClient
        .from('runners')
        .insert({ profile_id: profileId, verification_status: normalized });
      if (insertError) throw insertError;
    } else {
      const { error: updateError } = await adminClient
        .from('runners')
        .update({ verification_status: normalized })
        .eq('profile_id', profileId);
      if (updateError) throw updateError;
    }

    const title = normalized === 'approved' ? 'Runner Approved' : 'Runner Application Update';
    const message =
      normalized === 'approved'
        ? 'Your runner account has been approved. You can now accept jobs.'
        : normalized === 'rejected'
          ? 'Your runner application was not approved. Please contact support.'
          : `Your runner status is now "${normalized}".`;

    await adminClient.from('notifications').insert({
      user_id: profileId,
      title,
      message,
      is_read: false,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update runner status error:', error);
    return NextResponse.json({ error: 'Failed to update runner status' }, { status: 500 });
  }
}
