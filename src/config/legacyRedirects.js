/**
 * Legacy site URLs (Search Console / inbound links) → current routes.
 * Old blog posts lived at /blogs/<slug>; news lives at /gtc-news/blogs/<slug>.
 * (Imported from next.config.mjs — keep this file free of @/ aliases.)
 */
export function legacyBlogRedirects() {
  const home = '/en-intl';
  return [
    { source: '/blogs/:slug', destination: `${home}/gtc-news/blogs/:slug`, permanent: true },
    { source: '/blogs', destination: `${home}/gtc-news/blogs`, permanent: true },
    { source: '/:locale/blogs/:slug', destination: '/:locale/gtc-news/blogs/:slug', permanent: true },
    { source: '/:locale/blogs', destination: '/:locale/gtc-news/blogs', permanent: true },
    // former /en/… prefix (pre regional locales)
    { source: '/en/blogs/:slug', destination: `${home}/gtc-news/blogs/:slug`, permanent: true },
    { source: '/en/blogs', destination: `${home}/gtc-news/blogs`, permanent: true }
  ];
}
