import createNextIntlPlugin from 'next-intl/plugin';
import { legacyBlogRedirects, legacyPathRedirects } from './src/config/legacyRedirects.js';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.js');
const isExport = process.env.STATIC_EXPORT === '1';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // reCAPTCHA site key is public by design; the browser widget (src/components/shared/Recaptcha.jsx) needs it
  env: { NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY ?? '' },
  // crawlers (search engines + SEO audit tools) get the metadata — canonical, hreflang — inside <head> on dynamic
  // pages too, instead of streamed into <body>; visitors keep streaming metadata
  htmlLimitedBots: /bot|crawl|spider|slurp|google|bing|yandex|baidu|duckduck|petal|facebookexternalhit|embedly|whatsapp|lighthouse|pagespeed|sitebulb|screaming|ahrefs|semrush|moz\.com|validator/i,
  images: {
    unoptimized: isExport,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gtcfx-bucket.s3.ap-southeast-1.amazonaws.com',
        pathname: '/**'
      }
    ]
  },
  // old misspelled URLs ("andriod") → corrected routes
  ...(isExport
    ? {}
    : {
        async redirects() {
          const typoFixes = ['metatrader-for', 'gtc-go-app'].flatMap((p) => [
            { source: `/:locale/trading/${p}-andriod`, destination: `/:locale/trading/${p}-android`, permanent: true },
            { source: `/trading/${p}-andriod`, destination: `/trading/${p}-android`, permanent: true }
          ]);
          const cryptoCfdsRetired = [
            { source: '/:locale/markets/crypto-cfds', destination: '/:locale/markets', permanent: true },
            { source: '/:locale/markets/crypto-cfds/:path*', destination: '/:locale/markets', permanent: true },
            { source: '/markets/crypto-cfds', destination: '/markets', permanent: true },
            { source: '/markets/crypto-cfds/:path*', destination: '/markets', permanent: true }
          ];
          const marketPathFixes = [
            { source: '/:locale/markets/economic-calendar', destination: '/:locale/gtc-news/economic-calendar', permanent: true },
            { source: '/markets/economic-calendar', destination: '/en-intl/gtc-news/economic-calendar', permanent: true },
            // no /markets/commodities page — legacy URL + old flat /commodities (see legacyRedirects.js)
            { source: '/:locale/markets/commodities', destination: '/:locale/markets/energy', permanent: true },
            { source: '/markets/commodities', destination: '/en-intl/markets/energy', permanent: true }
          ];
          return [...typoFixes, ...cryptoCfdsRetired, ...marketPathFixes, ...legacyPathRedirects(), ...legacyBlogRedirects()];
        },
        // per-locale sitemaps listed in /sitemap.xml (src/lib/sitemap.js)
        async rewrites() {
          return [
            { source: '/sitemap-index.xml', destination: '/sitemap.xml' }, // old sitemap URL (Search Console)
            { source: '/sitemap-:locale.xml', destination: '/sitemaps/:locale' }
          ];
        }
      }),
  ...(isExport ? { output: 'export', trailingSlash: true, assetPrefix: '/__GTC__', env: { NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY ?? '', NEXT_PUBLIC_STATIC_EXPORT: '1' } } : {})
};

export default withNextIntl(nextConfig);
