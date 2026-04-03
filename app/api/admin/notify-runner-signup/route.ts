import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

const getSessionSupabase = () => {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
};

const getAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return null;
  return createClient(supabaseUrl, serviceRoleKey);
};

export async function POST(req: Request) {
  const supabase = getSessionSupabase();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, role, full_name, email, phone, university, hostel_location, matric_number')
    .eq('id', user.id)
    .single();

  if (profileError || profile?.role !== 'runner') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const adminClient = getAdminClient();
  if (!adminClient) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  try {
    const { data: admins } = await adminClient
      .from('profiles')
      .select('id, email')
      .eq('role', 'admin');

    const title = 'New Runner Signup';
    const message = `${profile.full_name} just signed up as a runner. Review their credentials in the admin dashboard.`;

    if (admins && admins.length > 0) {
      const cutoff = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { data: recent } = await adminClient
        .from('notifications')
        .select('id')
        .eq('title', title)
        .eq('message', message)
        .gte('created_at', cutoff)
        .limit(1);

      if (recent && recent.length > 0) {
        return NextResponse.json({ success: true, deduped: true });
      }

      const notifications = admins.map((admin) => ({
        user_id: admin.id,
        title,
        message,
        is_read: false,
      }));
      await adminClient.from('notifications').insert(notifications);
    }

    const { data: supportSetting } = await adminClient
      .from('app_settings')
      .select('value')
      .eq('key', 'support_email')
      .maybeSingle();

    const supportEmail = supportSetting?.value || process.env.SUPPORT_EMAIL || '';

    const adminEmailsEnv = process.env.ADMIN_NOTIFICATION_EMAILS || '';
    let adminEmails = adminEmailsEnv
      .split(',')
      .map((email) => email.trim())
      .filter(Boolean);

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM;

    if (supportEmail) {
      adminEmails = [supportEmail];
    } else if (smtpHost && smtpPort && smtpUser && smtpPass && smtpFrom && adminEmails.length === 0) {
      adminEmails = (admins || []).map((admin) => admin.email).filter(Boolean);
    }

    if (adminEmails.length > 0 && smtpHost && smtpPort && smtpUser && smtpPass && smtpFrom) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort),
        secure: Number(smtpPort) === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const subject = 'New Runner Signup - Approval Needed';
      const text = [
        'A new runner just signed up and needs approval.',
        '',
        `Name: ${profile.full_name}`,
        `Email: ${profile.email}`,
        `Phone: ${profile.phone}`,
        `University: ${profile.university}`,
        `Hostel/Location: ${profile.hostel_location}`,
        `Matric Number: ${profile.matric_number || 'N/A'}`,
        '',
        'Please review in the admin dashboard.',
      ].join('\n');

      await transporter.sendMail({
        from: smtpFrom,
        to: adminEmails,
        subject,
        text,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notify admin signup error:', error);
    return NextResponse.json({ error: 'Failed to notify admins' }, { status: 500 });
  }
}
