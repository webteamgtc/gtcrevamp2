import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMetadata, breadcrumbLd, organizationLd, JsonLd } from '@/lib/seo';
import AboutUsPage from './components/AboutUsPage';

const PATH = '/company/about-us';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'aboutUsPage.meta' });
  return pageMetadata({ locale, path: PATH, title: t('title'), description: t('description') });
}

export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'aboutUsPage.breadcrumb' });
  return (
    <>
      <JsonLd
        data={breadcrumbLd(locale, [
          { name: t('home'), path: '' },
          { name: t('company'), path: '/company' },
          { name: t('current'), path: PATH }
        ])}
      />
      <JsonLd data={organizationLd()} />
      <AboutUsPage />
    </>
  );
}
