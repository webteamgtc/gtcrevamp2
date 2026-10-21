import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMetadata, breadcrumbLd, JsonLd } from '@/lib/seo';
import { getNewsCategories, getNewsPage, NEWS_PATH } from '@/lib/news';
import { newsCategoryHref } from '@/lib/news-path';
import CategoryPage from '../components/CategoryPage';

export const revalidate = 300; // posts come from Strapi

async function load(locale, slug) {
  const categories = await getNewsCategories(locale);
  const category = categories.find((c) => c.slug === slug);
  return category ? { categories, category } : null;
}

export async function generateMetadata({ params }) {
  const { locale, category } = await params;
  const data = await load(locale, category);
  if (!data) return {};
  const t = await getTranslations({ locale, namespace: 'gtcNewsPage.meta' });
  return pageMetadata({ locale, path: newsCategoryHref(category), title: `${data.category.name} | ${t('title')}`, description: t('description') });
}

export default async function Page({ params }) {
  const { locale, category: slug } = await params;
  const data = await load(locale, slug);
  if (!data) notFound();
  setRequestLocale(locale);
  const [{ articles, total }, t] = await Promise.all([getNewsPage(locale, { category: slug, pageSize: 12 }), getTranslations({ locale, namespace: 'gtcNewsPage.breadcrumb' })]);
  return (
    <>
      <JsonLd
        data={breadcrumbLd(locale, [
          { name: t('home'), path: '' },
          { name: t('current'), path: NEWS_PATH },
          { name: data.category.name, path: newsCategoryHref(slug) }
        ])}
      />
      <CategoryPage category={data.category} categories={data.categories} initial={articles} total={total} />
    </>
  );
}
