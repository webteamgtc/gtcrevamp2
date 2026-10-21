import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMetadata, breadcrumbLd, JsonLd } from '@/lib/seo';
import { getNewsCategories, getNewsPage, NEWS_PATH } from '@/lib/news';
import GtcNewsPage from './components/GtcNewsPage';

export const revalidate = 300; // posts come from Strapi

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'gtcNewsPage.meta' });
  return pageMetadata({ locale, path: NEWS_PATH, title: t('title'), description: t('description') });
}

export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const all = await getNewsCategories(locale);
  const categories = all.filter((c) => c.slug !== 'event'); // events have their own section (knowledge hub)
  const first = categories[0]?.slug;
  const [trends, events, t] = await Promise.all([
    first ? getNewsPage(locale, { category: first, pageSize: 6 }) : { articles: [] },
    getNewsPage(locale, { category: 'event', pageSize: 1 }),
    getTranslations({ locale, namespace: 'gtcNewsPage.breadcrumb' })
  ]);
  // knowledge hub: latest event, else the newest blog
  const featured = events.articles[0] ?? (await getNewsPage(locale, { category: 'blogs', pageSize: 1 })).articles[0] ?? null;

  return (
    <>
      <JsonLd
        data={breadcrumbLd(locale, [
          { name: t('home'), path: '' },
          { name: t('current'), path: NEWS_PATH }
        ])}
      />
      <GtcNewsPage categories={categories} trends={trends.articles} featured={featured} />
    </>
  );
}
