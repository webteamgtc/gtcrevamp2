import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMetadata, breadcrumbLd, JsonLd } from '@/lib/seo';
import { getLatestNews } from '@/lib/news';
import MarketsPage from './components/MarketsPage';

const PATH = '/markets';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'marketsPage.meta' });
  return pageMetadata({ locale, path: PATH, title: t('title'), description: t('description') });
}

/**
 * News comes from Strapi (collection `articles`, see docs/strapi-news.md), cached for STRAPI_REVALIDATE
 * seconds; without STRAPI_URL the section shows the sample articles in src/data/news.sample.js.
 */
export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'marketsPage.breadcrumb' });
  const { articles } = await getLatestNews(locale, 5);
  return (
    <>
      <JsonLd
        data={breadcrumbLd(locale, [
          { name: t('home'), path: '' },
          { name: t('current'), path: PATH }
        ])}
      />
      <MarketsPage news={articles} />
    </>
  );
}
