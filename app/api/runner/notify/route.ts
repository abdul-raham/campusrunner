import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

const TEMPLATES: Record<string, (name: string, id: string) => { title: string; message: string }> = {
  accepted:    (n, id) => ({ title: 'Runner Assigned! 🏃', message: `${n} accepted your order #${id.slice(-8)} and will start soon.` }),
  in_progress: (n, id) => ({ title: 'Order In Progress 🚀', message: `${n} is now working on your order #${id.slice(-8)}.` }),
  completed:   (n, id) => ({ title: 'Order Delivered! ✅',  message: `Your order #${id.slice(-8)} has been delivered by ${n}. Enjoy!` }),
};

export async function POST(req: Request) {
  const cookieStore = cookies();
  const sessionClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  );

  const { data: { user }, error: authErr } = await sessionClient.auth.getUser();
  if (authErr || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await sessionClient
    .from('profiles').select('role, full_name').eq('id', user.id).single();
  if (profile?.role !== 'runner') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const { orderId, status } = body;
  if (!orderId || !TEMPLATES[status]) {
    return NextResponse.json({ error: 'Missing orderId or invalid status' }, { status: 400 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // verify runner is associated with this order
  // for 'accepted': runner_id was just set, so check it
  // allow if runner_id matches OR if status is accepted and was just claimed
  const { data: order, error: orderErr } = await admin
    .from('orders').select('id, student_id, runner_id, status').eq('id', orderId).single();
  if (orderErr || !order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  if (order.runner_id !== user.id) return NextResponse.json({ error: 'Not your order' }, { status: 403 });

  const tmpl = TEMPLATES[status](profile.full_name, orderId);
  const { error: notifErr } = await admin.from('notifications').insert({
    user_id: order.student_id,
    title: tmpl.title,
    message: tmpl.message,
    is_read: false,
  });

  if (notifErr) {
    console.error('Notification insert failed:', notifErr.message, notifErr.details, notifErr.hint);
    return NextResponse.json({ error: notifErr.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
