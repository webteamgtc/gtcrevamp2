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
  ...(isExport ? { output: 'export', trailingSlash: true, assetPrefix: '/__GTC__', env: { NEXT_PUBLIC_STATIC_EXPORT: '1' } } : {})
};

export default withNextIntl(nextConfig);
