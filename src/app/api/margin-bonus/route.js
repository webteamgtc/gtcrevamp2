import { NextResponse } from 'next/server';
import { isDbConfigured, query } from '@/lib/db';
import { marginBonusCollection, marginBonusEmailExists } from '@/lib/mongo';
import { verifyOtp } from '@/lib/otpStore';
import { businessEmailRejectReason } from '@/lib/emailValidation';

export const runtime = 'nodejs';

/**
 * Margin Bonus sign-up (form on /trading/margin-bonus). Also mounted at /api/trading/margin-bonus.
 *
 * GET ?email=… → { registered } — GTCFX client (Client_mail_list).
 *
 * POST → validates, OTP, saves to MongoDB (margin_bonus.bonus-form), e-mails support@gtcfx.com (cc adeel.nazeer@gtcfx.com), optional Zapier.
 */
const ZAPIER_HOOK = process.env.MARGIN_BONUS_ZAPIER_URL?.trim() || 'https://hooks.zapier.com/hooks/catch/16420445/3kq25sj/';
const SUBJECT = 'Margin Bonus application';
const NOTIFY_TO = process.env.MARGIN_BONUS_NOTIFY_TO?.trim() || 'support@gtcfx.com';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LETTERS_RE = /^[\p{L}\p{M}\s'’.-]+$/u;

const str = (v, max = 200) => String(v ?? '').trim().slice(0, max);
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const DEV = process.env.NODE_ENV !== 'production';
const fail = (error, status, cause) => NextResponse.json({ ok: false, error, ...(DEV && cause ? { detail: cause.message } : {}) }, { status });

/** Registered client e-mail (Azure SQL). Skipped when `MARGIN_BONUS_SKIP_CLIENT_CHECK=true` or SQL unreachable in dev. */
async function isClient(email) {
  if (process.env.MARGIN_BONUS_SKIP_CLIENT_CHECK === 'true') return true;
  if (!isDbConfigured()) {
    if (DEV) {
      console.warn('[margin-bonus] SQL not configured — skipping client check (dev only)');
      return true;
    }
    throw new Error('Client database is not configured');
  }
  try {
    return (await query('SELECT TOP 1 email FROM Client_mail_list WHERE email = @email', { email })).length > 0;
  } catch (err) {
    if (DEV) {
      console.warn('[margin-bonus] SQL unreachable — skipping client check (dev only):', err.message);
      return true;
    }
    throw err;
  }
}

const hasApplied = (email) => marginBonusEmailExists(email);

function campaignCode(date = new Date()) {
  return `${date.getDate()}${date.toLocaleString('en', { month: 'short' }).toLowerCase()}${date.getFullYear()}`;
}

function clientIp(request) {
  const fwd = request.headers.get('x-forwarded-for');
  return (fwd ? fwd.split(',')[0] : request.headers.get('x-real-ip') || '').trim();
}

async function saveToMongo(d) {
  const coll = await marginBonusCollection();
  const email = d.email.toLowerCase();
  if (await coll.findOne({ email }, { projection: { _id: 1 } })) {
    const err = new Error('already applied');
    err.code = 'ALREADY_APPLIED';
    throw err;
  }
  const submittedAt = new Date();
  const doc = {
    Full_name: d.Full_name,
    email,
    phone: d.phone,
    account_no: d.account_no,
    deposit_amount: d.deposit_amount,
    country: d.country,
    terms: d.terms,
    utm_campain: d.utm_campain,
    utm_source: d.utm_source,
    fbclid: d.fbclid,
    qr_code_id: d.qr_code_id,
    user_referrer: d.user_referrer,
    ip: d.ip,
    campaign_code: campaignCode(submittedAt),
    campaign_name: d.utm_campain.replace(/^\//, ''),
    submittedAt
  };
  const inserted = await coll.insertOne(doc);
  if (!inserted.acknowledged) throw new Error('Mongo insert failed');
}

async function sendEmail(d) {
  if (!process.env.MAILGUN_API_KEY) throw new Error('MAILGUN_API_KEY is not set');
  const { MAILGUN_DOMAIN, mailgunClient, MAILGUN_FROM } = await import('@/config/nodemailer');
  const rows = [
    ['Full name', d.Full_name],
    ['Email', d.email],
    ['Phone', d.phone],
    ['Account number', d.account_no],
    ['Deposit amount', `$${d.deposit_amount}`],
    ['Country', d.country],
    ['Page', d.utm_campain],
    ['UTM source', d.utm_source],
    ['IP', d.ip],
    ['Submitted', new Date().toUTCString()]
  ];
  const html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#0d153a">
    <h2 style="color:#293b93;margin:0 0 16px">${SUBJECT}</h2>
    <table style="width:100%;border-collapse:collapse;border:1px solid #e6e9f2">${rows
      .map(([k, v]) => `<tr><td style="padding:10px 14px;width:35%;background:#f6f7fb;font-size:13px;color:#6b7194;border-bottom:1px solid #e6e9f2">${k}</td><td style="padding:10px 14px;font-size:14px;border-bottom:1px solid #e6e9f2">${esc(v) || '—'}</td></tr>`)
      .join('')}</table></div>`;
  const text = rows.map(([k, v]) => `${k}: ${v || '—'}`).join('\n');
  await mailgunClient.messages.create(MAILGUN_DOMAIN, {
    from: MAILGUN_FROM,
    to: NOTIFY_TO,
    'h:Reply-To': d.email,
    subject: `${SUBJECT} — ${d.Full_name} (${d.account_no})`,
    text,
    html
  });
}

async function sendZapier(d) {
  const res = await fetch(ZAPIER_HOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) });
  if (!res.ok) throw new Error(`Zapier ${res.status}`);
}

export async function GET(request) {
  const email = str(new URL(request.url).searchParams.get('email'), 160);
  if (!EMAIL_RE.test(email)) return NextResponse.json({ registered: false }, { status: 400 });
  try {
    const [registered, alreadyApplied] = await Promise.all([isClient(email), hasApplied(email)]);
    return NextResponse.json({ registered, alreadyApplied });
  } catch (err) {
    console.error('[margin-bonus] client check:', err.message);
    return NextResponse.json({ registered: null, ...(DEV ? { detail: err.message } : {}) }, { status: 500 });
  }
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return fail('invalid', 400);
  }
  const d = {
    Full_name: str(body?.Full_name, 100),
    email: str(body?.email, 160),
    phone: str(body?.phone, 24),
    account_no: str(body?.account_no, 12),
    deposit_amount: str(body?.deposit_amount, 12),
    country: str(body?.country, 80),
    terms: body?.terms === true,
    utm_campain: str(body?.utm_campain, 300),
    utm_source: str(body?.utm_source, 200),
    fbclid: str(body?.fbclid, 300),
    qr_code_id: str(body?.qr_code_id, 100),
    user_referrer: str(body?.user_referrer, 300),
    ip: clientIp(request)
  };
  const otp = str(body?.otp, 6);
  if (businessEmailRejectReason(d.email)) return fail('invalid', 422);
  const valid =
    d.Full_name.length >= 2 &&
    LETTERS_RE.test(d.Full_name) &&
    EMAIL_RE.test(d.email) &&
    /^\+?[\d\s()-]{7,20}$/.test(d.phone) &&
    /^\d{6,8}$/.test(d.account_no) &&
    Number(d.deposit_amount) > 0 &&
    d.country.length >= 2 &&
    d.terms &&
    /^\d{6}$/.test(otp);
  if (!valid) return fail('invalid', 422);

  try {
    if (await hasApplied(d.email)) return fail('alreadyApplied', 409);
    if (!(await isClient(d.email))) return fail('notRegistered', 403);
    if (!(await verifyOtp(d.email, otp)).success) return fail('otp', 400);

    await saveToMongo(d);
  } catch (err) {
    if (err?.code === 'ALREADY_APPLIED') return fail('alreadyApplied', 409);
    console.error('[margin-bonus] database:', err.message);
    return fail('server', 500, err);
  }

  const [zapier, email] = await Promise.allSettled([sendZapier(d), sendEmail(d)]);
  if (zapier.status === 'rejected') console.error('[margin-bonus] Zapier:', zapier.reason?.message);
  if (email.status === 'rejected') console.error('[margin-bonus] Mailgun:', email.reason?.message);
  return NextResponse.json({ ok: true });
}