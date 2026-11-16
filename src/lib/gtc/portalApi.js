const STAGING_DEFAULT = 'https://stag.gtctrader1203.top/api/pub';
const PRODUCTION_DEFAULT = 'https://web.mygtc.app/api/pub';

function trimBase(url) {
  return String(url ?? '').trim().replace(/\/$/, '');
}

export function isStagingPortalUrl(url) {
  return /stag\.|gtctrader1203/i.test(url);
}

export function isMarketingPortalUrl(url) {
  return /gtcfx\.com/i.test(url) && !/mygtc|gtctrader/i.test(url);
}

/**
 * Upstream GTC portal API base (`…/api/pub`).
 * Vercel production always uses web.mygtc.app unless GTC_PORTAL_API is a non-staging production host.
 */
export function gtcPortalApiBase() {
  const fromEnv = trimBase(process.env.GTC_PORTAL_API);
  const vercelEnv = process.env.VERCEL_ENV;

  if (vercelEnv === 'production') {
    if (fromEnv && !isStagingPortalUrl(fromEnv) && !isMarketingPortalUrl(fromEnv)) {
      return fromEnv;
    }
    if (fromEnv && (isStagingPortalUrl(fromEnv) || isMarketingPortalUrl(fromEnv))) {
      console.error('[gtc] Ignoring GTC_PORTAL_API on Vercel production:', fromEnv);
    }
    return PRODUCTION_DEFAULT;
  }

  if (fromEnv) {
    if (isMarketingPortalUrl(fromEnv)) {
      console.error('[gtc] GTC_PORTAL_API must not be the marketing site — using', PRODUCTION_DEFAULT);
      return PRODUCTION_DEFAULT;
    }
    return fromEnv;
  }

  if (process.env.NODE_ENV !== 'production') return STAGING_DEFAULT;
  return PRODUCTION_DEFAULT;
}

export function gtcPortalIsStaging() {
  return isStagingPortalUrl(gtcPortalApiBase());
}