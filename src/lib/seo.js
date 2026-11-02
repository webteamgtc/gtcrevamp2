/**
 * SEO helpers shared by every page.
 * - pageMetadata(): title, description, self canonical, hreflang (every locale incl. itself + x-default), Open Graph, Twitter.
 *   Every page gets the same reciprocal set for its path, so A → B always comes with B → A.
 *   Only locales where the page exists are listed (pageExists in src/config/regions.js — e.g. /en-za has its own
 *   legal pages); a page that exists in a single locale gets no hreflang at all.
 *   noindex: true → robots noindex and no hreflang (hreflang must only point at indexable pages)
 * - breadcrumbLd(): BreadcrumbList structured data
 * Set NEXT_PUBLIC_SITE_URL in .env for the live domain.
 */
import { LOCALES, DEFAULT_LOCALE, hreflangOf } from '@/i18n/locales';
import { pageExists } from '@/config/regions';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gtcfx.com').replace(/\/$/, '');
export const OG_IMAGE = 'https://gtcfx-bucket.s3.ap-southeast-1.amazonaws.com/logo/main-logo.webp';

/** path = route without the locale, e.g. '/company' ('' for the homepage) */
export function localeUrl(locale, path = '') {
  return `/${locale}${path}`;
}

export function pageMetadata({ locale, path = '', title, description, noindex = false }) {
  const available = LOCALES.filter((l) => pageExists(l.code, path));
  const languages = Object.fromEntries(available.map((l) => [hreflangOf(l.code), localeUrl(l.code, path)]));
  if (available.some((l) => l.code === DEFAULT_LOCALE)) languages['x-default'] = localeUrl(DEFAULT_LOCALE, path);
  const hreflang = !noindex && available.length > 1;
  return {
    title,
    description,
    alternates: hreflang ? { canonical: localeUrl(locale, path), languages } : { canonical: localeUrl(locale, path) },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type: 'website',
      siteName: 'GTCFX',
      url: localeUrl(locale, path),
      title,
      description,
      locale,
      images: [{ url: OG_IMAGE, alt: 'GTCFX' }]
    },
    twitter: { card: 'summary_large_image', title, description, images: [OG_IMAGE] }
  };
}

/** crumbs: [{ name, path }] — path without the locale */
export function breadcrumbLd(locale, crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${localeUrl(locale, c.path)}`
    }))
  };
}

export function JsonLd({ data }) {
  // "<" → \u003c so a "</script>" inside the data cannot close the tag early (Next.js JSON-LD guide)
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}
