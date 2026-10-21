'use client';
/**
 * /gtc-news/<category> — every post of one Strapi news category, newest first.
 * Rhythm: dark hero (category switcher + count) → white (lead story + card grid + load more) → navy activation band.
 */
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { Loader2, Plus } from 'lucide-react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import NavLink from '@/components/shared/nav/NavLink';
import NewsCard, { NewsCover, NewsMeta } from '@/components/shared/news/NewsCard';
import { ScrollProgress, Reveal, EASE } from '@/components/motion';
import { NEWS_PATH, newsCategoryHref } from '@/lib/news-path';
import { cn } from '@/lib/utils';
import NewsHero from './NewsHero';
import ActivationBand from './ActivationBand';

const PAGE_SIZE = 12;

function CategoryNav({ categories, current }) {
  return (
    <motion.nav className="no-scrollbar -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-wrap lg:px-0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
      {categories.map((c) => {
        const on = c.slug === current;
        return (
          <NavLink key={c.slug} href={newsCategoryHref(c.slug)} aria-current={on ? 'page' : undefined} className={cn('inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold ring-1 transition-colors', on ? 'bg-gold text-white ring-gold' : 'bg-white/[0.06] text-white/75 ring-white/15 hover:bg-white/[0.12] hover:text-white')}>
            {c.name}
            <span className={cn('rounded-full px-1.5 text-[11px] tabular-nums', on ? 'bg-white/25' : 'bg-white/10')}>{c.count}</span>
          </NavLink>
        );
      })}
    </motion.nav>
  );
}

function Lead({ article }) {
  return (
    <article className="group relative grid overflow-hidden rounded-[2rem] bg-white ring-1 ring-brand/10 transition-shadow duration-500 hover:shadow-2xl hover:shadow-brand/15 lg:grid-cols-[1.3fr_1fr]">
      <div className="aspect-[16/9] overflow-hidden lg:aspect-auto lg:min-h-[380px]">
        <NewsCover article={article} />
      </div>
      <div className="flex flex-col justify-center p-7 md:p-10">
        <NewsMeta article={article} showCategory={false} />
        <h2 className="mt-4 line-clamp-3 text-2xl font-bold leading-tight text-ink transition-colors group-hover:text-brand md:text-3xl">
          <NavLink href={article.href} className="after:absolute after:inset-0">
            {article.title}
          </NavLink>
        </h2>
        {article.excerpt && <p className="mt-4 line-clamp-4 text-[15px] leading-relaxed text-ink/60">{article.excerpt}</p>}
      </div>
    </article>
  );
}

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
      const res = await fetch(`/api/news?${new URLSearchParams({ locale, category: category.slug, page: String(page + 1), pageSize: String(PAGE_SIZE) })}`);
      const data = await res.json();
      const seen = new Set(articles.map((a) => a.id));
      setArticles([...articles, ...(data.articles ?? []).filter((a) => !seen.has(a.id))]);
      setPage(page + 1);
    } finally {
      setLoading(false);
    }
  };

  const [lead, ...rest] = articles;
  return (
    <div className="overflow-x-clip bg-white text-ink">
      <ScrollProgress />
      <Header theme="dark" />
      <main>
        <NewsHero
          crumbs={[{ label: t('breadcrumb.home'), href: '/' }, { label: t('breadcrumb.current'), href: NEWS_PATH }, { label: category.name }]}
          back={{ href: NEWS_PATH, label: t('category.backToNews') }}
          title={category.name}
          kicker={
            <motion.span className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-gold-200 ring-1 ring-gold/30" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              {t('category.articles', { count: total })}
            </motion.span>
          }
        >
          <CategoryNav categories={categories} current={category.slug} />
        </NewsHero>

        <section className="relative overflow-hidden bg-white py-14 md:py-20">
          <div className="absolute -end-40 top-10 size-[460px] rounded-full bg-brand/[0.06] blur-[120px]" aria-hidden />
          <div className="container-x relative">
            {lead ? (
              <>
                <Reveal y={24}>
                  <Lead article={lead} />
                </Reveal>
                {/* each card animates itself: a parent Stagger only reveals the cards present on first view,
                    so cards appended by "Load more" would stay hidden */}
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((a, i) => (
                    <motion.div key={a.id} className="h-full" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.5, ease: EASE, delay: (i % 3) * 0.08 }}>
                      <NewsCard article={a} showCategory={false} />
                    </motion.div>
                  ))}
                </div>
                {more && (
                  <div className="mt-12 flex justify-center">
                    <button type="button" onClick={loadMore} disabled={loading} className="group inline-flex h-13 items-center gap-2.5 rounded-full bg-brand ps-7 pe-2 text-base font-semibold text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand-700 disabled:opacity-70">
                      {t('category.loadMore')}
                      <span className="grid size-9 place-items-center rounded-full bg-white text-brand">{loading ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4 transition-transform duration-300 group-hover:rotate-90" />}</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="rounded-[1.75rem] bg-[#f6f7fb] py-16 text-center text-ink/50">{t('trends.emptyState')}</p>
            )}
          </div>
        </section>

        <ActivationBand />
      </main>
      <Footer theme="dark" />
    </div>
  );
}
