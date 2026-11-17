'use client';
/**
 * /gtc-news/market-daily-updates — dark hero (economic-calendar rhythm) + index rows with full infographic covers.
 */
import { motion } from 'motion/react';
import { ArrowRight, LineChart } from 'lucide-react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import HeroBackdrop from '@/components/shared/HeroBackdrop';
import NavLink from '@/components/shared/nav/NavLink';
import { NewsCover } from '@/components/shared/news/NewsCard';
import { Reveal, EASE } from '@/components/motion';
import { NEWS_PATH } from '@/lib/news-path';
import { cn } from '@/lib/utils';
import { CategoryLinks, Empty, LoadMore, PostTitle, When } from './categoryShared';

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

export default function MarketDailyCategory({ category, categories, articles, t, crumbs, loadMore }) {
  const tm = (key) => t(`marketDaily.${key}`);
  const [lead, ...rest] = articles;
  const rows = lead ? rest : articles;

  return (
    <>
      <section className="is-dark relative overflow-hidden bg-ink pb-16 pt-36 text-white md:pb-24 md:pt-44">
        <HeroBackdrop />
        <motion.span className="absolute -start-24 top-1/3 size-80 rounded-full bg-gold/20 blur-[120px]" animate={{ opacity: [0.35, 0.65, 0.35] }} transition={{ duration: 7, repeat: Infinity }} aria-hidden />
        <div className="container-x relative">
          <Breadcrumb className="lg:justify-start" items={crumbs} />
          <div className="mt-10 grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
            <div className="text-center lg:text-start">
              <motion.span
                className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-4 py-1.5 text-xs font-semibold tracking-wide text-gold-200 ring-1 ring-white/10 backdrop-blur"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="size-1.5 rounded-full bg-gold" />
                {tm('badge')}
              </motion.span>
              <motion.h1 className="heading-page mt-6 text-balance" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.75, ease: EASE }}>
                {category.name}
              </motion.h1>
              <motion.p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/65 md:text-lg lg:mx-0" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.12, duration: 0.6 }}>
                {t('category.description', { category: category.name })}
              </motion.p>
              <NavLink href={NEWS_PATH} className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-200 transition-colors hover:text-white">
                <ArrowRight className="size-4 -scale-x-100 rtl:scale-x-100" aria-hidden />
                {t('category.backToNews')}
              </NavLink>
              <div className="mt-8">
                <CategoryLinks categories={categories} current={category.slug} style="pills" />
              </div>
            </div>

            {lead && (
              <motion.article
                className="group relative overflow-hidden rounded-[2rem] bg-white/[0.06] p-3 ring-1 ring-white/10 backdrop-blur-xl transition-colors hover:bg-white/[0.1] hover:ring-gold/30"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
              >
                <motion.span className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gold/15 blur-2xl" animate={{ opacity: [0.25, 0.5, 0.25] }} transition={{ duration: 5, repeat: Infinity }} aria-hidden />
                <div className="grid gap-4 sm:grid-cols-[minmax(0,42%)_1fr] sm:items-stretch">
                  <CoverFrame article={lead} className="min-h-[168px] sm:min-h-[200px]" />
                  <div className="flex flex-col justify-center px-2 py-3 sm:pe-2">
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-gold-200">
                      <LineChart className="size-3.5" aria-hidden />
                      {t('hero.latest')}
                    </span>
                    <PostTitle a={lead} as="h2" className="heading-card mt-3 line-clamp-3 text-white transition-colors group-hover:text-gold-100" />
                    <When a={lead} className="mt-3 text-white/55" />
                    {lead.excerpt && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/60">{lead.excerpt}</p>}
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold-200">
                      {t('trends.readMore')}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" aria-hidden />
                    </span>
                  </div>
                </div>
              </motion.article>
            )}
          </div>
        </div>
      </section>

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
    </>
  );
}