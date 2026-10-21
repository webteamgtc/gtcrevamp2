'use client';
/**
 * Visitor location from ipinfo.io (client side), shared by every component on the page:
 *   const { countryCode, countryData, locationReady } = useLocationDetail();
 *   countryCode  — ISO 3166-1 alpha-2, upper case ("AE"), or null while unknown
 *   countryData  — the ipinfo payload ({ ip, city, region, country, timezone, … }) or null
 *   locationReady — true once the lookup finished (or a cached / cookie value was used)
 *
 * One request per page load (in-memory cache + in-flight de-duplication); the country is also stored in
 * the geo cookie (src/lib/geo/resolveCountryFromRequest.js) so later visits start with it immediately.
 * Values are only read after mount, so server and browser render the same first HTML.
 */
import { useEffect, useState } from 'react';
import { GEO_COUNTRY_COOKIE, GEO_COUNTRY_MAX_AGE, readGeoCountryCookie } from '@/lib/geo/resolveCountryFromRequest';

const GEO_URL = 'https://ipinfo.io/json';
const TIMEOUT = 5000;

let cachedGeoData = null;
let geoFetchPromise = null;

/** "ae" → "AE"; anything that isn't a two-letter code → null. */
export const normaliseCountry = (code) => {
  const c = String(code ?? '').trim().toUpperCase();
  return /^[A-Z]{2}$/.test(c) ? c : null;
};

function persistGeoCountryCookie(countryCode) {
  if (typeof document === 'undefined' || !countryCode) return;
  document.cookie = `${GEO_COUNTRY_COOKIE}=${encodeURIComponent(countryCode)}; path=/; max-age=${GEO_COUNTRY_MAX_AGE}; SameSite=Lax`;
}

function fetchGeoInfo() {
  if (cachedGeoData) return Promise.resolve(cachedGeoData);
  if (!geoFetchPromise) {
    geoFetchPromise = fetch(GEO_URL, { signal: AbortSignal.timeout(TIMEOUT), headers: { Accept: 'application/json' } })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && normaliseCountry(data.country)) cachedGeoData = data;
        return cachedGeoData;
      })
      .catch(() => null)
      .finally(() => {
        geoFetchPromise = null;
      });
  }
  return geoFetchPromise;
}

export const useLocationDetail = () => {
  const [state, setState] = useState({ countryCode: null, countryData: null, locationReady: false });

  useEffect(() => {
    let alive = true;

    // fast path: cached lookup or the geo cookie from an earlier visit / the server
    const known = normaliseCountry(cachedGeoData?.country) ?? normaliseCountry(readGeoCountryCookie());
    if (known) setState({ countryCode: known, countryData: cachedGeoData, locationReady: true });

    fetchGeoInfo().then((data) => {
      if (!alive) return;
      const country = normaliseCountry(data?.country) ?? known;
      if (country && country !== normaliseCountry(readGeoCountryCookie())) persistGeoCountryCookie(country);
      setState({ countryCode: country, countryData: data ?? null, locationReady: true });
    });

    return () => {
      alive = false;
    };
  }, []);

  return state;
};
