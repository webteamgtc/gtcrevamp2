import { LOCALES } from '@/i18n/locales';
import { SITE_URL } from '@/lib/seo';

export const dynamic = 'force-static';

// add each finished page here (path without the locale)
const PAGES = ['', '/company', '/company/about-us', '/company/why-gtc-group', '/company/global-presence', '/company/events-and-exhibitions', '/company/regulations', '/company/contact-us', '/trading', '/trading/open-live-account'];

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
