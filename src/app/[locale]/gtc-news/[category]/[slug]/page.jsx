import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMetadata, breadcrumbLd, JsonLd, SITE_URL } from '@/lib/seo';
import { getNewsArticle, getNewsPage, NEWS_PATH } from '@/lib/news';
import { newsCategoryHref } from '@/lib/news-path';
import NewsArticlePage from '../../components/NewsArticlePage';

// Articles come from Strapi: each renders on its first visit, then is cached.
export const dynamicParams = true;
export const revalidate = 300;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { locale, category, slug } = await params;
  const a = await getNewsArticle(locale, category, slug);
  if (!a) return {};
  return pageMetadata({ locale, path: a.href, title: a.metaTitle || a.title, description: a.metaDescription || a.excerpt });
}

export default async function Page({ params }) {
  const { locale, category, slug } = await params;
  const article = await getNewsArticle(locale, category, slug);
  if (!article) notFound();
  setRequestLocale(locale);
  const [{ articles }, t] = await Promise.all([getNewsPage(locale, { category, pageSize: 9 }), getTranslations({ locale, namespace: 'gtcNewsPage.breadcrumb' })]);
  const related = articles.filter((a) => a.slug !== article.slug).slice(0, 8);
  const { lesson, html, ...meta } = article;
  return (
    <>
      <JsonLd
        data={breadcrumbLd(locale, [
          { name: t('home'), path: '' },
          { name: t('current'), path: NEWS_PATH },
          ...(article.category ? [{ name: article.category, path: newsCategoryHref(category) }] : []),
          { name: article.title, path: article.href }
        ])}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: article.title,
          description: meta.metaDescription || article.excerpt || undefined,
          datePublished: article.publishedAt || undefined,
          image: article.cover?.url ? [article.cover.url] : undefined,
          author: article.author ? { '@type': 'Person', name: article.author } : { '@type': 'Organization', name: 'GTCFX' },
          publisher: { '@type': 'Organization', name: 'GTCFX', url: SITE_URL },
          mainEntityOfPage: `${SITE_URL}/${locale}${article.href}`
        }}
      />
      <NewsArticlePage article={article} related={related} />
    </>
  );
}
