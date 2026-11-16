import { gtcAppLang } from './gtcAppLang';
import { gtcClientContextHeaders, gtcClientOriginBodyField } from './gtcPageOrigin';

function readDeviceId() {
  try {
    return localStorage.getItem('device_id')?.trim() || '';
  } catch {
    return '';
  }
}

/** POST /api/gtc/check-email with the same client context headers as get-code. */
export async function requestGtcCheckEmail(email, locale) {
  const appLang = gtcAppLang(locale);
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain, */*',
    'app-type': 'web',
    'Accept-Language': appLang,
    'X-App-Lang': appLang,
    ...gtcClientContextHeaders()
  };
  const deviceId = readDeviceId();
  if (deviceId) headers['device-id'] = deviceId;

  const res = await fetch('/api/gtc/check-email', {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify({ email: String(email ?? '').trim(), ...gtcClientOriginBodyField() })
  });
  try {
    return (await res.json()) ?? {};
  } catch {
    return {};
  }
}