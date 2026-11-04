import { CAT5_PORTAL_LOGIN } from '@/config/regions';

/**
 * Client portal hand-off after a successful CAT 5 registration.
 * Query param names and base URL can be tuned to match the portal login page (Vercel env).
 *
 *   NEXT_PUBLIC_CAT5_PORTAL_LOGIN — login page (default: CAT5_PORTAL_LOGIN)
 *   NEXT_PUBLIC_CAT5_PORTAL_EMAIL_PARAM — default `email`
 *   NEXT_PUBLIC_CAT5_PORTAL_PASSWORD_PARAM — default `password`
 *   NEXT_PUBLIC_CAT5_PORTAL_INCLUDE_PASSWORD=0 — omit password from the URL
 */
export function buildCat5PortalRedirectUrl({ email, password } = {}) {
  const base = process.env.NEXT_PUBLIC_CAT5_PORTAL_LOGIN || CAT5_PORTAL_LOGIN;
  const emailKey = process.env.NEXT_PUBLIC_CAT5_PORTAL_EMAIL_PARAM || 'email';
  const passwordKey = process.env.NEXT_PUBLIC_CAT5_PORTAL_PASSWORD_PARAM || 'password';
  const includePassword = process.env.NEXT_PUBLIC_CAT5_PORTAL_INCLUDE_PASSWORD !== '0';

  try {
    const url = new URL(base);
    const trimmedEmail = String(email ?? '').trim();
    if (trimmedEmail) url.searchParams.set(emailKey, trimmedEmail);
    if (includePassword && password) url.searchParams.set(passwordKey, String(password));
    return url.toString();
  } catch {
    return CAT5_PORTAL_LOGIN;
  }
}

/** When not `0`, successful CAT 5 submit navigates to the portal (see LiveApplicationForm). */
export function cat5AutoRedirectToPortal() {
  return process.env.NEXT_PUBLIC_CAT5_PORTAL_AUTO_REDIRECT !== '0';
}
