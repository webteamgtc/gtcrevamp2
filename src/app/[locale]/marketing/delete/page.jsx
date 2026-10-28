import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CAT5_LOCALES } from '@/config/regions';
import { pageMetadata } from '@/lib/seo';
import DeleteCat5Shell from './DeleteCat5Shell';

const PATH = '/trading/delete';

/** UAE CAT 5 website — same public URL pattern as /faqs (see src/proxy.js). */
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'deleteAccountPage.meta' });
  return { ...pageMetadata({ locale, path: PATH, title: t('title'), description: t('description') }), robots: { index: false, follow: true } };
}

export default async function Page({ params }) {
  const { locale } = await params;
  if (!CAT5_LOCALES.includes(locale)) notFound();
  setRequestLocale(locale);
  return <DeleteCat5Shell />;
}
