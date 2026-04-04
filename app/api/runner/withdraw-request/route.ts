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

const getAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return null;
  return createClient(supabaseUrl, serviceRoleKey);
};

export async function POST(req: Request) {
  const supabase = await getSessionSupabase();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, bank_name, bank_account_number, bank_account_name')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'runner') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  if (!profile.bank_name || !profile.bank_account_number || !profile.bank_account_name) {
    return NextResponse.json({ error: 'Add payout details in your profile first.' }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const amount = Number(body?.amount || 0);
  if (!amount || amount <= 0) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
  }

  const admin = getAdminClient();
  if (!admin) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  try {
    const { error: insertErr } = await admin
      .from('withdrawal_requests')
      .insert({ user_id: user.id, amount, status: 'pending' });
    if (insertErr) throw insertErr;

    const { data: admins } = await admin
      .from('profiles')
      .select('id')
      .eq('role', 'admin');

    if (admins && admins.length > 0) {
      await admin.from('notifications').insert(
        admins.map((a: any) => ({
          user_id: a.id,
          title: 'Runner Withdrawal Request',
          message: `${profile?.full_name || 'A runner'} requested a withdrawal of ₦${amount.toLocaleString('en-NG')}.`,
          is_read: false,
        }))
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Withdraw request error:', error);
    return NextResponse.json({ error: 'Failed to request withdrawal' }, { status: 500 });
  }
}
