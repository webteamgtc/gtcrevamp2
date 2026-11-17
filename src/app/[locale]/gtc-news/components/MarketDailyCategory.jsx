'use client';
/**
 * /gtc-news/market-daily-updates — dedicated layout: dark market hero, featured lead, brief cards grid.
 */
import { motion } from 'motion/react';
import { ArrowRight, LineChart, TrendingUp } from 'lucide-react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import HeroBackdrop from '@/components/shared/HeroBackdrop';
import NavLink from '@/components/shared/nav/NavLink';
import NewsCard, { NewsCover } from '@/components/shared/news/NewsCard';
import { Reveal, EASE } from '@/components/motion';
import { NEWS_PATH } from '@/lib/news-path';
import { CategoryLinks, Empty, LoadMore, PostTitle, When } from './categoryShared';

const inView = (i = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.45, ease: EASE, delay: (i % 3) * 0.07 }
});

export default function MarketDailyCategory({ category, categories, articles, t, crumbs, loadMore }) {
  const tm = (key) => t(`marketDaily.${key}`);
  const [lead, ...rest] = articles;

  return (
    <>
      <section className="is-dark relative overflow-hidden pb-8 pt-36 md:pb-12 md:pt-44">
        <HeroBackdrop />
        <motion.span
          className="absolute -start-20 top-1/4 size-72 rounded-full bg-gold/20 blur-[100px]"
          animate={{ opacity: [0.4, 0.75, 0.4] }}
          transition={{ duration: 7, repeat: Infinity }}
          aria-hidden
        />
        <div className="container-x relative">
          <Breadcrumb className="lg:justify-start" items={crumbs} />
          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-end lg:gap-14">
            <div className="text-center lg:text-start">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-gold-200 ring-1 ring-white/15">
                <TrendingUp className="size-3.5" aria-hidden />
                {tm('eyebrow')}
              </span>
              <div className="mt-6 flex items-center justify-center gap-4 lg:justify-start">
                <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-gold/90 to-gold-600 text-white shadow-lg shadow-gold/30 ring-2 ring-white/20">
                  <LineChart className="size-7" aria-hidden />
                </span>
                <motion.h1 className="heading-page" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.65, ease: EASE }}>
                  {category.name}
                </motion.h1>
              </div>
              <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/65 md:text-lg lg:mx-0">
                {t('category.description', { category: category.name })}
              </p>
              <NavLink
                href={NEWS_PATH}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-200 transition-colors hover:text-white"
              >
                <ArrowRight className="size-4 -scale-x-100 rtl:scale-x-100" aria-hidden />
                {t('category.backToNews')}
              </NavLink>
              <div className="mt-8">
                <CategoryLinks categories={categories} current={category.slug} style="pills" />
              </div>
            </div>

            {lead && (
              <motion.article
                className="group relative overflow-hidden rounded-[1.75rem] bg-white/[0.07] p-2 ring-1 ring-white/15 backdrop-blur-xl transition-colors hover:bg-white/[0.11] hover:ring-gold/35"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
              >
                <div className="grid gap-4 sm:grid-cols-[42%_1fr] sm:items-stretch">
                  <div className="relative min-h-[180px] overflow-hidden rounded-[1.35rem] sm:min-h-[220px]">
                    <NewsCover article={lead} showTitle={false} />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" aria-hidden />
                  </div>
                  <div className="flex flex-col justify-center px-3 py-4 sm:pe-4">
                    <span className="heading-label text-gold-200">{tm('featured')}</span>
                    <PostTitle a={lead} as="h2" className="heading-card mt-2 line-clamp-3 text-white transition-colors group-hover:text-gold-100" />
                    <When a={lead} className="mt-3 text-white/55" />
                    {lead.excerpt && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/60">{lead.excerpt}</p>}
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold-200">
                      {tm('readUpdate')}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" aria-hidden />
                    </span>
                  </div>
                </div>
              </motion.article>
            )}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#eef0f5] py-14 md:py-20">
        <div className="bg-grid-light mask-radial absolute inset-0 opacity-55" aria-hidden />
        <div className="container-x relative">
          {!articles.length ? (
            <Empty t={t} />
          ) : (
            <>
              <Reveal y={16} className="mb-10 text-center md:mb-12">
                <h2 className="heading-section">
                  <span className="text-brand">{tm('allUpdates')}</span>
                </h2>
              </Reveal>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {(lead ? rest : articles).map((a, i) => (
                  <motion.div key={a.id} className="h-full" {...inView(i)}>
                    <NewsCard article={a} variant="brief" showCategory={false} readLabel={tm('readUpdate')} />
                  </motion.div>
                ))}
              </div>
              <LoadMore {...loadMore} label={t('category.loadMore')} />
            </>
          )}
        </div>
      </section>
    </>
  );
}