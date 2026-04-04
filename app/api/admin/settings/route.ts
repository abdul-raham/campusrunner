import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

const SETTINGS_KEYS = [
  'support_email', 'commission_rate', 'service_fee', 'min_payout',
  'maintenance_mode', 'app_name', 'logo_url', 'currency',
];

const DEFAULTS: Record<string, string> = {
  support_email: 'support@campusrunner.app',
  commission_rate: '10',
  service_fee: '100',
  min_payout: '5000',
  maintenance_mode: 'false',
  app_name: 'CampusRunner',
  logo_url: '',
  currency: 'NGN',
};

const getSessionSupabase = async () => {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
  );
};

const requireAdmin = async () => {
  const supabase = await getSessionSupabase();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { error: 'Unauthorized' };
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return { error: 'Forbidden' };
  return { userId: user.id };
};

const getAdminClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
};

export async function GET() {
  const auth = await requireAdmin();
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.error === 'Forbidden' ? 403 : 401 });

  const adminClient = getAdminClient();
  if (!adminClient) return NextResponse.json({ error: 'Server not configured' }, { status: 500 });

  try {
    const { data } = await adminClient.from('app_settings').select('key, value').in('key', SETTINGS_KEYS);
    const settings: Record<string, string> = { ...DEFAULTS };
    (data || []).forEach(row => { settings[row.key] = row.value; });
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Admin settings GET error:', error);
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const auth = await requireAdmin();
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.error === 'Forbidden' ? 403 : 401 });

  const adminClient = getAdminClient();
  if (!adminClient) return NextResponse.json({ error: 'Server not configured' }, { status: 500 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  try {
    const upserts = Object.entries(body)
      .filter(([key]) => SETTINGS_KEYS.includes(key))
      .map(([key, value]) => ({ key, value: String(value), updated_at: new Date().toISOString() }));

    if (upserts.length === 0) return NextResponse.json({ error: 'No valid settings provided' }, { status: 400 });

    const { error } = await adminClient.from('app_settings').upsert(upserts, { onConflict: 'key' });
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin settings PUT error:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
