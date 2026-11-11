/**
 * Server-side reCAPTCHA v2 check (RECAPTCHA_SECRET_KEY). The browser widget is src/components/shared/Recaptcha.jsx.
 * → true only when Google confirms the token; tokens are single use and expire after 2 minutes.
 */
export async function verifyRecaptcha(token, remoteip) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) throw new Error('RECAPTCHA_SECRET_KEY is not set');
  if (!token || typeof token !== 'string') return false;
  const body = new URLSearchParams({ secret, response: token, ...(remoteip ? { remoteip } : {}) });
  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', { method: 'POST', body, cache: 'no-store' });
  const data = await res.json().catch(() => null);
  return data?.success === true;
}
