import { setRequestLocale } from 'next-intl/server';
import { JsonLd } from '@/lib/seo';
import GtcGoPage from '../common-gtc-components/components/GtcGoPage';
import { mtBreadcrumbLd as breadcrumbFor, mtMetadata as metadataFor } from '../common-metatrader/metaPage';

const NS = 'gtcGoAndroidPage';
const PATH = '/trading/gtc-go-app-andriod';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return metadataFor(locale, NS, PATH);
}

export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <JsonLd data={await breadcrumbFor(locale, NS, PATH)} />
      <GtcGoPage ns={NS} device="android" />
    </>
  );
}
