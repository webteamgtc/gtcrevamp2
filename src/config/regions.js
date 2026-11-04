/**
 * Regional English sites and visitor rules — one place to change them.
 *
 *   /en-intl  everyone not listed below (and the US)   footer: international notice
 *   /en-ae    UAE                                      footer: international notice + CAT 1 / CAT 5 choice
 *   /en-za    South Africa                             footer: footer.notices.za
 *   /en-mu    Mauritius                                footer: footer.notices.mu
 *   /en-vu    Vanuatu                                  footer: footer.notices.vu
 *
 * A visitor's country is worked out in src/proxy.js: CDN header (Vercel `x-vercel-ip-country`, Cloudflare
 * `cf-ipcountry`) → geo cookie (ipinfo result saved by useLocationDetail) → server-side ipinfo lookup of the IP.
 * The proxy sends URLs without a locale, and regional English URLs of another region, to the visitor's region
 * (same path) — unless they chose to stay (regionDismissed cookie) or are a crawler.
 * Testing from anywhere: add ?geo=US (or AE, ZA, MU, VU, PK…) to any URL on a preview/dev deployment;
 * ?geo=clear removes it. The override is ignored on the production deployment unless GEO_TEST=1.
 */

/**
 * Countries no form offers (country lists and phone-number pickers): United States (incl. its Minor Outlying
 * Islands), Australia, Japan, Ukraine, Israel, United Kingdom. Applied in src/components/shared/formKit.jsx
 * (useGtcCountries, PHONE_COUNTRIES).
 */
export const FORM_EXCLUDED_COUNTRIES = ['US', 'UM', 'AU', 'JP', 'UA', 'IL', 'GB'];

/**
 * UK visitors (IP in GB): informational notice on first visit (GeoGate + UkNotice.jsx), no live or demo accounts
 * (UkGate.jsx). They may keep browsing after accepting the notice.
 */
export const UK_NOTICE = { country: 'GB', gmgUrl: 'https://www.gmgmarkets.co.uk' };

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
  ukAccepted: 'gtc_uk_notice', // UK visitor accepted the important notice (informational browsing only)
  uaeCategory: 'gtc_uae_cat', // UAE visitor's choice: '1' or '5'
  uaeAck: 'gtc_uae_ack', // when the UAE visitor accepted the important-information statement
  regionDismissed: 'gtc_region_ok' // visitor chose to stay on another region's site
};
export const REMEMBER_DAYS = 30;

/**
 * South Africa pop-up (src/components/shared/geo/ZaNotice.jsx): the Upfront Disclosure and the Customer Terms
 * Agreement are not published on the website (given to clients on request), so the pop-up names this address.
 */
export const ZA_DOCUMENTS_EMAIL = 'support@gtcfx.com';

/** UAE CAT 5: GTC Financial Consultancy L.L.C page (CMA Category 5). While CAT 5 is chosen, every other page redirects here. */
export const CAT5_PATH = '/marketing';

/**
 * TEMPORARY UAE CAT 5 website (GTC Financial Consultancy L.L.C.), until the CAT 1 licence arrives.
 * NEXT_PUBLIC_UAE_CAT5_SITE=on (Vercel env): every visitor with a UAE IP gets the CAT 5 website on the normal
 * addresses (gtcfx.com/en-ae, /en-ae/about-us, /en-ae/faqs, /en-ae/contact-us, /en-ae/register-now,
 * /en-ae/privacy-policy, /en-ae/trading/delete, and the same under /ar); every other
 * page sends them to its Home; no CAT 1 / CAT 5 popup. Set it to off (or remove it) and redeploy to switch back to
 * the normal UAE site. See src/proxy.js.
 */
export const CAT5_SITE = process.env.NEXT_PUBLIC_UAE_CAT5_SITE === 'on';
/** CAT 5 pages: key → public address (after /<locale>) and the folder it lives in (src/app/[locale]/marketing/…). */
export const CAT5_PAGES = {
  home: { path: '', dir: '' },
  about: { path: '/about-us', dir: '/about' },
  faq: { path: '/faqs', dir: '/faq' },
  contact: { path: '/contact-us', dir: '/contact' },
  legalDocuments: { path: '/legal-documents', dir: '/legal-documents' },
  termsOfBusiness: { path: '/terms-of-business', dir: '/terms-of-business' },
  privacy: { path: '/privacy-policy', dir: '/privacy-policy' },
  liveApplicationForm: { path: '/register-now', dir: '/live-account-application' },
  /** Previous public slug; same form. */
  liveApplicationFormLegacy: { path: '/live-application-form', dir: '/live-account-application' },
  /** Same form; keeps /live-account-application working on the CAT 5 site. */
  liveAccount: { path: '/live-account-application', dir: '/live-account-application' },
  delete: { path: '/trading/delete', dir: '/delete' },
  /** Same page as delete; keeps gtcfx.com/delete (and /en-ae/delete) on the CAT 5 site. */
  deleteFlat: { path: '/delete', dir: '/delete' }
};

