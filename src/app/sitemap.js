import { LOCALES, hreflangOf } from '@/i18n/locales';
import { SITE_URL } from '@/lib/seo';
import { MARKET_PAGES, symbolHref } from '@/config/marketPages';
import { getMarketSymbols } from '@/lib/marketSymbols';
import { ALPHABET } from '@/lib/glossary';
import { getNewsCategories, getNewsPage } from '@/lib/news';
import { newsCategoryHref } from '@/lib/news-path';
import { COURSES, courseHref } from './[locale]/knowledge-to-learn/courses';

export const dynamic = 'force-static';
export const revalidate = 86400; // symbol lists and news are re-read daily

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
  '/trading/copy-trading',
  '/trading/pamm-account',
  '/trading/swap-update',
  '/trading/vps-hosting-services',
  '/company/dynamic-leverage',
  '/company/faqs',
  '/gtc-news',
  '/gtc-news/economic-calendar',
  '/gtc-news/earnings-calendar',
  '/knowledge-to-learn',
  '/knowledge-to-learn/liquidity-technology',
  '/knowledge-to-learn/platform-guide',
  '/knowledge-to-learn/trading-glossary',
  ...ALPHABET.map((l) => `/knowledge-to-learn/trading-glossary/${l.toLowerCase()}`),
  ...Object.keys(COURSES).map(courseHref),
  '/markets',
  ...MARKET_PAGES.map((p) => `/markets/${p.slug}`)
];

const entry = (path, changeFrequency, priority) =>
  LOCALES.map((l) => ({
    url: `${SITE_URL}/${l.code}${path}`,
    changeFrequency,
    priority,
    alternates: { languages: Object.fromEntries(LOCALES.map((x) => [hreflangOf(x.code), `${SITE_URL}/${x.code}${path}`])) }
  }));

/** News categories and the latest articles from Strapi (none if Strapi isn't reachable). */
async function newsPaths() {
  try {
    const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 8000));
    const [cats, { articles }] = await Promise.race([Promise.all([getNewsCategories('en-intl'), getNewsPage('en-intl', { pageSize: 100 })]), timeout]);
    return [...cats.map((c) => newsCategoryHref(c.slug)), ...articles.map((a) => a.href)];
  } catch {
    return [];
  }
}

export default async function sitemap() {
  // one page per symbol: /markets/<market>/<symbol>
  const symbolPaths = (await Promise.all(MARKET_PAGES.map(async (p) => (await getMarketSymbols(p)).map((x) => symbolHref(p.slug, x.s))))).flat();
  const news = await newsPaths();
  return [
    ...PAGES.flatMap((path) => entry(path, 'monthly', path === '' ? 1 : 0.8)),
    ...news.flatMap((path) => entry(path, 'weekly', 0.6)),
    ...symbolPaths.flatMap((path) => entry(path, 'daily', 0.6))
  ];
}
