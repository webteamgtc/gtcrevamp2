'use client';
/**
 * /gtc-news/market-daily-updates — "Chart sweep" hero (MarketDailyHero.jsx, chosen 18 Nov 2026) + archive.
 * The archive is under review: the live index rows below, or a draft from MarketDailyArchives.jsx (?dailyArchive=).
 */
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { NewsCover } from '@/components/shared/news/NewsCard';
import { Reveal, EASE } from '@/components/motion';
import { cn } from '@/lib/utils';
import { Empty, LoadMore, PostTitle, When } from './categoryShared';
import MarketDailyHero from './MarketDailyHero';
import MarketDailyArchive from './MarketDailyArchives';

const inView = (i = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.45, ease: EASE, delay: (i % 4) * 0.06 }
});

function CoverFrame({ article, className }) {
  return (
    <div className={cn('flex items-center justify-center overflow-hidden rounded-2xl bg-white ring-1 ring-brand/10', className)}>
      <NewsCover article={article} showTitle={false} fit="contain" />
    </div>
  );
}

export default function MarketDailyCategory({ category, categories, articles, t, crumbs, loadMore, archive = 'now' }) {
  const tm = (key) => t(`marketDaily.${key}`);
  const [lead, ...rest] = articles;
  const rows = lead ? rest : articles;

  return (
    <>
      <MarketDailyHero category={category} categories={categories} articles={articles} t={t} crumbs={crumbs} />

      {archive !== 'now' ? (
        <MarketDailyArchive variant={archive} articles={articles} t={t} loadMore={loadMore} />
      ) : (
      <section className="relative scroll-mt-20 overflow-clip bg-[#f6f7fb] py-14 md:py-24">
        <div className="bg-grid-light mask-radial absolute inset-0 opacity-60" aria-hidden />
        <span className="absolute -end-40 top-24 size-[420px] rounded-full bg-brand/[0.07] blur-[120px]" aria-hidden />
        <div className="container-x relative">
          {!articles.length ? (
            <Empty t={t} />
          ) : rows.length > 0 ? (
            <>
              <Reveal y={16} className="mb-10 md:mb-12">
                <h2 className="heading-section text-balance">{tm('archive')}</h2>
                <p className="mt-3 max-w-2xl text-pretty text-[15px] leading-relaxed text-ink/60 md:text-base">{tm('archiveSub')}</p>
              </Reveal>
              <div className="grid border-t border-brand/10 md:grid-cols-2 md:gap-x-10 lg:gap-x-14">
                {rows.map((a, i) => (
                  <motion.article key={a.id} {...inView(i)} className="group relative grid grid-cols-1 gap-4 border-b border-brand/10 py-7 sm:grid-cols-[11.5rem_minmax(0,1fr)] sm:items-start sm:gap-5">
                    <CoverFrame article={a} className="aspect-[5/4] w-full sm:aspect-auto sm:h-[8.75rem] sm:w-[11.5rem]" />
                    <div className="min-w-0 flex-1">
                      <When a={a} />
                      <PostTitle a={a} className="mt-2 line-clamp-3 text-base font-semibold leading-snug transition-colors group-hover:text-brand" />
                      {a.excerpt && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink/55">{a.excerpt}</p>}
                      <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                        {t('trends.readMore')}
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" aria-hidden />
                      </span>
                    </div>
                  </motion.article>
                ))}
              </div>
              <LoadMore {...loadMore} label={t('category.loadMore')} />
            </>
          ) : (
            <LoadMore {...loadMore} label={t('category.loadMore')} />
          )}
        </div>
      </section>
      )}
    </>
  );
}