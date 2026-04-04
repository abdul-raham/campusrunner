import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return null;
  return createClient(supabaseUrl, serviceRoleKey);
};

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const reference = body?.reference as string | undefined;
    const userId = body?.userId as string | undefined;

    if (!reference || !userId) {
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

    // Idempotency: check if reference already credited
    const { data: existing } = await admin
      .from('wallet_transactions')
      .select('id')
      .eq('reference', reference)
      .maybeSingle();
    if (existing) {
      return NextResponse.json({ success: true, alreadyCredited: true });
    }

    const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    });
    const data = await res.json();
    if (!res.ok || !data.status || data.data?.status !== 'success') {
      return NextResponse.json({ error: data?.message || 'Verification failed' }, { status: 500 });
    }

    const amount = Number(data.data?.amount || 0) / 100;
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // credit wallet
    const { data: w } = await admin
      .from('wallets')
      .select('id, balance, user_id, student_id')
      .or(`user_id.eq.${userId},student_id.eq.${userId}`)
      .maybeSingle();

    const balance = Number(w?.balance || 0);
    if (w) {
      const col = w.user_id ? 'user_id' : 'student_id';
      await admin
        .from('wallets')
        .update({ balance: balance + amount, updated_at: new Date().toISOString() })
        .eq(col, userId);
    } else {
      await admin.from('wallets').insert({
        user_id: userId,
        balance: amount,
        updated_at: new Date().toISOString(),
      });
    }

    await admin.from('wallet_transactions').insert({
      user_id: userId,
      amount,
      type: 'credit',
      status: 'completed',
      reference,
      note: 'Wallet funding via Paystack',
    });

    return NextResponse.json({ success: true, amount });
  } catch (e: any) {
    console.error('Paystack verify error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
