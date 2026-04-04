import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { rateLimit } from '@/lib/rateLimit';

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

export async function GET(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rl = rateLimit(`admin_tx:${ip}`, 30, 60_000);
    if (!rl.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const user = await getUserFromToken(token);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = getAdminClient();
    if (!admin) return NextResponse.json({ error: 'Server not configured' }, { status: 500 });

    const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).maybeSingle();
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { data: txs } = await admin
      .from('wallet_transactions')
      .select('id,amount,type,status,note,created_at,user_id,order_id,reference')
      .order('created_at', { ascending: false });

    const userIds = Array.from(new Set((txs || []).map((t: any) => t.user_id).filter(Boolean)));
    let profiles: { id: string; full_name: string }[] = [];
    if (userIds.length) {
      const { data: p } = await admin.from('profiles').select('id,full_name').in('id', userIds);
      profiles = p || [];
    }

    const out = (txs || []).map((t: any) => ({
      ...t,
      user_name: profiles.find((p) => p.id === t.user_id)?.full_name || 'Unknown',
    }));

    return NextResponse.json({ data: out });
  } catch (e: any) {
    console.error('Admin transactions error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
