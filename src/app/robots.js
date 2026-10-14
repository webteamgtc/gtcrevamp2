import { SITE_URL } from '@/lib/seo';

export const dynamic = 'force-static';

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/*/draft-1', '/*/draft-2', '/*/draft-3', '/*/draft-4', '/*/draft-5'] }],
    sitemap: `${SITE_URL}/sitemap.xml`
  };
}
