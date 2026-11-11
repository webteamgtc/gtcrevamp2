/**
 * Business-email rules shared by the forms (client side) and APIs (server side):
 * disposable / throwaway domains (MailChecker, 4k+ providers), reserved TLDs (.invalid, …),
 * and no plus aliases (name+tag@…) except on our own domain.
 */
import MailChecker from 'mailchecker';

export const BUSINESS_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Domains where plus-address aliases (e.g. team+test@…) are allowed for internal QA. */
export const PLUS_ALIAS_ALLOWED_DOMAINS = ['gtcfx.com'];

/** Reserved / documentation domains merged into MailChecker (in addition to its built-in list). */
const EXTRA_DISPOSABLE_DOMAINS = ['example.com', 'example.net', 'example.org', 'example.invalid', 'test.com', 'test.invalid', 'localhost'];

/** TLDs that must not receive real user submissions (RFC / reserved). */
const BLOCKED_EMAIL_TLDS = new Set(['invalid', 'test', 'example', 'localhost']);

let extrasRegistered = false;
function registerExtras() {
  if (extrasRegistered) return;
  MailChecker.addCustomDomains(EXTRA_DISPOSABLE_DOMAINS);
  extrasRegistered = true;
}

/** @deprecated Use MailChecker; kept for docs / tests — not a full list. */
export const BLOCKED_EMAIL_DOMAINS = EXTRA_DISPOSABLE_DOMAINS;

function domainIsBlocked(domain) {
  registerExtras();
  const d = domain.toLowerCase();
  const tld = d.split('.').pop() || '';
  if (BLOCKED_EMAIL_TLDS.has(tld)) return true;
  const probe = `validate@${d}`;
  if (!BUSINESS_EMAIL_RE.test(probe)) return true;
  return !MailChecker.isValid(probe);
}

/** → { valid, reason: 'valid' | 'required' | 'invalid' | 'blocked_domain' | 'plus_alias' } */
export function validateBusinessEmail(email) {
  if (!email || typeof email !== 'string') return { valid: false, reason: 'required' };
  const trimmed = email.trim().toLowerCase();
  if (!BUSINESS_EMAIL_RE.test(trimmed)) return { valid: false, reason: 'invalid' };
  const at = trimmed.indexOf('@');
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);
  if (domainIsBlocked(domain)) return { valid: false, reason: 'blocked_domain' };
  if (local.includes('+') && !PLUS_ALIAS_ALLOWED_DOMAINS.includes(domain)) return { valid: false, reason: 'plus_alias' };
  return { valid: true, reason: 'valid' };
}

/** Server routes: returns `reason` when the e-mail must be rejected, otherwise `null`. */
export function businessEmailRejectReason(email) {
  const result = validateBusinessEmail(email);
  return result.valid ? null : result.reason;
}
