/** Page origin / hostname for GTC source checks (staging rejects 127.0.0.1). */

export function gtcPageOrigin() {
  if (typeof window === 'undefined') return '';
  if (window.location.hostname === '127.0.0.1') {
    const { protocol, port } = window.location;
    return `${protocol}//localhost${port ? `:${port}` : ''}`;
  }
  return window.location.origin;
}

export function siteVisitHostname() {
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