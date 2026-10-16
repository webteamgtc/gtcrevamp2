import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMetadata, organizationLd, JsonLd } from '@/lib/seo';
import HomePage from './components/HomePage';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return pageMetadata({ locale, path: '', title: t('title'), description: t('description') });
}

export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <JsonLd data={organizationLd()} />
      <HomePage />
    </>
  );
}