/** Public CAT 5 URL (after /<locale>) is allowed while the visitor is on the CAT 5 site. */
export function isCat5PublicPath(restPath) {
  return Object.values(CAT5_PAGES).some((p) => p.path && p.path === restPath);
}

export function isCat5AllowedPath(restPath) {
  const resolved = resolveCat5RestPath(restPath);
  return restPath === CAT5_PATH || restPath.startsWith(`${CAT5_PATH}/`) || isCat5PublicPath(resolved);
}

/** Old flat URLs (no locale), e.g. gtcfx.com/delete → /trading/delete on the CAT 5 site. */
export const CAT5_FLAT_ALIASES = {
  '/delete': '/trading/delete',
  '/privacy': '/privacy-policy',
  '/privacy-policy': '/privacy-policy',
  '/terms-of-business': '/terms-of-business'
};

/** PDFs served from /public for UAE CAT 5 document pages. */
export const CAT5_PDF_PATHS = {
  legalDocuments: '/CMA.pdf',
  termsOfBusiness: '/Terms-of-Business.pdf'
};

/** Flat pathname or alias → public CAT 5 path (after /<locale>); null if not a CAT 5 page. */
export function cat5PublicPathForPathname(pathname) {
  if (isCat5PublicPath(pathname)) return pathname;
  return CAT5_FLAT_ALIASES[pathname] ?? null;
}

/** Locale-prefixed segment (/en-ae/delete) → canonical CAT 5 public path for matching. */
export function resolveCat5RestPath(restPath) {
  return CAT5_FLAT_ALIASES[restPath] ?? restPath;
}
export const CAT5_LOCALE = 'en-ae';
/** The CAT 5 page exists in English (/en-ae) and Arabic (/ar). */
export const CAT5_LOCALES = ['en-ae', 'ar'];

/**
 * Contact details on the CAT 5 site ("Prefer to talk now?", Support, contact page, form sidebar). Address: marketingPage.form.address.
 */
export const CAT5_CONTACT = { email: 'support@gtcfx.com', phone: '971-45109800' };

/** Client portal login, sent in the welcome e-mail after a CAT 5 live account application (src/lib/emails/liveAccountWelcome.js). */
export const CAT5_PORTAL_LOGIN = 'https://portal.gtcfx.com/login';

/** Preferred language options on the CAT 5 enquiry form → POST /api/uae-enquiry. */
export const CAT5_LANGUAGES = ['ar', 'en'];

/** CMA licensed-companies register (footer “here” + relationship verify line). */
export const CAT5_CMA_URL = 'https://www.uaecma.gov.ae/en/open-data/licensed-companies';

/* ------------------------------------------------------------------ South Africa (/en-za) */

/**
 * The South African site: GTC Global SA (Pty) Ltd, FSP No. 51545 (intermediary only). English only.
 * Its wording is messages/regions/en-za.json (merged over the English text); its policies are the S3
 * documents <slug>/en-za.json (src/lib/legalDocuments.js). FAIS Disclosure, Risk Disclosure Statement and the
 * Customer Terms Agreement are given to clients on request and are not published.
 */
export const ZA_LOCALE = 'en-za';

/** Policies published on /en-za, grouped by the company that issues them (legal hub). */
export const ZA_LEGAL_GROUPS = [
  { key: 'gtcGlobalSa', slugs: ['conflict-of-interest', 'privacy-policy', 'complaints-handling', 'paia-manual'] },
  { key: 'gtcGlobalTrading', slugs: ['order-execution'] }
];
/** Same policies in footer order (labels: messages/regions/en-za.json → footer.columns.legal.links). */
export const ZA_LEGAL_SLUGS = ['conflict-of-interest', 'privacy-policy', 'order-execution', 'complaints-handling', 'paia-manual'];
/** Policies that exist only on /en-za (every other locale answers 404). */
export const ZA_ONLY_LEGAL_SLUGS = ZA_LEGAL_SLUGS.filter((s) => s !== 'privacy-policy');
/** The /legal pages of /en-za (hub first); any other /en-za/legal/… page redirects to the hub. */
export const ZA_LEGAL_PATHS = ['/legal/legal-documents', ...ZA_LEGAL_SLUGS.map((s) => `/legal/${s}`)];

/**
 * Does `path` (without the locale, e.g. '/legal/paia-manual') exist on `locale`'s site?
 * Used for hreflang (src/lib/seo.js), the sitemaps, the proxy and the legal routes.
 */
export function pageExists(locale, path = '') {
  if (locale === ZA_LOCALE && path.startsWith('/legal/')) return ZA_LEGAL_PATHS.includes(path);
  if (ZA_ONLY_LEGAL_SLUGS.some((s) => path === `/legal/${s}`)) return locale === ZA_LOCALE;
  return true;
}
