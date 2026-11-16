import { gtcAppLang } from './gtcAppLang';
import { gtcClientContextHeaders, gtcClientOriginBodyField } from './gtcPageOrigin';
import { buildSiteVisitHeaders } from './siteVisitProof';

function readDeviceId() {
  try {
    return localStorage.getItem('device_id')?.trim() || '';
  } catch {
    return '';
  }
}

/**
 * POST /api/gtc/get-code → GTC /api/pub/get_code with site-visit headers when encryption succeeds.
 * On RSA failure, sends get_code without x-r-* (PC2.0 fallback).
 */
export async function requestGtcEmailCode(email, locale) {
  let siteHeaders = {};
  try {
    siteHeaders = await buildSiteVisitHeaders();
  } catch (err) {
    console.warn('[gtc] site visit proof skipped:', err?.message || err);
  }

  const appLang = gtcAppLang(locale);
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain, */*',
    'app-type': 'web',
    'Accept-Language': appLang,
    'X-App-Lang': appLang,
    ...gtcClientContextHeaders(),
    ...siteHeaders
  };

  const deviceId = readDeviceId();
  if (deviceId) headers['device-id'] = deviceId;

  const res = await fetch('/api/gtc/get-code', {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify({ email: String(email ?? '').trim(), type: '0', ...gtcClientOriginBodyField() })
  });

  try {
    return (await res.json()) ?? {};
  } catch {
    return {};
  }
}