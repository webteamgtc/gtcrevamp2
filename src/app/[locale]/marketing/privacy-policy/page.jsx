import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CAT5_LOCALES } from '@/config/regions';
import { pageMetadata } from '@/lib/seo';
import { getLegalDocument } from '@/lib/legalDocuments';
import PrivacyCat5Shell from './PrivacyCat5Shell';

export const revalidate = 3600;

const slug = 'privacy-policy';
const PATH = '/privacy-policy';

/** UAE CAT 5 website — same public URL pattern as /about-us (see ../page.js and src/proxy.js). */
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legalPage.docs.privacy-policy' });
  return { ...pageMetadata({ locale, path: PATH, title: t('title'), description: t('description') }), robots: { index: false, follow: false } };
}

export default async function Page({ params }) {
  const { locale } = await params;
  if (!CAT5_LOCALES.includes(locale)) notFound();
  setRequestLocale(locale);
  const doc = await getLegalDocument(slug, locale);
  return <PrivacyCat5Shell slug={slug} doc={doc} />;
}
