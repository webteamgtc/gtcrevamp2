import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMetadata, breadcrumbLd, organizationLd, JsonLd } from '@/lib/seo';
import CompanyPage from './components/CompanyPage';

const PATH = '/company';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'companyPage.meta' });
  return pageMetadata({ locale, path: PATH, title: t('title'), description: t('description') });
}

export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'companyPage.breadcrumb' });
  return (
    <>
      <JsonLd data={breadcrumbLd(locale, [{ name: t('home'), path: '' }, { name: t('company'), path: PATH }])} />
      <JsonLd data={organizationLd()} />
      <CompanyPage />
    </>
  );
}
