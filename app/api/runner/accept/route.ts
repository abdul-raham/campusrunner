import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/mailer';
import { emails } from '@/lib/emailTemplates';

export async function POST(req: Request) {
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  try {
    const auth = req.headers.get('authorization') ?? '';
    const token = auth.replace('Bearer ', '').trim();
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let userId: string;
    try {
      const jwtPayload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      userId = jwtPayload.sub;
      if (!userId) throw new Error('no sub');
      if (jwtPayload.exp && jwtPayload.exp < Math.floor(Date.now() / 1000))
        return NextResponse.json({ error: 'Token expired' }, { status: 401 });
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { data: runnerProfile } = await admin
      .from('profiles').select('role, full_name, email').eq('id', userId).single();
    if (!runnerProfile) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (runnerProfile.role !== 'runner') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { orderId } = await req.json();
    if (!orderId) return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });

    const { data: order, error: fetchErr } = await admin
      .from('orders').select('id, status, runner_id, student_id, title').eq('id', orderId).single();

    if (fetchErr || !order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    if (order.status !== 'pending' || order.runner_id !== null)
      return NextResponse.json({ error: 'Order already taken' }, { status: 409 });

    const { data: updated, error: updateErr } = await admin
      .from('orders')
      .update({ runner_id: userId, status: 'accepted' })
      .eq('id', orderId)
      .eq('status', 'pending')
      .is('runner_id', null)
      .select('id')
      .maybeSingle();

    if (updateErr) {
      console.error('Accept update error:', JSON.stringify(updateErr));
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }
    if (!updated) {
      return NextResponse.json({ error: 'Order already taken' }, { status: 409 });
    }

    // fetch student email for notification
    const { data: studentProfile } = await admin
      .from('profiles').select('full_name, email').eq('id', order.student_id).single();

    // send email to student (non-blocking)
    if (studentProfile?.email) {
      const tmpl = emails.orderAccepted(
        studentProfile.full_name || 'there',
        order.title,
        runnerProfile.full_name || 'A runner',
        orderId
      );
      sendEmail(studentProfile.email, tmpl.subject, tmpl.html);
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('Accept route crash:', e);
    return NextResponse.json({ error: e.message ?? 'Server error' }, { status: 500 });
  }
}
