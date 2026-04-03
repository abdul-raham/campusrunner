import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/mailer';
import { emails } from '@/lib/emailTemplates';

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const auth = req.headers.get('authorization') ?? '';
    const token = auth.replace('Bearer ', '').trim();
    if (!token) return NextResponse.json({ ok: true });

    let userId: string;
    try {
      const jwtPayload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      userId = jwtPayload.sub;
      if (!userId) throw new Error();
    } catch {
      return NextResponse.json({ ok: true });
    }

    const { orderId } = await req.json();
    if (!orderId) return NextResponse.json({ ok: true });

    const { data: order } = await admin
      .from('orders').select('id, title, budget_amount, final_amount, student_id').eq('id', orderId).single();
    if (!order) return NextResponse.json({ ok: true });

    const { data: profile } = await admin
      .from('profiles').select('full_name, email').eq('id', order.student_id).single();

    if (profile?.email) {
      const amount = order.final_amount || order.budget_amount || 0;
      const tmpl = emails.newOrderPlaced(profile.full_name || 'there', order.title, orderId, amount);
      sendEmail(profile.email, tmpl.subject, tmpl.html);
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('Order email error:', e);
    return NextResponse.json({ ok: true });
  }
}
