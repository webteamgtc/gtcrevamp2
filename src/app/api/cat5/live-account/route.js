import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { collection } from '@/lib/mongo';
import { verifyOtp } from '@/lib/otpStore';

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
 *      createdAt, plus the other form fields.
 * → { ok: true } or { ok: false, error: 'invalid' | 'otp' | 'exists' | 'server' }
 */
const COLLECTION = 'user_record';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LETTERS_RE = /^[\p{L}\p{M}\s'’.-]+$/u;

const str = (v, max = 200) => String(v ?? '').trim().slice(0, max);
const fail = (error, status) => NextResponse.json({ ok: false, error }, { status });

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
  const otp = str(body?.otp, 6);
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
    if (!verifyOtp(d.email, otp).success) return fail('otp', 400);
    await records.insertOne({
      name: `${d.firstname} ${d.lastname}`,
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
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[cat5/live-account]', err.message);
    return fail('server', 500);
  }
}
