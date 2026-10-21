/**
 * Regional English sites and visitor rules — one place to change them.
 *
 *   /en-intl  everyone not listed below (and the US)   footer: international notice
 *   /en-ae    UAE                                      footer: international notice + CAT 1 / CAT 5 choice
 *   /en-za    South Africa                             footer: footer.notices.za
 *   /en-mu    Mauritius                                footer: footer.notices.mu
 *   /en-vu    Vanuatu                                  footer: footer.notices.vu
 *
 * A visitor's country comes from Vercel's `x-vercel-ip-country` header (read in src/proxy.js).
 * Testing from anywhere: add ?geo=US (or AE, ZA, MU, VU, PK…) to any URL on a preview/dev deployment;
 * ?geo=clear removes it. The override is ignored on the production deployment unless GEO_TEST=1.
 */

/** country (ISO 3166-1 alpha-2) → regional English site */
export const REGION_BY_COUNTRY = { AE: 'en-ae', ZA: 'en-za', MU: 'en-mu', VU: 'en-vu' };
export const DEFAULT_REGION = 'en-intl';
export const REGION_LOCALES = ['en-intl', 'en-ae', 'en-za', 'en-mu', 'en-vu'];

export const regionForCountry = (country) => REGION_BY_COUNTRY[String(country || '').toUpperCase()] ?? DEFAULT_REGION;

/** 'en-za' → 'za'; non-regional locales (ar, zh…) → 'intl' */
export const regionOf = (locale) => (REGION_LOCALES.includes(locale) ? locale.slice(3) : 'intl');

/** Regions with their own legal footer (messages: footer.notices.<region>); the rest use footer.risk. */
export const FOOTER_NOTICE_REGIONS = ['za', 'mu', 'vu'];

/** Cookies (all readable in the browser; none hold personal data). */
export const COOKIES = {
  country: 'gtc_country', // visitor's country, refreshed on every page view by the proxy
  geoTest: 'gtc_geo_test', // ?geo= override while testing
  usAccepted: 'gtc_us_notice', // US visitor accepted the important notice
  uaeCategory: 'gtc_uae_cat', // UAE visitor's choice: '1' or '5'
  uaeAck: 'gtc_uae_ack', // when the UAE visitor accepted the important-information statement
  regionDismissed: 'gtc_region_ok' // visitor chose to stay on another region's site
};
export const REMEMBER_DAYS = 30;

/** UAE CAT 5: marketing-only landing page. While CAT 5 is chosen, every other page redirects here. */
export const CAT5_PATH = '/marketing';
export const CAT5_LOCALE = 'en-ae';

/** Contact details on the CAT 5 marketing page (same as the Contact Us page). */
export const CAT5_CONTACT = { email: 'support@gtcfx.com', phone: '+44 800 048 8461' };

/** CAT 5 enquiry form → POST /api/uae-enquiry (e-mails UAE_ENQUIRY_EMAIL, optionally a Zapier hook). */
export const CAT5_SERVICES = ['lead', 'digital', 'event', 'brand', 'partner', 'insight', 'other'];
