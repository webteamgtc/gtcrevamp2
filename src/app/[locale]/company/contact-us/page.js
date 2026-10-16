import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMetadata, breadcrumbLd, organizationLd, JsonLd } from '@/lib/seo';
import ContactPage from './components/ContactPage';

const PATH = '/company/contact-us';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contactPage.meta' });
  return pageMetadata({ locale, path: PATH, title: t('title'), description: t('description') });
}

export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'contactPage.breadcrumb' });
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
      <ContactPage />
    </>
  );
}
