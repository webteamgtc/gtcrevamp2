import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMetadata, breadcrumbLd, JsonLd } from '@/lib/seo';
import { MARKET_PAGES, marketPageBySlug } from '@/config/marketPages';
import { getMarketSymbols } from '@/lib/marketSymbols';
import MarketPage from './components/MarketPage';

export const dynamicParams = false;
export const revalidate = 3600; // re-check the symbol list hourly

export function generateStaticParams() {
  return MARKET_PAGES.map((p) => ({ market: p.slug }));
}

export async function generateMetadata({ params }) {
  const { locale, market } = await params;
  const page = marketPageBySlug(market);
  if (!page) return {};
  const t = await getTranslations({ locale, namespace: `marketsPage.pages.${page.id}.meta` });
  return pageMetadata({ locale, path: `/markets/${page.slug}`, title: t('title'), description: t('description') });
}

export default async function Page({ params }) {
  const { locale, market } = await params;
  const page = marketPageBySlug(market);
  if (!page) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'marketsPage' });
  const symbols = await getMarketSymbols(page);
  const faq = page.template === 'B' ? t.raw(`pages.${page.id}.faq.items`) : null;
  return (
    <>
      <JsonLd
        data={breadcrumbLd(locale, [
          { name: t('breadcrumb.home'), path: '' },
          { name: t('detail.markets'), path: '/markets' },
          { name: t(`pages.${page.id}.name`), path: `/markets/${page.slug}` }
        ])}
      />
      {faq && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
          }}
        />
      )}
      <MarketPage page={{ slug: page.slug, id: page.id, template: page.template }} symbols={symbols} />
    </>
  );
}
