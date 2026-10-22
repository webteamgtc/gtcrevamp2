import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMetadata, breadcrumbLd, JsonLd } from '@/lib/seo';
import DeleteAccountPage from './components/DeleteAccountPage';

const PATH = '/trading/delete';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'deleteAccountPage.meta' });
  return { ...pageMetadata({ locale, path: PATH, title: t('title'), description: t('description') }), robots: { index: false, follow: true } };
}

export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'deleteAccountPage.breadcrumb' });
  return (
    <>
      <JsonLd
        data={breadcrumbLd(locale, [
          { name: t('home'), path: '' },
          { name: t('trading'), path: '/trading' },
          { name: t('current'), path: PATH }
        ])}
      />
      <DeleteAccountPage />
    </>
  );
}
