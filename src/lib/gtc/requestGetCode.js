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
 * POST /api/gtc/get-code → GTC /api/pub/get_code with PC2.0 site-visit headers (x-r-a/b/c).
 * Proof is built in the browser (rsa_key + RSA-OAEP); headers are also sent in the JSON body
 * so the Next proxy can forward them even if a layer strips custom headers.
 */
export async function requestGtcEmailCode(email, locale) {
  const appLang = gtcAppLang(locale);
  let siteHeaders;
  try {
    siteHeaders = await buildSiteVisitHeaders(appLang);
  } catch (err) {
    console.error('[gtc] site visit proof failed:', err?.message || err);
    return {
      code: 500,
      message: 'Could not initialize verification. Please refresh the page and try again.',
      data: []
    };
  }
  if (!siteHeaders['x-r-c']) {
    return { code: 500, message: 'Verification setup incomplete.', data: [] };
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

  const res = await fetch('/api/gtc/get-code', {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify({
      email: String(email ?? '').trim(),
      type: '0',
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