'use client';
/**
 * /gtc-news/company-news — same design as Market Daily Updates (18 Nov 2026): the "Chart sweep" hero and the
 * "Gallery + viewer" archive, with photo covers (cropped tiles, whole photo in the viewer) and newsroom text.
 */
import MarketDailyHero from './MarketDailyHero';
import MarketDailyArchive from './MarketDailyArchive';

export default function CompanyNewsCategory({ category, categories, articles, t, crumbs, loadMore }) {
  return (
    <>
      <MarketDailyHero category={category} categories={categories} articles={articles} t={t} crumbs={crumbs} ns="companyNews" fit="cover" />
      <MarketDailyArchive articles={articles} t={t} loadMore={loadMore} ns="companyNews" photo />
    </>
  );
}
