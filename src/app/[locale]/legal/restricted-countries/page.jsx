import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMetadata, breadcrumbLd, JsonLd } from '@/lib/seo';
import RestrictedCountriesPage from './components/RestrictedCountriesPage';

const PATH = '/legal/restricted-countries';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legalPage.restricted.meta' });
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
          { name: t('breadcrumb.legal'), path: '/legal/legal-documents' },
          { name: t('restricted.current'), path: PATH }
        ])}
      />
      <RestrictedCountriesPage />
    </>
  );
}
