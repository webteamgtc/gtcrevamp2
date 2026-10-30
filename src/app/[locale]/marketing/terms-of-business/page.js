import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CAT5_LOCALES } from '@/config/regions';
import TermsOfBusinessPage from './components/TermsOfBusinessPage';

/** UAE CAT 5 — Terms of Business (PDF). See src/proxy.js. */
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'marketingPage.termsOfBusinessPage.meta' });
  return { title: t('title'), description: t('description'), robots: { index: false, follow: false } };
}

export default async function Page({ params }) {
  const { locale } = await params;
  if (!CAT5_LOCALES.includes(locale)) notFound();
  setRequestLocale(locale);
  return <TermsOfBusinessPage />;
}
