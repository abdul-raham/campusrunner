const base = (content: string) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08)">
        <tr><td style="background:#0F3D2E;padding:24px 32px;text-align:center">
          <span style="color:#D4AF37;font-size:22px;font-weight:800;letter-spacing:.5px">🏃 CampusRunner</span>
        </td></tr>
        <tr><td style="padding:32px">${content}</td></tr>
        <tr><td style="background:#f9f9f9;padding:16px 32px;text-align:center;font-size:12px;color:#888">
          © CampusRunner · You're receiving this because you have an account with us.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

const btn = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;margin-top:20px;padding:12px 28px;background:#0F3D2E;color:#D4AF37;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px">${label}</a>`;

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const emails = {
  orderAccepted: (studentName: string, orderTitle: string, runnerName: string, orderId: string) => ({
    subject: '✅ Runner Accepted Your Order — CampusRunner',
    html: base(`
      <h2 style="color:#0F3D2E;margin:0 0 8px">Your order has been accepted!</h2>
      <p style="color:#555;margin:0 0 16px">Hi ${studentName},</p>
      <p style="color:#555"><strong>${runnerName}</strong> has accepted your order <strong>"${orderTitle}"</strong> and will start working on it soon.</p>
      <table width="100%" style="background:#f0f7f4;border-radius:8px;padding:16px;margin:16px 0" cellpadding="0" cellspacing="0">
        <tr><td style="font-size:13px;color:#0F3D2E"><strong>Order:</strong> ${orderTitle}</td></tr>
        <tr><td style="font-size:13px;color:#0F3D2E;padding-top:6px"><strong>Runner:</strong> ${runnerName}</td></tr>
        <tr><td style="font-size:13px;color:#0F3D2E;padding-top:6px"><strong>Status:</strong> Accepted</td></tr>
      </table>
      ${btn(`${appUrl}/student/orders/${orderId}`, 'Track Your Order')}
    `),
  }),

  orderInProgress: (studentName: string, orderTitle: string, runnerName: string, orderId: string) => ({
    subject: '🚀 Your Order Is In Progress — CampusRunner',
    html: base(`
      <h2 style="color:#0F3D2E;margin:0 0 8px">Runner is on the way!</h2>
      <p style="color:#555;margin:0 0 16px">Hi ${studentName},</p>
      <p style="color:#555"><strong>${runnerName}</strong> has started working on your order <strong>"${orderTitle}"</strong>.</p>
      <table width="100%" style="background:#f0f7f4;border-radius:8px;padding:16px;margin:16px 0" cellpadding="0" cellspacing="0">
        <tr><td style="font-size:13px;color:#0F3D2E"><strong>Order:</strong> ${orderTitle}</td></tr>
        <tr><td style="font-size:13px;color:#0F3D2E;padding-top:6px"><strong>Status:</strong> In Progress</td></tr>
      </table>
      ${btn(`${appUrl}/student/orders/${orderId}`, 'Track Your Order')}
    `),
  }),

  orderCompleted: (studentName: string, orderTitle: string, runnerName: string, orderId: string, amount: number) => ({
    subject: '🎉 Order Delivered! — CampusRunner',
    html: base(`
      <h2 style="color:#0F3D2E;margin:0 0 8px">Your order has been delivered!</h2>
      <p style="color:#555;margin:0 0 16px">Hi ${studentName},</p>
      <p style="color:#555"><strong>${runnerName}</strong> has completed your order <strong>"${orderTitle}"</strong>.</p>
      <table width="100%" style="background:#f0f7f4;border-radius:8px;padding:16px;margin:16px 0" cellpadding="0" cellspacing="0">
        <tr><td style="font-size:13px;color:#0F3D2E"><strong>Order:</strong> ${orderTitle}</td></tr>
        <tr><td style="font-size:13px;color:#0F3D2E;padding-top:6px"><strong>Amount Charged:</strong> ₦${amount.toLocaleString()}</td></tr>
        <tr><td style="font-size:13px;color:#0F3D2E;padding-top:6px"><strong>Status:</strong> Completed ✅</td></tr>
      </table>
      ${btn(`${appUrl}/student/orders/${orderId}`, 'View Order')}
    `),
  }),

  runnerCredited: (runnerName: string, orderTitle: string, amount: number, orderId: string) => ({
    subject: '💰 You\'ve Been Credited — CampusRunner',
    html: base(`
      <h2 style="color:#0F3D2E;margin:0 0 8px">Payment received!</h2>
      <p style="color:#555;margin:0 0 16px">Hi ${runnerName},</p>
      <p style="color:#555">You've been credited for completing the order <strong>"${orderTitle}"</strong>.</p>
      <table width="100%" style="background:#f0f7f4;border-radius:8px;padding:16px;margin:16px 0" cellpadding="0" cellspacing="0">
        <tr><td style="font-size:13px;color:#0F3D2E"><strong>Order:</strong> ${orderTitle}</td></tr>
        <tr><td style="font-size:20px;font-weight:800;color:#0F3D2E;padding-top:8px">₦${amount.toLocaleString()}</td></tr>
      </table>
      ${btn(`${appUrl}/runner/earnings`, 'View Earnings')}
    `),
  }),

  newOrderPlaced: (studentName: string, orderTitle: string, orderId: string, amount: number) => ({
    subject: '📦 Order Placed Successfully — CampusRunner',
    html: base(`
      <h2 style="color:#0F3D2E;margin:0 0 8px">Order placed!</h2>
      <p style="color:#555;margin:0 0 16px">Hi ${studentName},</p>
      <p style="color:#555">Your order <strong>"${orderTitle}"</strong> has been placed and we're finding a runner for you.</p>
      <table width="100%" style="background:#f0f7f4;border-radius:8px;padding:16px;margin:16px 0" cellpadding="0" cellspacing="0">
        <tr><td style="font-size:13px;color:#0F3D2E"><strong>Order:</strong> ${orderTitle}</td></tr>
        <tr><td style="font-size:13px;color:#0F3D2E;padding-top:6px"><strong>Budget:</strong> ₦${amount.toLocaleString()}</td></tr>
        <tr><td style="font-size:13px;color:#0F3D2E;padding-top:6px"><strong>Status:</strong> Pending — finding a runner</td></tr>
      </table>
      ${btn(`${appUrl}/student/orders/${orderId}`, 'Track Order')}
    `),
  }),
};
