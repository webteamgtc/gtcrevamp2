export const GEO_COUNTRY_COOKIE = "gtcfx_geo_country";
export const GEO_COUNTRY_MAX_AGE = 60 * 60 * 24; // 24 hours
export const UAE_COUNTRY_CODE = "AE";
export const ZA_COUNTRY_CODE = "ZA";
export const VU_COUNTRY_CODE = "VU";
export const MU_COUNTRY_CODE = "MU";

export function isUaeCountry(countryCode) {
  return String(countryCode || "").toUpperCase() === UAE_COUNTRY_CODE;
}

export function isZaCountry(countryCode) {
  return String(countryCode || "").toUpperCase() === ZA_COUNTRY_CODE;
}

export function isVuCountry(countryCode) {
  return String(countryCode || "").toUpperCase() === VU_COUNTRY_CODE;
}

export function isMuCountry(countryCode) {
  return String(countryCode || "").toUpperCase() === MU_COUNTRY_CODE;
}

/** Client-side read of the geo cookie set after ipinfo lookup. */
export function readGeoCountryCookie() {
  if (typeof document === "undefined") return null;
  const prefix = `${GEO_COUNTRY_COOKIE}=`;
  const entry = document.cookie.split("; ").find((cookie) => cookie.startsWith(prefix));
  if (!entry) return null;
  try {
    return decodeURIComponent(entry.slice(prefix.length)).toUpperCase();
  } catch {
    return null;
  }
}

export function getClientIp(request) {
  const headerNames = [
    "cf-connecting-ip",
    "true-client-ip",
    "x-real-ip",
    "x-forwarded-for",
  ];

  for (const name of headerNames) {
    const value = request.headers.get(name);
    if (!value) continue;

    const ip =
      name === "x-forwarded-for" ? value.split(",")[0]?.trim() : value.trim();
    if (ip) return ip;
  }

  return request.ip || null;
}

export function isLocalIp(ip) {
  if (!ip) return true;
  return (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.")
  );
}

/**
 * Visitors who reach Vercel through Alibaba's WAF (www.gtcfx.com CNAME → WAF → Vercel). Vercel then sees the WAF
 * node: x-vercel-ip-country is the node's country, and Vercel overwrites X-Forwarded-For / X-Real-IP with the
 * node's IP. So the WAF has to pass the visitor on in its own headers — names come from env (confirm with Alibaba):
 *   GEO_PROXY_COUNTRY_HEADER   visitor's country code (best: no lookup needed)
 *   GEO_PROXY_IP_HEADER        visitor's IP (looked up with ipinfo)
 *   GEO_PROXY_SECRET           optional; the WAF headers are trusted only when the WAF also sends this value in
 *                              GEO_PROXY_SECRET_HEADER (default x-ddos-waf-secret, Alibaba Anti-DDoS), so nobody can fake their country
 * → { country, ip } (either may be null) when the request came through the WAF, otherwise null.
 */
export function getProxyVisitor(request) {
  const countryHeader = process.env.GEO_PROXY_COUNTRY_HEADER;
  const ipHeader = process.env.GEO_PROXY_IP_HEADER;
  if (!countryHeader && !ipHeader) return null;
  const secret = process.env.GEO_PROXY_SECRET;
  if (secret && request.headers.get(process.env.GEO_PROXY_SECRET_HEADER || "x-ddos-waf-secret") !== secret) return null;

  const code = countryHeader ? String(request.headers.get(countryHeader) ?? "").trim().toUpperCase() : "";
  const country = /^[A-Z]{2}$/.test(code) && code !== "XX" ? code : null;
  const ip = ipHeader ? request.headers.get(ipHeader)?.split(",")[0]?.trim() || null : null;
  // with a secret we know it's the WAF even if it sent nothing usable; without one, only when it did
  return country || ip || secret ? { country, ip } : null;
}

/** Read country from CDN / edge headers (Vercel, Cloudflare, …). */
export function getCountryFromHeaders(request) {
  const geoCountry = request.geo?.country;
  if (geoCountry) return String(geoCountry).toUpperCase();

  const vercelCountry = request.headers.get("x-vercel-ip-country");
  if (vercelCountry) return String(vercelCountry).toUpperCase();

  const cfCountry = request.headers.get("cf-ipcountry");
  if (cfCountry && cfCountry !== "XX") {
    return String(cfCountry).toUpperCase();
  }

  const cloudfront = request.headers.get("cloudfront-viewer-country");
  if (cloudfront) return String(cloudfront).toUpperCase();

  return null;
}

async function fetchCountryFromIpinfo(ip) {
  const token = process.env.IPINFO_TOKEN;
  const url = token
    ? `https://ipinfo.io/${ip}?token=${token}`
    : `https://ipinfo.io/${ip}/json`;

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  });

  if (!response.ok) return null;

  const data = await response.json();
  return data?.country ? String(data.country).toUpperCase() : null;
}

/**
 * Resolve visitor country for middleware: headers → cookie → ipinfo lookup.
 */
export async function resolveCountryFromRequest(request) {
  const fromHeaders = getCountryFromHeaders(request);
  if (fromHeaders) return fromHeaders;

  const fromCookie = request.cookies.get(GEO_COUNTRY_COOKIE)?.value;
  if (fromCookie) return String(fromCookie).toUpperCase();

  const ip = getClientIp(request);
  if (isLocalIp(ip)) return null;

  try {
    return await fetchCountryFromIpinfo(ip);
  } catch {
    return null;
  }
}

export function setGeoCountryCookie(response, countryCode) {
  if (!countryCode || !response?.cookies) return response;
  response.cookies.set(GEO_COUNTRY_COOKIE, countryCode, {
    path: "/",
    maxAge: GEO_COUNTRY_MAX_AGE,
    sameSite: "lax",
  });
  return response;
}
