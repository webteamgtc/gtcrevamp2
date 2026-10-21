import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CAT5_LOCALE } from '@/config/regions';
import MarketingPage from './components/MarketingPage';

/**
 * /en-ae/marketing — UAE CAT 5 (marketing only) landing page.
 * Standalone: no menu, no footer links. While a visitor has chosen CAT 5, every other page redirects here
 * (src/proxy.js). Hidden from search engines. Copy: messages/en/marketingPage.json
 */
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'marketingPage.meta' });
  return { title: t('title'), description: t('description'), robots: { index: false, follow: false } };
}

export default async function Page({ params }) {
  const { locale } = await params;
  if (locale !== CAT5_LOCALE) notFound();
  setRequestLocale(locale);
  return <MarketingPage />;
}
