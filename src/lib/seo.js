/**
 * SEO helpers shared by every page.
 * - pageMetadata(): title, description, canonical, hreflang (all 19 languages + x-default), Open Graph, Twitter
 * - breadcrumbLd(): BreadcrumbList structured data
 * Set NEXT_PUBLIC_SITE_URL in .env for the live domain.
 */
import { LOCALES, DEFAULT_LOCALE, hreflangOf } from '@/i18n/locales';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gtcfx.com').replace(/\/$/, '');
export const OG_IMAGE = 'https://gtcfx-bucket.s3.ap-southeast-1.amazonaws.com/logo/main-logo.webp';

/** path = route without the locale, e.g. '/company' ('' for the homepage) */
export function localeUrl(locale, path = '') {
  return `/${locale}${path}`;
}

export function pageMetadata({ locale, path = '', title, description }) {
  const languages = Object.fromEntries(LOCALES.map((l) => [hreflangOf(l.code), localeUrl(l.code, path)]));
  languages['x-default'] = localeUrl(DEFAULT_LOCALE, path);
  return {
    title,
    description,
    alternates: { canonical: localeUrl(locale, path), languages },
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

export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: 'GTCFX',
    url: SITE_URL,
    logo: OG_IMAGE,
    foundingDate: '2012'
  };
}

/** schema.org Event entries for upcoming events (helps them show in search). */
export function eventsLd(locale, events, pageUrlPath) {
  return {
    '@context': 'https://schema.org',
    '@graph': events.map((e) => ({
      '@type': 'Event',
      name: e.title,
      description: e.summary,
      startDate: e.startDate,
      endDate: e.endDate,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: { '@type': 'Place', name: e.venue || e.city, address: { '@type': 'PostalAddress', addressLocality: e.city, addressCountry: e.country || undefined } },
      ...(e.cover?.url ? { image: [e.cover.url] } : {}),
      organizer: { '@type': 'Organization', name: 'GTCFX', url: SITE_URL },
      url: localeUrl(locale, pageUrlPath)
    }))
  };
}

export function JsonLd({ data }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
