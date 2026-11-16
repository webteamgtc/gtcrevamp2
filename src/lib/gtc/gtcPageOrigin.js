/** Page origin / hostname for GTC source checks (must match portal allowlist + encrypted proof `h`). */

function parseOriginUrl(raw) {
  try {
    const u = new URL(raw);
    return { origin: u.origin, host: u.hostname };
  } catch {
    return null;
  }
}

function isLocalHostname(hostname) {
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

function canonicalFromEnv() {
  const explicit = process.env.NEXT_PUBLIC_GTC_PORTAL_ORIGIN?.trim();
  if (explicit) return parseOriginUrl(explicit);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!siteUrl) return null;

  const canonical = parseOriginUrl(siteUrl);
  if (!canonical) return null;

  if (typeof window === 'undefined') {
    return process.env.NODE_ENV === 'production' ? canonical : null;
  }
  if (isLocalHostname(window.location.hostname)) return null;

  // Use configured site origin only when the visitor is on that host (not Vercel preview / other domains).
  const current = window.location.hostname;
  if (current === canonical.host || current.endsWith(`.${canonical.host}`)) {
    return canonical;
  }
  return null;
}

export function gtcPageOrigin() {
  const canonical = canonicalFromEnv();
  if (canonical) return canonical.origin;

  if (typeof window === 'undefined') return '';
  if (window.location.hostname === '127.0.0.1') {
    const { protocol, port } = window.location;
    return `${protocol}//localhost${port ? `:${port}` : ''}`;
  }
  return window.location.origin;
}

export function siteVisitHostname() {
  const canonical = canonicalFromEnv();
  if (canonical) return canonical.host;

  const override = process.env.NEXT_PUBLIC_GTC_SITE_VISIT_HOST?.trim();
  if (override) return override;

  if (typeof window === 'undefined') return 'localhost';
  const h = window.location.hostname;
  return h === '127.0.0.1' ? 'localhost' : h;
}

export function gtcClientContextHeaders() {
  const origin = gtcPageOrigin();
  return origin ? { 'x-gtc-client-origin': origin } : {};
}

/** Included in JSON body when proxies/CDNs strip custom headers. */
export function gtcClientOriginBodyField() {
  const origin = gtcPageOrigin();
  return origin ? { client_origin: origin } : {};
}