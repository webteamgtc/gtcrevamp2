/**
 * Server side of every /legal/<slug> policy page: metadata, breadcrumb JSON-LD and the S3 document.
 * Each page.jsx is just:
 *   const route = legalRoute('privacy-policy');
 *   export const generateMetadata = route.generateMetadata;
 *   export default route.Page;
 * A page that doesn't exist on a locale (pageExists in src/config/regions.js — e.g. the South African policies
 * outside /en-za) answers 404; the proxy sends /en-za's other legal URLs to its hub.
 */
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageExists } from '@/config/regions';
import { pageMetadata } from '@/lib/seo';
import { getLegalDocument } from '@/lib/legalDocuments';
import LegalDocumentPage from './LegalDocumentPage';

export function legalRoute(slug) {
  const path = `/legal/${slug}`;

  async function generateMetadata({ params }) {
    const { locale } = await params;
    if (!pageExists(locale, path)) return {};
    const t = await getTranslations({ locale, namespace: `legalPage.docs.${slug}` });
    return pageMetadata({ locale, path, title: t('title'), description: t('description') });
  }

  async function Page({ params }) {
    const { locale } = await params;
    if (!pageExists(locale, path)) notFound();
    setRequestLocale(locale);
    const doc = await getLegalDocument(slug, locale);
    return <LegalDocumentPage slug={slug} doc={doc} />;
  }

  return { generateMetadata, Page };
}
