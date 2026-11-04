import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { collection } from '@/lib/mongo';
import { normalizeOtp, verifyOtp } from '@/lib/otpStore';
import { liveAccountWelcomeEmail } from '@/lib/emails/liveAccountWelcome';
import { CAT5_CONTACT, CAT5_PORTAL_LOGIN } from '@/config/regions';

export const runtime = 'nodejs';

/**
 * UAE CAT 5 live account application (/en-ae/live-account-application → src/app/[locale]/marketing/live-account-application).
 * Saved only to MongoDB (MONGODB_DB → user_record); no account is opened on the trading portal.
 *
 * POST { firstname, lastname, email, otp, password, country, phone, partnerCode?, deepLink?, terms, page? }
 *   1. validates the fields,
 *   2. checks the e-mail code sent by /api/otp-smtp,
 *   3. one application per e-mail,
 *   4. inserts the record in the collection's format: name, email, password (bcrypt hash — never plain text),
 *      createdAt, plus the other form fields,
 *   5. e-mails the applicant their login details and the next steps (src/lib/emails/liveAccountWelcome.js,
 *      Mailgun); the record stays saved if the e-mail fails (welcomeEmailSent: false on the record).
 * → { ok: true } or { ok: false, error: 'invalid' | 'otp' | 'exists' | 'server' }
 */
const COLLECTION = 'user_record';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LETTERS_RE = /^[\p{L}\p{M}\s'’.-]+$/u;

const str = (v, max = 200) => String(v ?? '').trim().slice(0, max);
const fail = (error, status) => NextResponse.json({ ok: false, error }, { status });

async function sendWelcome({ name, email, password }) {
  if (!process.env.MAILGUN_API_KEY) throw new Error('MAILGUN_API_KEY is not set');
  const { MAILGUN_DOMAIN, MAILGUN_FROM, mailgunClient } = await import('@/config/nodemailer');
  const { subject, html, text } = liveAccountWelcomeEmail({ name, email, password, portalUrl: CAT5_PORTAL_LOGIN, supportEmail: CAT5_CONTACT.email });
  await mailgunClient.messages.create(MAILGUN_DOMAIN, { from: MAILGUN_FROM, to: email, subject, text, html });
}

function clientIp(request) {
  const fwd = request.headers.get('x-forwarded-for');
  return (fwd ? fwd.split(',')[0] : request.headers.get('x-real-ip') || '').trim();
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return fail('invalid', 400);
  }
  const d = {
    firstname: str(body?.firstname, 80),
    lastname: str(body?.lastname, 80),
    email: str(body?.email, 160).toLowerCase(),
    phone: str(body?.phone, 24),
    country: str(body?.country, 80),
    partnerCode: str(body?.partnerCode, 60),
    deepLink: str(body?.deepLink, 300),
    page: str(body?.page, 300)
  };
  const otp = normalizeOtp(body?.otp);
  const password = String(body?.password ?? '');
  const valid =
    LETTERS_RE.test(d.firstname) &&
    LETTERS_RE.test(d.lastname) &&
    EMAIL_RE.test(d.email) &&
    /^\+?[\d\s()-]{7,20}$/.test(d.phone) &&
    d.country.length >= 2 &&
    password.length >= 8 &&
    password.length <= 128 &&
    /^(?=.*[A-Za-z])(?=.*\d)/.test(password) &&
    body?.terms === true &&
    /^\d{6}$/.test(otp);
  if (!valid) return fail('invalid', 422);

  try {
    const records = await collection(COLLECTION);
    if (await records.findOne({ email: d.email }, { projection: { _id: 1 } })) return fail('exists', 409);
    if (!(await verifyOtp(d.email, otp)).success) return fail('otp', 400);
    const name = `${d.firstname} ${d.lastname}`;
    const { insertedId } = await records.insertOne({
      name,
      ...d,
      password: await bcrypt.hash(password, 10),
      termsAccepted: true,
      emailVerified: true,
      source: 'cat5-live-account',
      ip: clientIp(request),
      ipCountry: (request.headers.get('x-vercel-ip-country') || '').toUpperCase(),
      userAgent: str(request.headers.get('user-agent'), 300),
      createdAt: new Date()
    });
    // login details + next steps; a failed e-mail doesn't undo the application
    const sent = await sendWelcome({ name, email: d.email, password }).then(
      () => true,
      (err) => (console.error('[cat5/live-account] welcome e-mail:', err.message), false)
    );
    await records.updateOne({ _id: insertedId }, { $set: { welcomeEmailSent: sent } }).catch(() => {});
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[cat5/live-account]', err.message);
    return fail('server', 500);
  }
}
