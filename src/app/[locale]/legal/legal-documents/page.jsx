import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMetadata, breadcrumbLd, JsonLd } from '@/lib/seo';
import LegalDocumentsPage from './components/LegalDocumentsPage';

const PATH = '/legal/legal-documents';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legalPage.hub.meta' });
  return pageMetadata({ locale, path: PATH, title: t('title'), description: t('description') });
}

export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'legalPage' });
  return (
    <>
      <JsonLd
        data={breadcrumbLd(locale, [
          { name: t('breadcrumb.home'), path: '' },
          { name: t('hub.current'), path: PATH }
        ])}
      />
      <LegalDocumentsPage />
    </>
  );
}
