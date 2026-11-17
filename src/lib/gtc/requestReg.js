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

/** POST /api/gtc/reg — same client context + site-visit proof as get_code (PC2.0). */
export async function requestGtcRegistration(payload, locale) {
  const appLang = gtcAppLang(locale);
  let siteHeaders;
  try {
    siteHeaders = await buildSiteVisitHeaders(appLang);
  } catch (err) {
    console.error('[gtc] site visit proof failed (reg):', err?.message || err);
    return {
      code: 500,
      message: 'Could not verify request source. Please refresh and try again.',
      data: []
    };
  }

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

  const res = await fetch('/api/gtc/reg', {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify({
      ...payload,
      ...gtcClientOriginBodyField(),
      site_visit: siteHeaders
    })
  });

  try {
    return (await res.json()) ?? {};
  } catch {
    return {};
  }
}