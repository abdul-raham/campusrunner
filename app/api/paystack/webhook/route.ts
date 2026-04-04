import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const getAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return null;
  return createClient(supabaseUrl, serviceRoleKey);
};

export async function POST(req: Request) {
  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ error: 'Paystack not configured' }, { status: 500 });
    }

    const signature = req.headers.get('x-paystack-signature') || '';
    const rawBody = await req.text();
    const expected = crypto.createHmac('sha512', secretKey).update(rawBody).digest('hex');
    if (signature !== expected) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    if (event?.event !== 'charge.success') {
      return NextResponse.json({ received: true });
    }

    const data = event?.data || {};
    const reference = data?.reference as string | undefined;
    const amount = Number(data?.amount || 0) / 100;
    const userId = data?.metadata?.user_id as string | undefined;

    if (!reference || !userId || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const admin = getAdminClient();
    if (!admin) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }

    const { data: existing } = await admin
      .from('wallet_transactions')
      .select('id')
      .eq('reference', reference)
      .maybeSingle();
    if (existing) {
      return NextResponse.json({ success: true, alreadyCredited: true });
    }

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
      note: 'Wallet funding via Paystack (webhook)',
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('Paystack webhook error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
