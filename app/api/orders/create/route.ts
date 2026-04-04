import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { rateLimit } from '@/lib/rateLimit';

const DELIVERY_FEES: Record<string, number> = {
  normal: 500,
  urgent: 1500,
};

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

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rl = rateLimit(`order_create:${ip}`, 10, 60_000);
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const user = await getUserFromToken(token);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => null);
    const {
      categoryId,
      title,
      description,
      items = [],
      pickupLocation,
      deliveryLocation,
      urgency = 'normal',
      notes,
    } = body || {};

    if (!categoryId || !title || !pickupLocation || !deliveryLocation) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const cleanedItems = Array.isArray(items)
      ? items
          .map((i: any) => ({
            name: String(i?.name || '').trim(),
            quantity: Number(i?.quantity || 1),
            price: Number(i?.price || 0),
          }))
          .filter((i: any) => i.name && i.price > 0)
      : [];

    if (cleanedItems.length === 0) {
      return NextResponse.json({ error: 'Add at least one priced item' }, { status: 400 });
    }

    const itemsSubtotal = cleanedItems.reduce((sum: number, i: any) => {
      const qty = i.quantity > 0 ? i.quantity : 1;
      return sum + i.price * qty;
    }, 0);

    const admin = getAdminClient();
    if (!admin) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }

    const { data: cat } = await admin
      .from('service_categories')
      .select('base_price')
      .eq('id', categoryId)
      .maybeSingle();

    const serviceFee = Number(cat?.base_price || 0);
    const deliveryFee = DELIVERY_FEES[String(urgency)] || 0;
    const total = itemsSubtotal + serviceFee + deliveryFee;

    const { data: order, error: oErr } = await admin
      .from('orders')
      .insert([
        {
          student_id: user.id,
          service_category_id: categoryId,
          title,
          description,
          budget_amount: itemsSubtotal,
          final_amount: total,
          platform_fee: serviceFee,
          runner_payout: Math.max(0, total - serviceFee),
          pickup_location: pickupLocation,
          delivery_location: deliveryLocation,
          urgency_level: urgency,
          status: 'pending',
          payment_status: 'paid',
        },
      ])
      .select()
      .single();

    if (oErr || !order) {
      return NextResponse.json({ error: oErr?.message || 'Failed to create order' }, { status: 500 });
    }

    const itemsPayload = cleanedItems.map((i: any) => ({
      order_id: order.id,
      item_name: i.name,
      quantity: i.quantity || 1,
      price: i.price,
    }));
    const { error: itemsErr } = await admin.from('order_items').insert(itemsPayload);
    if (itemsErr) throw itemsErr;

    const metaRows = [
      { order_id: order.id, meta_key: 'delivery_fee', meta_value: String(deliveryFee) },
      { order_id: order.id, meta_key: 'items_subtotal', meta_value: String(itemsSubtotal) },
      { order_id: order.id, meta_key: 'service_fee', meta_value: String(serviceFee) },
    ];
    if (String(notes || '').trim()) {
      metaRows.push({ order_id: order.id, meta_key: 'notes', meta_value: String(notes).trim() });
    }
    await admin.from('order_meta').insert(metaRows);

    // Atomically debit wallet if balance is sufficient
    const { data: wallet } = await admin
      .from('wallets')
      .update({ updated_at: new Date().toISOString() })
      .or(`user_id.eq.${user.id},student_id.eq.${user.id}`)
      .gte('balance', total)
      .select('id, balance, user_id, student_id')
      .maybeSingle();

    if (!wallet) {
      await admin.from('orders').delete().eq('id', order.id);
      return NextResponse.json({ error: 'Insufficient balance. Fund your wallet.' }, { status: 400 });
    }

    const walletKey = wallet.user_id ? 'user_id' : 'student_id';
    const newBalance = Math.max(0, Number(wallet.balance || 0) - total);
    await admin.from('wallets').update({ balance: newBalance, updated_at: new Date().toISOString() }).eq(walletKey, user.id);

    await admin.from('wallet_holds').insert({
      user_id: user.id,
      order_id: order.id,
      amount: total,
      status: 'held',
    });

    await admin.from('wallet_transactions').insert({
      user_id: user.id,
      order_id: order.id,
      amount: total,
      type: 'debit',
      status: 'held',
      note: 'Funds held for order placement',
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (e: any) {
    console.error('Order create error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
