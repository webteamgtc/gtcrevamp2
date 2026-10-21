import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { COOKIES, CAT5_LOCALE, CAT5_PATH, regionForCountry, REMEMBER_DAYS } from './config/regions';

/**
 * Runs before every page:
 *  1. works out the visitor's country (Vercel header, or ?geo= while testing)
 *  2. sends URLs without a language/region (/, /company, old /en/…) to the visitor's regional site
 *  3. keeps UAE CAT 5 visitors on the marketing page
 *  4. hands over to next-intl, and stores the country in a cookie the popups read
 * Rules and cookie names: src/config/regions.js
 */
const intl = createMiddleware(routing);
const LOCALES = new Set(routing.locales);
const GEO_TEST = process.env.VERCEL_ENV !== 'production' || process.env.GEO_TEST === '1';
const COUNTRY_RE = /^[A-Z]{2}$/;

function countryOf(request) {
  const q = request.nextUrl.searchParams.get('geo')?.toUpperCase();
  if (GEO_TEST && q && COUNTRY_RE.test(q)) return { country: q, test: q };
  if (GEO_TEST && q === 'CLEAR') return { country: request.headers.get('x-vercel-ip-country') || '', test: 'clear' };
  const saved = GEO_TEST ? request.cookies.get(COOKIES.geoTest)?.value : null;
  if (saved && COUNTRY_RE.test(saved)) return { country: saved };
  return { country: (request.headers.get('x-vercel-ip-country') || '').toUpperCase() };
}

function finish(response, { country, test }) {
  const opts = { path: '/', sameSite: 'lax', secure: process.env.NODE_ENV === 'production' };
  if (country) response.cookies.set(COOKIES.country, country, { ...opts, maxAge: 60 * 60 * 24 });
  if (test === 'clear') response.cookies.delete(COOKIES.geoTest);
  else if (test) response.cookies.set(COOKIES.geoTest, test, { ...opts, maxAge: 60 * 60 * 24 * REMEMBER_DAYS });
  return response;
}

export default function proxy(request) {
  const geo = countryOf(request);
  const { pathname, search } = request.nextUrl;
  const [, first = '', ...rest] = pathname.split('/');
  const restPath = rest.length ? `/${rest.join('/')}` : '';
  const redirect = (path) => finish(NextResponse.redirect(new URL(`${path}${search}`, request.url)), geo);

  // 2. no region/language in the URL (or the old /en) → the visitor's regional site,
  //    unless they picked a language before (next-intl's NEXT_LOCALE cookie)
  if (!LOCALES.has(first)) {
    const picked = request.cookies.get('NEXT_LOCALE')?.value;
    const target = picked && LOCALES.has(picked) ? picked : regionForCountry(geo.country);
    const tail = first === 'en' ? restPath : pathname === '/' ? '' : pathname;
    return redirect(`/${target}${tail}`);
  }

  // 3. UAE CAT 5 (marketing only): every page leads to the marketing page
  if (request.cookies.get(COOKIES.uaeCategory)?.value === '5' && !(first === CAT5_LOCALE && restPath === CAT5_PATH)) {
    return redirect(`/${CAT5_LOCALE}${CAT5_PATH}`);
  }

  // 4. normal page
  return finish(intl(request), geo);
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
