import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMetadata } from '@/lib/seo';
import { NEWS_PATH } from '@/lib/news-path';
import TradingNewsPage from './components/TradingNewsPage';

const PATH = `${NEWS_PATH}/trading-news`;

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tradingNewsPage.meta' });
  return pageMetadata({ locale, path: PATH, title: t('title'), description: t('description') });
}

export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TradingNewsPage />;
}
