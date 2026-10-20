import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMetadata, breadcrumbLd, JsonLd } from '@/lib/seo';
import LiquidityPage from './components/LiquidityPage';

const PATH = '/knowledge-to-learn/liquidity-technology';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'liquidityTechnologyPage.meta' });
  return pageMetadata({ locale, path: PATH, title: t('title'), description: t('description') });
}

export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tk = await getTranslations({ locale, namespace: 'knowledgePage.breadcrumb' });
  const t = await getTranslations({ locale, namespace: 'liquidityTechnologyPage.breadcrumb' });
  return (
    <>
      <JsonLd
        data={breadcrumbLd(locale, [
          { name: tk('home'), path: '' },
          { name: tk('current'), path: '/knowledge-to-learn' },
          { name: t('current'), path: PATH }
        ])}
      />
      <LiquidityPage />
    </>
  );
}
