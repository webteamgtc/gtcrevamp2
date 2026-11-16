import { gtcPortalIsStaging } from '@/lib/gtc/portalApi';

function hostFromUrl(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

function isLocalHost(hostname) {
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

function normalizePageOrigin(raw) {
  const s = String(raw ?? '').trim();
  if (!s) return '';
  if (hostFromUrl(s) === '127.0.0.1') {
    try {
      const u = new URL(s);
      u.hostname = 'localhost';
      return u.origin.replace(/\/$/, '');
    } catch {
      return s.replace(/\/$/, '');
    }
  }
  try {
    return new URL(s).origin;
  } catch {
    return s.replace(/\/$/, '');
  }
}

function resolveGtcOrigin(req, bodyOrigin) {
  // PC2.0: Origin must match the encrypted site-visit proof `h` from the browser — prefer client context first.
  const fromBody = normalizePageOrigin(bodyOrigin);
  if (fromBody) return fromBody;

  const clientOrigin = normalizePageOrigin(req.headers.get('x-gtc-client-origin'));
  if (clientOrigin) return clientOrigin;

  const browserOrigin = normalizePageOrigin(req.headers.get('origin'));
  if (browserOrigin) return browserOrigin;

  const envOrigin =
    process.env.GTC_PORTAL_ORIGIN?.trim() ||
    (process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://www.gtcfx.com' : '');
  if (envOrigin) return envOrigin.replace(/\/$/, '');

  const host = (req.headers.get('x-forwarded-host') || req.headers.get('host') || '').split(',')[0].trim();
  if (!host) return '';

  const proto = (req.headers.get('x-forwarded-proto') || 'https').split(',')[0].trim();
  const normalizedHost = host.replace(/^127\.0\.0\.1/i, 'localhost');
  return `${proto}://${normalizedHost}`;
}

/** Staging expects Origin + proof `h`; production rejects localhost Origin (check_email omits it). */
function shouldAttachOrigin(origin) {
  if (!origin) return false;
  if (process.env.GTC_PORTAL_ORIGIN?.trim()) return true;
  if (gtcPortalIsStaging()) return true;
  return !isLocalHost(hostFromUrl(origin));
}

/** Forward browser context and GTC business headers to the portal API. */
export function gtcUpstreamHeaders(req, extra = {}, opts = {}) {
  const out = {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain, */*',
    ...extra
  };

  const origin = resolveGtcOrigin(req, opts.bodyOrigin);
  if (shouldAttachOrigin(origin)) {
    out.Origin = origin;
    const referer = req.headers.get('referer')?.trim();
    out.Referer = referer && !isLocalHost(hostFromUrl(referer)) ? referer : `${origin}/`;
  }

  const pairs = [
    ['cookie', 'Cookie'],
    ['user-agent', 'User-Agent'],
    ['app-type', 'app-type'],
    ['accept-language', 'Accept-Language'],
    ['x-app-lang', 'X-App-Lang'],
    ['device-id', 'device-id'],
    ['x-r-a', 'x-r-a'],
    ['x-r-b', 'x-r-b'],
    ['x-r-c', 'x-r-c']
  ];
  for (const [from, to] of pairs) {
    const v = req.headers.get(from);
    if (v && (out[to] == null || out[to] === '')) out[to] = v;
  }
  return out;
}