/** Upstream GTC portal API base (`…/api/pub`). */
export function gtcPortalApiBase() {
  const fromEnv = process.env.GTC_PORTAL_API?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  if (process.env.NODE_ENV !== 'production') return 'https://stag.gtctrader1203.top/api/pub';
  return 'https://web.mygtc.app/api/pub';
}

export function gtcPortalIsStaging() {
  const base = gtcPortalApiBase();
  return /stag\.|gtctrader1203/i.test(base);
}