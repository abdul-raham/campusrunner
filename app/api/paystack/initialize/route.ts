import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { rateLimit } from '@/lib/rateLimit';

const getAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return null;
  return createClient(supabaseUrl, serviceRoleKey);
};

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rl = rateLimit(`paystack_init:${ip}`, 15, 60_000);
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
    const body = await req.json().catch(() => null);
    const amount = Number(body?.amount || 0);
    const userId = body?.userId as string | undefined;
    const email = body?.email as string | undefined;

    if (!amount || amount <= 0 || !userId || !email) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ error: 'Paystack not configured' }, { status: 500 });
    }

    const admin = getAdminClient();
    if (!admin) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }

    // generate a unique reference
    const reference = `CR_${userId.slice(0, 8)}_${Date.now()}`;

    const res = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100),
        reference,
        metadata: { user_id: userId, purpose: 'wallet_funding' },
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.status) {
      return NextResponse.json(
        { error: data?.message || 'Paystack init failed' },
        { status: 500 }
      );
    }

    // optional: store a pending transaction reference (no DB write to avoid RLS)
    return NextResponse.json({
      reference,
      authorization_url: data.data?.authorization_url,
    });
  } catch (e: any) {
    console.error('Paystack init error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
