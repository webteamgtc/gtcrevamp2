'use client';
/**
 * /gtc-news/<category> — every post of one Strapi news category, newest first, "Load more" pages through /api/news.
 * Same layout for every category: the "Chart sweep" hero with the category pills and the newest post
 * (NewsCategoryHero.jsx), then a featured story and a 3-column grid, every card linking to its post (NewsArchive.jsx).
 */
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { ScrollProgress } from '@/components/motion';
import { NEWS_PATH } from '@/lib/news-path';
import { previewArticles } from '@/data/news.preview';
import ActivationBand from './ActivationBand';
import NewsCategoryHero from './NewsCategoryHero';
import NewsArchive from './NewsArchive';
import { newsText } from './categoryShared';

const PAGE_SIZE = 12;
const PREVIEW = process.env.NEXT_PUBLIC_STATIC_EXPORT === '1';

export default function CategoryPage({ category, categories, initial, total }) {
  const t = useTranslations('gtcNewsPage');
  const locale = useLocale();
  const [articles, setArticles] = useState(initial);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const more = articles.length < total;

  const loadMore = async () => {
    setLoading(true);
    try {
      let next = [];
      if (PREVIEW) next = previewArticles('market-daily-updates', 6).map((a) => ({ ...a, id: `more-${a.id}`, category: category.name, categorySlug: category.slug }));
      else {
        const res = await fetch(`/api/news?${new URLSearchParams({ locale, category: category.slug, page: String(page + 1), pageSize: String(PAGE_SIZE) })}`);
        next = (await res.json()).articles ?? [];
      }
      const seen = new Set(articles.map((a) => a.id));
      setArticles([...articles, ...next.filter((a) => !seen.has(a.id))]);
      setPage(page + 1);
    } catch {
      // keep what is shown; the button stays so the visitor can try again
    } finally {
      setLoading(false);
    }
  };

  const crumbs = [{ label: t('breadcrumb.home'), href: '/' }, { label: t('breadcrumb.current'), href: NEWS_PATH }, { label: category.name }];
  const tx = newsText(t, category);
  return (
    <div className="overflow-x-clip bg-white text-ink">
      <ScrollProgress />
      <Header theme="dark" />
      <main>
        <NewsCategoryHero category={category} categories={categories} articles={articles} t={t} tx={tx} crumbs={crumbs} />
        <NewsArchive articles={articles} t={t} tx={tx} loadMore={{ more, loading, onClick: loadMore }} />
        <ActivationBand />
      </main>
      <Footer theme="dark" />
    </div>
  );
}
