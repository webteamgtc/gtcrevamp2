/**
 * Market news data (Strapi collection type `article`, API id `articles`).
 * Pages call getLatestNews(locale) on the server; components only see the normalised shape below.
 *
 * Normalised article:
 * { id, slug, title, excerpt, category, publishedAt ('YYYY-MM-DD'), cover: {url, alt, width, height} | null,
 *   href ('/news/<slug>'), dateLabel ('15 October 2026' in the page language) }
 *
 * Field list + example request: docs/strapi-news.md
 */
import { strapiGet, strapiConfigured, toImage } from './strapi';
import { dateLocale } from './events';
import { SAMPLE_NEWS } from '@/data/news.sample';
import { NEWS_PATH } from './news-path';

/** Raw Strapi v5 entry (flat attributes) → normalised article. Also accepts v4 `{ id, attributes }`. */
export function normaliseArticle(raw) {
  const a = raw?.attributes ? { id: raw.id, ...raw.attributes } : raw ?? {};
  const media = (m) => (m?.data !== undefined ? m.data && { id: m.data.id, ...m.data.attributes } : m);
  const category = a.category?.name ?? a.category?.data?.attributes?.name ?? a.category ?? '';
  return {
    id: String(a.documentId ?? a.id ?? a.slug),
    slug: a.slug ?? '',
    title: a.title ?? '',
    excerpt: a.excerpt ?? a.summary ?? '',
    category: typeof category === 'string' ? category : '',
    publishedAt: String(a.publishedDate ?? a.publishedAt ?? '').slice(0, 10),
    cover: toImage(media(a.cover), 'medium')
  };
}

function decorate(a, locale) {
  let dateLabel = a.publishedAt;
  try {
    dateLabel = new Intl.DateTimeFormat(dateLocale(locale), { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${a.publishedAt}T00:00:00Z`));
  } catch {
    /* keep ISO date */
  }
  return { ...a, href: `${NEWS_PATH}/${a.slug}`, dateLabel };
}

async function fetchNews(locale, limit) {
  if (!strapiConfigured()) return null;
  const json = await strapiGet('articles', {
    locale,
    tags: ['articles'],
    query: {
      sort: ['publishedDate:desc', 'publishedAt:desc'],
      pagination: { pageSize: limit },
      fields: ['title', 'slug', 'excerpt', 'publishedDate', 'publishedAt'],
      populate: { cover: { fields: ['url', 'alternativeText', 'width', 'height', 'formats'] }, category: { fields: ['name'] } }
    }
  });
  if (!json?.data) return null;
  return json.data.map(normaliseArticle);
}

/** Newest `limit` articles (Strapi, or the sample list when Strapi isn't configured / fails). */
export async function getLatestNews(locale, limit = 5) {
  const remote = await fetchNews(locale, limit);
  const list = (remote ?? SAMPLE_NEWS).slice(0, limit).map((a) => decorate(a, locale));
  return { articles: list, source: remote ? 'strapi' : 'sample' };
}
