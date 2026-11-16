/**
 * GTC PC2.0 site-visit proof: POST rsa_key → encrypt proof JSON → x-r-a / x-r-b / x-r-c headers.
 * @see project RSA configuration doc (scene=site_visit, client=pc)
 */
import { rsaOaepEncryptJson } from './rsaCrypto';
import { gtcClientContextHeaders, gtcClientOriginBodyField, siteVisitHostname } from './gtcPageOrigin';

const SUPPORTED_ALG = new Set([
  'RSA-OAEP',
  'RSA-OAEP-256',
  'RSA-OAEP-SHA256',
  'RSA-OAEP-SHA-256',
  'RSA-OAEP/SHA-256',
  'RSA/OAEP-SHA256'
]);

function normalizeAlg(alg) {
  return String(alg ?? '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '')
    .replace(/\//g, '-');
}

/** Accept wrapped `{ code:200, data }` or a raw config object. */
export function parseRsaKeyPayload(json) {
  const data = json?.code === 200 ? json.data : json?.kid ? json : null;
  if (!data?.kid || !data?.public_key || !data?.nonce) throw new Error('INVALID_RSA_CONFIG');

  if (data.alg && !SUPPORTED_ALG.has(normalizeAlg(data.alg))) throw new Error('UNSUPPORTED_RSA_ALG');

  if (data.expires_in != null && data.expires_in !== '') {
    const expires = Number(data.expires_in);
    if (!Number.isFinite(expires) || expires <= 0) throw new Error('INVALID_RSA_CONFIG');
  }

  return data;
}

/** @param {string} [appLang] GTC `Accept-Language` / `X-App-Lang` (from gtcAppLang). */
export async function fetchRsaKeyConfig(appLang = 'en') {
  const res = await fetch('/api/gtc/rsa-key', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*',
      'app-type': 'web',
      'Accept-Language': appLang,
      'X-App-Lang': appLang,
      ...gtcClientContextHeaders()
    },
    credentials: 'include',
    body: JSON.stringify({ scene: 'site_visit', client: 'pc', ...gtcClientOriginBodyField() })
  });
  const json = await res.json().catch(() => ({}));
  if (json?.code === 200 || json?.kid) return parseRsaKeyPayload(json);
  if (!res.ok) throw new Error('RSA_KEY_HTTP');
  return parseRsaKeyPayload(json);
}

/** @param {Awaited<ReturnType<typeof fetchRsaKeyConfig>>} key */
export async function encryptSiteVisitHeaders(key) {
  const payload = {
    v: 1,
    kid: key.kid,
    scene: 'site_visit',
    nonce: key.nonce,
    ts: Date.now(),
    client: 'pc',
    h: siteVisitHostname()
  };

  const ciphertext = await rsaOaepEncryptJson(key, JSON.stringify(payload));
  return {
    'x-r-a': 'v1',
    'x-r-b': key.kid,
    'x-r-c': `rsa:v1:${key.kid}:${ciphertext}`
  };
}

/** Fresh rsa_key + encrypted headers for each send attempt. */
export async function buildSiteVisitHeaders(appLang = 'en') {
  const key = await fetchRsaKeyConfig(appLang);
  return encryptSiteVisitHeaders(key);
}