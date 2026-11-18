'use client';
/**
 * "Chart sweep" hero (chosen 18 Nov 2026) for /gtc-news/market-daily-updates and /gtc-news/company-news: a market line
 * draws itself across the hero behind the centred title, and the newest post sits underneath as a wide glass card.
 * ns: text namespace ('marketDaily' | 'companyNews'); fit: 'contain' (infographic shown whole) or 'cover' (photo).
 */
import { motion } from 'motion/react';
import { ArrowRight, Building2, LineChart } from 'lucide-react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import HeroBackdrop from '@/components/shared/HeroBackdrop';
import { NewsCover } from '@/components/shared/news/NewsCard';
import { EASE } from '@/components/motion';
import { cn } from '@/lib/utils';
import { CategoryLinks, PostTitle, When } from './categoryShared';

function Infographic({ article, className, fit = 'contain' }) {
  // photos fill the frame (the frame sets the size); infographics are shown whole on white
  if (fit === 'cover')
    return (
      <div className={cn('relative overflow-hidden bg-[#eef0f5]', className)}>
        <div className="absolute inset-0">
          <NewsCover article={article} showTitle={false} />
        </div>
      </div>
    );
  return (
    <div className={cn('flex items-center justify-center overflow-hidden bg-white', className)}>
      <NewsCover article={article} showTitle={false} fit="contain" />
    </div>
  );
}

function Shell({ children, className }) {
  return (
    <section className={cn('is-dark relative overflow-hidden bg-ink pb-16 pt-36 text-white md:pb-24 md:pt-44', className)}>
      <HeroBackdrop />
      {children}
    </section>
  );
}

function Badge({ t, ns }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-4 py-1.5 text-xs font-semibold text-gold-200 ring-1 ring-white/10 backdrop-blur">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-up opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-up" />
      </span>
      {t(`${ns}.badge`)}
    </span>
  );
}

const LINE = 'M0 300 C 80 280, 120 200, 200 220 S 320 330, 400 260 S 520 120, 600 170 S 720 260, 800 190 S 940 60, 1000 110 S 1120 200, 1200 140 S 1340 40, 1440 70';

function ChartSweep({ category, categories, articles, t, crumbs, ns = 'marketDaily', fit = 'contain' }) {
  const Icon = ns === 'companyNews' ? Building2 : LineChart;
  const lead = articles[0];
  return (
    <Shell>
      {/* the market line drawing across the hero */}
      <svg className="pointer-events-none absolute inset-x-0 top-28 h-[420px] w-full opacity-40 md:top-24 md:opacity-80" viewBox="0 0 1440 400" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id="mdh-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d2a67a" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#d2a67a" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="mdh-stroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5b6ed2" />
            <stop offset="100%" stopColor="#f1e3d3" />
          </linearGradient>
        </defs>
        {[100, 200, 300].map((y) => (
          <line key={y} x1="0" x2="1440" y1={y} y2={y} stroke="white" strokeOpacity="0.06" strokeDasharray="4 8" />
        ))}
        <motion.path d={`${LINE} L 1440 400 L 0 400 Z`} fill="url(#mdh-fill)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 1.2 }} />
        <motion.path d={LINE} fill="none" stroke="url(#mdh-stroke)" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.4, ease: 'easeInOut' }} />
        <motion.circle r="7" fill="#f1e3d3" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.4, 1] }} transition={{ delay: 2.3, duration: 2, repeat: Infinity }} cx="1440" cy="70" />
      </svg>

      <div className="container-x relative">
        <Breadcrumb className="justify-center" items={crumbs} />
        <div className="mx-auto mt-10 max-w-3xl text-center">
          <Badge t={t} ns={ns} />
          <motion.h1 className="heading-page mt-6 text-balance" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.75, ease: EASE }}>
            {category.name}
          </motion.h1>
          <p className="mx-auto mt-5 max-w-xl text-white/65 md:text-lg">{t('category.description', { category: category.name })}</p>
          <div className="mt-8 flex justify-center">
            <CategoryLinks categories={categories} current={category.slug} style="pills" />
          </div>
        </div>

        {lead && (
          <motion.article className="group relative mx-auto mt-12 grid max-w-4xl items-center gap-5 overflow-hidden rounded-[2rem] bg-white/[0.07] p-3 ring-1 ring-white/15 backdrop-blur-xl transition-colors hover:bg-white/[0.1] hover:ring-gold/40 sm:grid-cols-[13rem_1fr] md:grid-cols-[16rem_1fr]" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}>
            <Infographic article={lead} fit={fit} className={cn('rounded-[1.5rem]', fit === 'cover' ? 'aspect-[4/3] w-full sm:aspect-auto sm:h-full sm:min-h-[13rem] sm:self-stretch' : 'aspect-square')} />
            <div className="p-3 sm:p-4 md:pe-8">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-gold-200">
                <Icon className="size-3.5" aria-hidden /> {t('hero.latest')}
              </span>
              <PostTitle a={lead} as="h2" className="heading-card mt-3 line-clamp-3 text-white" />
              {lead.excerpt && <p className="mt-3 line-clamp-2 text-sm text-white/60">{lead.excerpt}</p>}
              <div className="mt-4 flex items-center gap-5">
                <When a={lead} className="text-white/55" />
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-gold-200">
                  {t('trends.readMore')} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100" aria-hidden />
                </span>
              </div>
            </div>
          </motion.article>
        )}
      </div>
    </Shell>
  );
}

export default ChartSweep;
