import { LOCALES } from '@/i18n/locales';
import { SITE_URL } from '@/lib/seo';

export const dynamic = 'force-static';

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
  '/markets'
];

export default function sitemap() {
  return PAGES.flatMap((path) =>
    LOCALES.map((l) => ({
      url: `${SITE_URL}/${l.code}${path}`,
      changeFrequency: 'monthly',
      priority: path === '' ? 1 : 0.8,
      alternates: { languages: Object.fromEntries(LOCALES.map((x) => [x.code, `${SITE_URL}/${x.code}${path}`])) }
    }))
  );
}
