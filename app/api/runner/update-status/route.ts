import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/mailer';
import { emails } from '@/lib/emailTemplates';

const TRANSITIONS: Record<string, string> = {
  accepted: 'in_progress',
  in_progress: 'completed',
};

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
      .from('orders')
      .select('id, status, runner_id, student_id, title, final_amount, budget_amount')
      .eq('id', orderId).single();

    if (fetchErr || !order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    if (order.runner_id !== userId) return NextResponse.json({ error: 'Not your order' }, { status: 403 });

    const nextStatus = TRANSITIONS[order.status];
    if (!nextStatus) return NextResponse.json({ error: `Cannot advance from ${order.status}` }, { status: 400 });

    const updatePayload: any = { status: nextStatus };
    if (nextStatus === 'completed') updatePayload.completed_at = new Date().toISOString();

    const { error: updateErr } = await admin.from('orders').update(updatePayload).eq('id', orderId);
    if (updateErr) {
      console.error('Status update error:', JSON.stringify(updateErr));
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    const amount = order.final_amount || order.budget_amount || 0;

    // release held funds + credit runner on completion
    if (nextStatus === 'completed' && amount > 0) {
      const { data: hold } = await admin
        .from('wallet_holds')
        .select('id, amount, status')
        .eq('order_id', orderId)
        .eq('user_id', order.student_id)
        .maybeSingle();

      if (hold && hold.status === 'held') {
        // credit runner wallet
        const { data: rw } = await admin
          .from('wallets')
          .select('id, balance, user_id')
          .eq('user_id', userId)
          .maybeSingle();

        const runnerBalance = Number(rw?.balance || 0);
        if (!rw) {
          await admin.from('wallets').insert({
            user_id: userId,
            balance: amount,
            updated_at: new Date().toISOString(),
          });
        } else {
          await admin.from('wallets')
            .update({ balance: runnerBalance + amount, updated_at: new Date().toISOString() })
            .eq('user_id', userId);
        }

        await admin.from('wallet_holds')
          .update({ status: 'released' })
          .eq('id', hold.id);

        await admin.from('wallet_transactions')
          .update({ status: 'completed' })
          .eq('order_id', orderId)
          .eq('user_id', order.student_id)
          .eq('status', 'held');

        await admin.from('wallet_transactions').insert({
          user_id: userId,
          order_id: orderId,
          amount,
          type: 'credit',
          status: 'completed',
          note: 'Order payout',
        });
      }
    }

    // fetch student profile for email
    const { data: studentProfile } = await admin
      .from('profiles').select('full_name, email').eq('id', order.student_id).single();

    const runnerName = runnerProfile.full_name || 'Your runner';
    const studentName = studentProfile?.full_name || 'there';

    if (nextStatus === 'in_progress' && studentProfile?.email) {
      const tmpl = emails.orderInProgress(studentName, order.title, runnerName, orderId);
      sendEmail(studentProfile.email, tmpl.subject, tmpl.html);
    }

    if (nextStatus === 'completed') {
      // email student
      if (studentProfile?.email) {
        const tmpl = emails.orderCompleted(studentName, order.title, runnerName, orderId, amount);
        sendEmail(studentProfile.email, tmpl.subject, tmpl.html);
      }
      // email runner
      if (runnerProfile.email) {
        const tmpl = emails.runnerCredited(runnerName, order.title, amount, orderId);
        sendEmail(runnerProfile.email, tmpl.subject, tmpl.html);
      }
    }

    return NextResponse.json({ success: true, newStatus: nextStatus });
  } catch (e: any) {
    console.error('Update-status route crash:', e);
    return NextResponse.json({ error: e.message ?? 'Server error' }, { status: 500 });
  }
}
