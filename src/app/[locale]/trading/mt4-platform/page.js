import { setRequestLocale } from 'next-intl/server';
import { JsonLd } from '@/lib/seo';
import MetaTraderPage from '../common-metatrader/components/MetaTraderPage';
import { mtBreadcrumbLd, mtMetadata } from '../common-metatrader/metaPage';

const NS = 'mt4Page';
const PATH = '/trading/mt4-platform';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return mtMetadata(locale, NS, PATH);
}

export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <JsonLd data={await mtBreadcrumbLd(locale, NS, PATH)} />
      <MetaTraderPage ns="mt4Page" version="mt4" />
    </>
  );
}
