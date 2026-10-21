'use client';
/**
 * "GTCFX & Market Trends" — navy tab bar of Strapi news categories (sliding white pill) above a 3×2 grid of the
 * category's newest posts. One card is highlighted navy and the highlight follows the hovered card.
 * Tabs load through /api/news (cached per category); "Read More" opens the category page.
 */
import { useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import ArrowLink from '@/components/shared/ArrowLink';
import NavLink from '@/components/shared/nav/NavLink';
import { SectionIntro } from '@/components/shared/SectionIntro';
import { NewsCover, NewsMeta } from '@/components/shared/news/NewsCard';
import { Reveal, EASE } from '@/components/motion';
import { newsCategoryHref } from '@/lib/news-path';
import { cn } from '@/lib/utils';

const SIZE = 6;
const DEFAULT_ON = 2; // third card highlighted, as in the design

function TrendCard({ article, on, onHover, readMore, index }) {
  return (
    <motion.article
      onMouseEnter={onHover}
      onFocus={onHover}
      className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] ring-1 ring-brand/10"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE, delay: index * 0.06 }}
    >
      {on && (
        <motion.span layoutId="trend-on" className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-800 to-brand-950 shadow-2xl shadow-brand/30" transition={{ type: 'spring', stiffness: 360, damping: 34 }} aria-hidden>
          <span className="bg-grid-dark absolute inset-0 opacity-40" />
        </motion.span>
      )}
      {!on && <span className="absolute inset-0 bg-white" aria-hidden />}
      <div className="relative m-2 aspect-[16/9] overflow-hidden rounded-[1.35rem]">
        <NewsCover article={article} />
      </div>
      <div className={cn('relative flex flex-1 flex-col px-5 pb-6 pt-3 transition-colors duration-500', on && 'is-dark text-white')}>
        <NewsMeta article={article} dark={on} />
        <h3 className={cn('mt-3 line-clamp-2 text-[17px] font-semibold leading-snug transition-colors', on ? 'text-white' : 'text-ink group-hover:text-brand')}>
          <NavLink href={article.href} className="after:absolute after:inset-0">
            {article.title}
          </NavLink>
        </h3>
        {article.excerpt && <p className={cn('mt-2 line-clamp-3 flex-1 text-sm leading-relaxed transition-colors', on ? 'text-white/65' : 'text-ink/55')}>{article.excerpt}</p>}
        <span className={cn('mt-5 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors', on ? 'text-gold-200' : 'text-brand')}>
          {readMore}
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
        </span>
      </div>
    </motion.article>
  );
}

function Skeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
      {Array.from({ length: SIZE }, (_, i) => (
        <div key={i} className="overflow-hidden rounded-[1.75rem] bg-white p-2 ring-1 ring-brand/10">
          <div className="aspect-[16/9] animate-pulse rounded-[1.35rem] bg-brand-50" />
          <div className="space-y-2.5 p-4">
            <div className="h-3 w-1/3 animate-pulse rounded-full bg-brand-50" />
            <div className="h-4 w-5/6 animate-pulse rounded-full bg-brand-50" />
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-brand-50" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TrendsSection({ categories, initial }) {
  const t = useTranslations('gtcNewsPage.trends');
  const locale = useLocale();
  const [active, setActive] = useState(categories[0]?.slug ?? null);
  const [articles, setArticles] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [on, setOn] = useState(DEFAULT_ON);
  const cache = useRef(new Map(active ? [[active, initial]] : []));

  const pick = async (slug) => {
    if (slug === active) return;
    setActive(slug);
    setOn(DEFAULT_ON);
    if (cache.current.has(slug)) return setArticles(cache.current.get(slug));
    setLoading(true);
    try {
      const res = await fetch(`/api/news?${new URLSearchParams({ locale, category: slug, pageSize: String(SIZE) })}`);
      const data = await res.json();
      cache.current.set(slug, data.articles ?? []);
      setArticles(data.articles ?? []);
    } catch {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  if (!categories.length) return null;

  return (
    <section id="trends" className="relative overflow-hidden bg-[#f6f7fb] py-14 md:py-24">
      <div className="bg-grid-light mask-radial absolute inset-0 opacity-60" aria-hidden />
      <div className="absolute -end-40 top-10 size-[460px] rounded-full bg-brand/[0.07] blur-[120px]" aria-hidden />
      <div className="container-x relative">
        <SectionIntro title={t('title')} />

        <Reveal y={16} className="mt-10 md:mt-12">
          <div className="is-dark relative overflow-hidden rounded-[1.5rem] bg-gradient-to-r from-brand-700 via-brand-800 to-brand-900 p-2 shadow-xl shadow-brand/20">
            <div className="bg-grid-dark absolute inset-0 opacity-40" aria-hidden />
            <div className="no-scrollbar relative flex gap-1 overflow-x-auto" role="tablist">
              {categories.map((c) => {
                const sel = c.slug === active;
                return (
                  <button key={c.slug} type="button" role="tab" aria-selected={sel} onClick={() => pick(c.slug)} className={cn('relative inline-flex h-12 shrink-0 items-center gap-2 rounded-2xl px-5 text-sm font-semibold transition-colors md:px-6', sel ? 'text-brand-900' : 'text-white/75 hover:text-white')}>
                    {sel && <motion.span layoutId="trend-tab" className="absolute inset-0 rounded-2xl bg-white shadow-lg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} aria-hidden />}
                    <span className="relative whitespace-nowrap">{c.name}</span>
                    <span className={cn('relative rounded-full px-2 py-0.5 text-[11px] tabular-nums', sel ? 'bg-brand-50 text-brand' : 'bg-white/10 text-white/70')}>{c.count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div key={loading ? 'loading' : active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              {loading ? (
                <Skeleton />
              ) : !articles.length ? (
                <p className="rounded-[1.75rem] bg-white py-16 text-center text-ink/50 ring-1 ring-brand/10">{t('emptyState')}</p>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" onMouseLeave={() => setOn(Math.min(DEFAULT_ON, articles.length - 1))}>
                  {articles.map((a, i) => (
                    <TrendCard key={a.id} article={a} index={i} on={on === i} onHover={() => setOn(i)} readMore={t('readMore')} />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <Reveal y={12} className="mt-12 flex justify-center">
          <ArrowLink href={newsCategoryHref(active)}>{t('readMore')}</ArrowLink>
        </Reveal>
      </div>
    </section>
  );
}
