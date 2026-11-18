/**
 * Cookie consent (browser only) — used on the UAE CAT 5 website, where analytics and advertising tags wait for the
 * visitor's choice (src/components/shared/consent/ConsentScripts.jsx, src/app/[locale]/marketing/components/Cat5CookieConsent.jsx).
 *
 * Stored in the first-party cookie `gtc_consent` (180 days) as JSON: { v, analytics, advertising, at }.
 * "Necessary" cookies are always on and not stored. Changes are broadcast with the `gtc:consent` window event;
 * `gtc:consent-open` asks the consent modal to open (footer "Cookie Settings").
 */
import { COOKIES } from '@/config/regions';

export const CONSENT_COOKIE = 'gtc_consent';
export const CONSENT_VERSION = 1; // bump to ask everyone again (e.g. new cookie categories)
const MAX_AGE = 60 * 60 * 24 * 180;
export const CONSENT_EVENT = 'gtc:consent';
export const CONSENT_OPEN_EVENT = 'gtc:consent-open';

function readCookie(name) {
  if (typeof document === 'undefined') return null;
  const hit = document.cookie.split('; ').find((c) => c.startsWith(`${name}=`));
  return hit ? decodeURIComponent(hit.slice(name.length + 1)) : null;
}

/** True when the proxy put this visitor on the UAE CAT 5 website (src/proxy.js → gtc_uae_cat=5). */
export const isCat5Visitor = () => readCookie(COOKIES.uaeCategory) === '5';

/** Saved choice → { analytics, advertising, at } or null when the visitor hasn't chosen (or the version changed). */
export function getConsent() {
  try {
    const c = JSON.parse(readCookie(CONSENT_COOKIE) ?? 'null');
    return c && c.v === CONSENT_VERSION ? { analytics: Boolean(c.analytics), advertising: Boolean(c.advertising), at: c.at } : null;
  } catch {
    return null;
  }
}

/**
 * Save a choice. A later change reloads the page: running scripts can't be unloaded, and tags that already ran
 * (next/script runs each once) wouldn't pick up a newly accepted category.
 */
export function setConsent({ analytics, advertising }) {
  const prev = getConsent();
  const value = { v: CONSENT_VERSION, analytics: Boolean(analytics), advertising: Boolean(advertising), at: new Date().toISOString() };
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(value))}; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax${secure}`;
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
  if (prev && (prev.analytics !== value.analytics || prev.advertising !== value.advertising)) location.reload();
}

export const openConsentSettings = () => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
