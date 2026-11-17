'use client';
/**
 * /gtc-news/market-daily-updates — "Chart sweep" hero (MarketDailyHero.jsx) + "Gallery + viewer" archive
 * (MarketDailyArchive.jsx), both chosen 18 Nov 2026.
 */
import MarketDailyHero from './MarketDailyHero';
import MarketDailyArchive from './MarketDailyArchive';

export default function MarketDailyCategory({ category, categories, articles, t, crumbs, loadMore }) {
  return (
    <>
      <MarketDailyHero category={category} categories={categories} articles={articles} t={t} crumbs={crumbs} />
      <MarketDailyArchive articles={articles} t={t} loadMore={loadMore} />
    </>
  );
}
