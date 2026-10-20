import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMetadata, breadcrumbLd, JsonLd } from '@/lib/seo';
import { getArticle, getSection, getSectionArticles } from '@/lib/learn';
import ArticlePage from '../../../components/course/ArticlePage';
import { COURSES, HUB_PATH, articleHref, courseHref, sectionHref } from '../../../courses';

// Articles come from Strapi: each renders on its first visit, then is cached.
export const dynamicParams = true;
export const revalidate = 300;

export function generateStaticParams() {
  return [];
}

async function load(locale, slug, sectionSlug, articleSlug) {
  const course = COURSES[slug];
  if (!course) return null;
  const [section, article] = await Promise.all([getSection(locale, slug, sectionSlug), getArticle(locale, sectionSlug, articleSlug)]);
  return section && article ? { course, section, article } : null;
}

export async function generateMetadata({ params }) {
  const { locale, slug, sectionSlug, articleSlug } = await params;
  const data = await load(locale, slug, sectionSlug, articleSlug);
  if (!data) return {};
  const { article } = data;
  return pageMetadata({
    locale,
    path: articleHref(slug, sectionSlug, article.slug),
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt
  });
}

export default async function Page({ params }) {
  const { locale, slug, sectionSlug, articleSlug } = await params;
  const data = await load(locale, slug, sectionSlug, articleSlug);
  if (!data) notFound();
  setRequestLocale(locale);
  const { course, section, article } = data;
  const [articles, tk, tc] = await Promise.all([
    getSectionArticles(locale, section.slug),
    getTranslations({ locale, namespace: 'knowledgePage.breadcrumb' }),
    getTranslations({ locale, namespace: `${course.ns}.courseHeader` })
  ]);
  return (
    <>
      <JsonLd
        data={breadcrumbLd(locale, [
          { name: tk('home'), path: '' },
          { name: tk('current'), path: HUB_PATH },
          { name: tc('title').replace(/[[\]]/g, ''), path: courseHref(slug) },
          { name: section.name, path: sectionHref(slug, section.slug) },
          { name: article.title, path: articleHref(slug, section.slug, article.slug) }
        ])}
      />
      <ArticlePage course={slug} ns={course.ns} section={section} article={article} articles={articles} />
    </>
  );
}
