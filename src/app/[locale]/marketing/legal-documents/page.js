import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CAT5_LOCALES } from '@/config/regions';
import LegalDocumentsPage from './components/LegalDocumentsPage';

/** UAE CAT 5 — CMA legal documents (PDF). See src/proxy.js. */
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'marketingPage.legalDocumentsPage.meta' });
  return { title: t('title'), description: t('description'), robots: { index: false, follow: false } };
}

export default async function Page({ params }) {
  const { locale } = await params;
  if (!CAT5_LOCALES.includes(locale)) notFound();
  setRequestLocale(locale);
  return <LegalDocumentsPage />;
}
