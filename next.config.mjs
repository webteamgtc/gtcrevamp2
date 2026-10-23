import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.js');
const isExport = process.env.STATIC_EXPORT === '1';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
          return ['metatrader-for', 'gtc-go-app'].flatMap((p) => [
            { source: `/:locale/trading/${p}-andriod`, destination: `/:locale/trading/${p}-android`, permanent: true },
            { source: `/trading/${p}-andriod`, destination: `/trading/${p}-android`, permanent: true }
          ]);
        },
        // per-locale sitemaps listed in /sitemap.xml (src/lib/sitemap.js)
        async rewrites() {
          return [
            { source: '/sitemap-index.xml', destination: '/sitemap.xml' }, // old sitemap URL (Search Console)
            { source: '/sitemap-:locale.xml', destination: '/sitemaps/:locale' }
          ];
        }
      }),
  ...(isExport ? { output: 'export', trailingSlash: true, assetPrefix: '/__GTC__', env: { NEXT_PUBLIC_STATIC_EXPORT: '1' } } : {})
};

export default withNextIntl(nextConfig);
