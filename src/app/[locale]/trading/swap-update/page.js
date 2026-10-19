import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMetadata, breadcrumbLd, JsonLd } from '@/lib/seo';
import SwapUpdatePage from './components/SwapUpdatePage';

const NS = 'swapUpdatePage';
const PATH = '/trading/swap-update';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: `${NS}.meta` });
  return pageMetadata({ locale, path: PATH, title: t('title'), description: t('description') });
}

export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: `${NS}.breadcrumb` });
  return (
    <>
      <JsonLd
        data={breadcrumbLd(locale, [
          { name: t('home'), path: '' },
          { name: t('trading'), path: '/trading' },
          { name: t('current'), path: PATH }
        ])}
      />
      <SwapUpdatePage />
    </>
  );
}
