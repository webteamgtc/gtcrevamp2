import { LOCALES } from '@/i18n/locales';
import { SITE_URL } from '@/lib/seo';
import { MARKET_PAGES, symbolHref } from '@/config/marketPages';
import { getMarketSymbols } from '@/lib/marketSymbols';

export const dynamic = 'force-static';
export const revalidate = 86400; // symbol lists are re-read daily

// add each finished page here (path without the locale)
const PAGES = [
  '',
  '/company',
  '/company/about-us',
  '/company/why-gtc-group',
  '/company/global-presence',
  '/company/events-and-exhibitions',
  '/company/regulations',
  '/company/contact-us',
  '/trading',
  '/trading/open-live-account',
  '/trading/free-demo-account',
  '/trading/deposit',
  '/trading/account-types',
  '/trading/compensation-fund',
  '/trading/mt5-platform',
  '/trading/mt4-platform',
  '/trading/metatrader-for-android',
  '/trading/metatrader-for-ipad',
  '/trading/gtc-go-app',
  '/trading/gtc-go-app-ipad',
  '/trading/gtc-go-app-android',
  '/markets',
  ...MARKET_PAGES.map((p) => `/markets/${p.slug}`)
];

const entry = (path, changeFrequency, priority) =>
  LOCALES.map((l) => ({
    url: `${SITE_URL}/${l.code}${path}`,
    changeFrequency,
    priority,
    alternates: { languages: Object.fromEntries(LOCALES.map((x) => [x.code, `${SITE_URL}/${x.code}${path}`])) }
  }));

export default async function sitemap() {
  // one page per symbol: /markets/<market>/<symbol>
  const symbolPaths = (await Promise.all(MARKET_PAGES.map(async (p) => (await getMarketSymbols(p)).map((x) => symbolHref(p.slug, x.s))))).flat();
  return [...PAGES.flatMap((path) => entry(path, 'monthly', path === '' ? 1 : 0.8)), ...symbolPaths.flatMap((path) => entry(path, 'daily', 0.6))];
}
