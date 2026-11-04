/**
 * One-time codes for phone or email verification (server only). `identifier` is a phone number or an email.
 * In-memory per process, plus MongoDB (`email_otp` collection) when MONGODB_URI is set so OTP survives
 * serverless cold starts and works across instances. Codes expire after 10 minutes and are deleted once verified.
 */
import { randomInt } from 'crypto';
import { collection } from '@/lib/mongo';

const TTL = 10 * 60 * 1000;
const OTP_COLLECTION = 'email_otp';
const store = (global.__gtcOtpStore ??= new Map());

const keyOf = (id = '') => {
  const s = String(id).trim();
  return s.includes('@') ? `email:${s.toLowerCase()}` : `phone:${s.replace(/\D/g, '')}`;
};

/** Six digits, preserving leading zeros (e.g. "012345"). */
export function normalizeOtp(otp) {
  const digits = String(otp ?? '').replace(/\D/g, '');
  if (!digits) return '';
  return digits.padStart(6, '0').slice(-6);
}

async function mongoGet(key) {
  if (!process.env.MONGODB_URI) return null;
  try {
    const col = await collection(OTP_COLLECTION);
    const doc = await col.findOne({ _id: key });
    if (!doc?.otp) return null;
    const expiresAt = doc.expiresAt instanceof Date ? doc.expiresAt.getTime() : Number(doc.expiresAt);
    return { otp: String(doc.otp), expiresAt };
  } catch (err) {
    console.error('[otpStore] read:', err.message);
    return null;
  }
}

async function mongoSet(key, entry) {
  if (!process.env.MONGODB_URI) return;
  try {
    const col = await collection(OTP_COLLECTION);
    await col.updateOne({ _id: key }, { $set: { otp: entry.otp, expiresAt: new Date(entry.expiresAt) } }, { upsert: true });
  } catch (err) {
    console.error('[otpStore] write:', err.message);
  }
}

async function mongoDel(key) {
  if (!process.env.MONGODB_URI) return;
  try {
    const col = await collection(OTP_COLLECTION);
    await col.deleteOne({ _id: key });
  } catch (err) {
    console.error('[otpStore] delete:', err.message);
  }
}

/** New 6-digit code for a phone number or email (replaces any previous one). */
export function createOtp(identifier) {
  const key = keyOf(identifier);
  const otp = String(randomInt(0, 1_000_000)).padStart(6, '0');
  const entry = { otp, expiresAt: Date.now() + TTL };
  store.set(key, entry);
  void mongoSet(key, entry);
  return otp;
}

/** → { success, message } */
export async function verifyOtp(identifier, otp) {
  const key = keyOf(identifier);
  let entry = store.get(key);
  if (!entry) {
    entry = await mongoGet(key);
    if (entry) store.set(key, entry);
  }
  if (!entry) return { success: false, message: 'No OTP found. Please request a new OTP.' };
  if (entry.expiresAt < Date.now()) {
    store.delete(key);
    void mongoDel(key);
    return { success: false, message: 'OTP has expired. Please request a new OTP.' };
  }
  const code = normalizeOtp(otp);
  if (entry.otp !== code) return { success: false, message: 'Invalid OTP. Please try again.' };
  store.delete(key);
  void mongoDel(key);
  return { success: true, message: 'OTP verified successfully.' };
}
