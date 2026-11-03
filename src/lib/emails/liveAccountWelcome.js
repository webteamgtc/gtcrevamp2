/**
 * Welcome e-mail after a live account application (UAE CAT 5 form → /api/cat5/live-account):
 * the login details, a button to the client portal and the steps to complete the profile and upload documents.
 * Same look as the OTP e-mail (/api/otp-smtp). Returns { subject, html, text }.
 */
const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const STEPS = [
  ['Log in to the client portal', 'Use the login details below to sign in.'],
  ['Complete your profile', 'Fill in your personal details, address and financial information.'],
  ['Upload your documents', 'A valid passport or national ID, and a proof of address (utility bill or bank statement) dated within the last 3 months.'],
  ['Verification', 'Our team reviews your documents and confirms your account by e-mail, usually within 1–2 business days.']
];

export function liveAccountWelcomeEmail({ name, email, password, portalUrl, supportEmail }) {
  const subject = 'Welcome to GTCFX — your login details and next steps';
  const steps = STEPS.map(
    ([title, text], i) => `
          <tr>
            <td style="width:44px;vertical-align:top;padding:0 0 18px;">
              <div style="width:32px;height:32px;border-radius:16px;background:#192055;color:#ffffff;font-size:14px;font-weight:700;line-height:32px;text-align:center;">${i + 1}</div>
            </td>
            <td style="vertical-align:top;padding:4px 0 18px;">
              <div style="font-size:15px;font-weight:700;color:#192055;">${esc(title)}</div>
              <div style="font-size:13px;line-height:20px;color:#4b5563;margin-top:2px;">${esc(text)}</div>
            </td>
          </tr>`
  ).join('');

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background-color:#F7F7F7;font-family:Arial,sans-serif;color:#111827;line-height:22px;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="width:100%;"><tr><td align="center" bgcolor="#F7F7F7" style="padding:24px 12px;">
    <div style="max-width:560px;margin:0 auto;background-color:#192055;padding:5px;border-radius:40px;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="border-radius:36px;padding:28px;background-color:#ffffff;width:100%;">
        <tr><td style="padding:4px 0 20px;text-align:center;"><img src="https://gtcfx-bucket.s3.ap-southeast-1.amazonaws.com/email-test.png" alt="GTCFX" style="max-width:165px;height:auto;"></td></tr>
        <tr><td>
          <h2 style="color:#ffffff;text-align:center;font-size:16px;margin:0 auto 28px;padding:10px 16px;background:#192055;border-radius:27px;max-width:80%;">Your application has been received</h2>
          <p style="font-size:16px;color:#192055;margin:0 0 12px;"><strong>Dear ${esc(name || 'Client')},</strong></p>
          <p style="margin:0 0 12px;">Thank you for applying for a live account with GTCFX. To activate your account, please follow the steps below to complete your profile and upload your documents.</p>

          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width:100%;margin:22px 0 8px;">${steps}
          </table>

          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width:100%;margin:6px 0 22px;background:#f6f7fb;border:1px solid #e6e9f2;border-radius:16px;">
            <tr><td style="padding:16px 20px 6px;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#6b7194;">Your login details</td></tr>
            <tr><td style="padding:4px 20px;font-size:14px;"><span style="color:#6b7194;">Login URL:</span> <a href="${esc(portalUrl)}" style="color:#293b93;font-weight:700;">${esc(portalUrl.replace(/^https?:\/\//, ''))}</a></td></tr>
            <tr><td style="padding:4px 20px;font-size:14px;"><span style="color:#6b7194;">E-mail:</span> <strong style="color:#192055;">${esc(email)}</strong></td></tr>
            <tr><td style="padding:4px 20px 16px;font-size:14px;"><span style="color:#6b7194;">Password:</span> <strong style="color:#192055;font-family:Consolas,Menlo,monospace;letter-spacing:0.5px;">${esc(password)}</strong></td></tr>
          </table>

          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0 auto 22px;"><tr><td style="border-radius:30px;background:#293b93;">
            <a href="${esc(portalUrl)}" style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:30px;">Log in and complete your profile</a>
          </td></tr></table>

          <p style="margin:0 0 12px;padding:12px 16px;background:#fff8ec;border:1px solid #f1dfbf;border-radius:12px;font-size:13px;line-height:20px;color:#7a5418;"><strong>Keep your account safe:</strong> change your password after your first login, delete this e-mail once you have done so, and never share your login details with anyone. GTCFX will never ask for your password.</p>
          <p style="margin:0 0 12px;">If you have any questions, contact us at <a href="mailto:${esc(supportEmail)}" style="color:#5166ff;">${esc(supportEmail)}</a>.</p>
          <p style="line-height:30px;padding-top:12px;margin:0;">Best Regards,<br><strong style="color:#192055;">GTCFX Team</strong></p>
        </td></tr>
        <tr><td style="padding:24px 0 0;font-size:9px;line-height:13px;color:#000;">
          <p style="margin:0 0 6px;">Company name: GTC FX / Website: www.gtcfx.com / Email: ${esc(supportEmail)}</p>
          <p style="margin:0 0 6px;">You received this e-mail because this address was used to apply for a live account on www.gtcfx.com. If this wasn't you, please contact ${esc(supportEmail)}.</p>
          <p style="margin:0;">Disclaimers: The information in this email is for general purposes only and does not constitute personal financial advice. Investing in contract for difference products carries significant risks and may not be suitable for all investors.</p>
        </td></tr>
      </table>
    </div>
  </td></tr></table>
</body></html>`;

  const text = [
    `Dear ${name || 'Client'},`,
    '',
    'Thank you for applying for a live account with GTCFX. To activate your account, please follow the steps below to complete your profile and upload your documents.',
    '',
    ...STEPS.map(([title, t], i) => `${i + 1}. ${title} — ${t}`),
    '',
    'Your login details',
    `Login URL: ${portalUrl}`,
    `E-mail: ${email}`,
    `Password: ${password}`,
    '',
    'Keep your account safe: change your password after your first login, delete this e-mail once you have done so, and never share your login details. GTCFX will never ask for your password.',
    '',
    `Questions? Contact ${supportEmail}.`,
    '',
    'Best Regards,',
    'GTCFX Team'
  ].join('\n');

  return { subject, html, text };
}
