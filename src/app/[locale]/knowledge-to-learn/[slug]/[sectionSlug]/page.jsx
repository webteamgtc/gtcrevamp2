import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMetadata, breadcrumbLd, JsonLd } from '@/lib/seo';
import { getSection, getSectionArticles } from '@/lib/learn';
import SectionPage from '../../components/course/SectionPage';
import { COURSES, HUB_PATH, courseHref, sectionHref } from '../../courses';

// Sections come from Strapi: each renders on its first visit, then is cached.
export const dynamicParams = true;
export const revalidate = 300;

export function generateStaticParams() {
  return [];
}

async function load(locale, slug, sectionSlug) {
  const course = COURSES[slug];
  if (!course) return null;
  const section = await getSection(locale, slug, sectionSlug);
  return section ? { course, section } : null;
}

export async function generateMetadata({ params }) {
  const { locale, slug, sectionSlug } = await params;
  const data = await load(locale, slug, sectionSlug);
  if (!data) return {};
  const t = await getTranslations({ locale, namespace: `${data.course.ns}.meta` });
  return pageMetadata({ locale, path: sectionHref(slug, sectionSlug), title: `${data.section.name} | ${t('title')}`, description: t('description') });
}

export default async function Page({ params }) {
  const { locale, slug, sectionSlug } = await params;
  const data = await load(locale, slug, sectionSlug);
  if (!data) notFound();
  setRequestLocale(locale);
  const { course, section } = data;
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
          { name: section.name, path: sectionHref(slug, section.slug) }
        ])}
      />
      <SectionPage course={slug} ns={course.ns} section={section} articles={articles} />
    </>
  );
}
