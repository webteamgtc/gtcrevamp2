'use client';
/**
 * /gtc-news/market-daily-updates — HERO drafts (section by section review; the rest of the page is the live layout).
 * Switch with the draft bar or ?dailyHero=h1|h2|h3 ("now" = the live hero). Covers are infographics: always shown whole.
 *  H1 · Date board — a big calendar tile with the newest update's day (flips in), "updated every trading day",
 *       and the newest infographic in front of the two before it, peeking out behind.
 *  H2 · Chart sweep — a market line that draws itself across the whole hero behind a centred title, with the
 *       newest update as a wide glass card underneath.
 *  H3 · This week — the last five updates as day tabs; choosing a day (or waiting) shows that infographic in a
 *       large frame with its headline.
 */
import { useEffect, useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, LineChart } from 'lucide-react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import HeroBackdrop from '@/components/shared/HeroBackdrop';
import NavLink from '@/components/shared/nav/NavLink';
import { NewsCover } from '@/components/shared/news/NewsCard';
import { EASE } from '@/components/motion';
import { intlLocale } from '@/i18n/locales';
import { cn } from '@/lib/utils';
import { CategoryLinks, PostTitle, When } from './categoryShared';

function useParts() {
  const locale = useLocale();
  return useMemo(() => {
    const loc = intlLocale(locale);
    const f = (o) => new Intl.DateTimeFormat(loc, { timeZone: 'UTC', ...o });
    const day = f({ day: 'numeric' }), month = f({ month: 'long' }), wd = f({ weekday: 'long' }), wds = f({ weekday: 'short' }), year = f({ year: 'numeric' });
    return (iso) => {
      const d = iso ? new Date(iso) : null;
      if (!d || Number.isNaN(+d)) return null;
      return { day: day.format(d), month: month.format(d), weekday: wd.format(d), wdShort: wds.format(d), year: year.format(d) };
    };
  }, [locale]);
}

function Infographic({ article, className }) {
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

function Badge({ t }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-4 py-1.5 text-xs font-semibold text-gold-200 ring-1 ring-white/10 backdrop-blur">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-up opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-up" />
      </span>
      {t('marketDaily.badge')}
    </span>
  );
}

/* ------------------------------------------------------------ H1 · Date board */

function DateBoard({ category, categories, articles, t, crumbs }) {
  const parts = useParts();
  const [lead, b, c] = articles;
  const p = lead && parts(lead.publishedAt);
  return (
    <Shell>
      <motion.span className="absolute -start-24 top-1/3 size-96 rounded-full bg-gold/20 blur-[130px]" animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 7, repeat: Infinity }} aria-hidden />
      <div className="container-x relative">
        <Breadcrumb className="lg:justify-start" items={crumbs} />
        <div className="mt-10 grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="text-center lg:text-start">
            <Badge t={t} />
            <motion.h1 className="heading-page mt-6 text-balance" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.75, ease: EASE }}>
              {category.name}
            </motion.h1>
            <p className="mx-auto mt-5 max-w-xl text-white/65 md:text-lg lg:mx-0">{t('category.description', { category: category.name })}</p>

            {p && (
              <div className="mx-auto mt-8 flex w-fit items-center gap-5 lg:mx-0" style={{ perspective: 800 }}>
                <motion.div className="grid w-28 overflow-hidden rounded-3xl bg-white text-center text-ink shadow-2xl shadow-black/40" initial={{ rotateX: -90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} transition={{ duration: 0.9, ease: EASE, delay: 0.3 }} style={{ transformOrigin: 'top' }}>
                  <span className="bg-gradient-to-r from-gold-300 to-gold py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white">{p.month}</span>
                  <span className="py-2 text-5xl font-extrabold leading-none tracking-tight">{p.day}</span>
                  <span className="pb-2 text-[11px] font-semibold uppercase text-ink/50">{p.weekday}</span>
                </motion.div>
                <div className="text-start">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold-200">{t('hero.latest')}</p>
                  <PostTitle a={lead} as="h2" className="mt-2 line-clamp-2 max-w-xs font-semibold text-white" />
                </div>
              </div>
            )}
            <div className="mt-8">
              <CategoryLinks categories={categories} current={category.slug} style="pills" />
            </div>
          </div>

          {lead && (
            <div className="relative mx-auto aspect-square w-full max-w-md">
              {[c, b].filter(Boolean).map((a, i) => (
                <motion.div key={a.id} className="absolute inset-0 overflow-hidden rounded-[2rem] opacity-60 ring-1 ring-white/10" initial={{ rotate: 0, x: 0 }} animate={{ rotate: i === 0 ? -9 : 6, x: i === 0 ? -34 : 26, y: i === 0 ? 14 : 6 }} transition={{ duration: 1, ease: EASE, delay: 0.4 + i * 0.1 }} aria-hidden>
                  <Infographic article={a} className="size-full" />
                </motion.div>
              ))}
              <motion.article className="group absolute inset-0 overflow-hidden rounded-[2rem] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.85)] ring-1 ring-white/25" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: [0, -8, 0] }} transition={{ opacity: { duration: 0.7 }, y: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }}>
                <Infographic article={lead} className="size-full transition-transform duration-500 group-hover:scale-[1.03]" />
                <NavLink href={lead.href} className="absolute inset-0" aria-label={lead.title} />
              </motion.article>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}

/* ------------------------------------------------------------ H2 · Chart sweep */

const LINE = 'M0 300 C 80 280, 120 200, 200 220 S 320 330, 400 260 S 520 120, 600 170 S 720 260, 800 190 S 940 60, 1000 110 S 1120 200, 1200 140 S 1340 40, 1440 70';

function ChartSweep({ category, categories, articles, t, crumbs }) {
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
          <Badge t={t} />
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
            <Infographic article={lead} className="aspect-square rounded-[1.5rem]" />
            <div className="p-3 sm:p-4 md:pe-8">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-gold-200">
                <LineChart className="size-3.5" aria-hidden /> {t('hero.latest')}
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

/* ------------------------------------------------------------ H3 · This week */

const DAY_MS = 6000;

function ThisWeek({ category, categories, articles, t, crumbs }) {
  const parts = useParts();
  const days = articles.slice(0, 5);
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  const a = days[i];

  useEffect(() => {
    if (hold || days.length < 2) return;
    const id = setTimeout(() => setI((x) => (x + 1) % days.length), DAY_MS);
    return () => clearTimeout(id);
  }, [i, hold, days.length]);

  return (
    <Shell>
      <div className="container-x relative">
        <Breadcrumb className="lg:justify-start" items={crumbs} />
        <div className="mt-10 grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <div className="text-center lg:text-start">
            <Badge t={t} />
            <motion.h1 className="heading-page mt-6 text-balance" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.75, ease: EASE }}>
              {category.name}
            </motion.h1>
            <p className="mx-auto mt-5 max-w-xl text-white/65 md:text-lg lg:mx-0">{t('category.description', { category: category.name })}</p>

            {/* day tabs */}
            {days.length > 1 && (
              <div className="mx-auto mt-8 grid max-w-md grid-cols-5 gap-2 lg:mx-0" role="tablist" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}>
                {days.map((d, k) => {
                  const q = parts(d.publishedAt);
                  const on = k === i;
                  return (
                    <button key={d.id} type="button" role="tab" aria-selected={on} onClick={() => setI(k)} className={cn('relative overflow-hidden rounded-2xl px-1 py-3 text-center transition-colors', on ? 'bg-white text-ink' : 'bg-white/[0.06] text-white/70 ring-1 ring-white/10 hover:bg-white/[0.12]')}>
                      <span className="block text-[11px] font-bold uppercase tracking-wide opacity-60">{q?.wdShort}</span>
                      <span className="block text-2xl font-extrabold leading-tight">{q?.day}</span>
                      {on && <motion.span key={`${d.id}-${hold}`} className="absolute inset-x-2 bottom-1 h-0.5 origin-left rounded-full bg-gold rtl:origin-right" initial={{ scaleX: 0 }} animate={{ scaleX: hold ? 1 : 1 }} transition={{ duration: hold ? 0.2 : DAY_MS / 1000, ease: 'linear' }} />}
                    </button>
                  );
                })}
              </div>
            )}
            <div className="mt-8">
              <CategoryLinks categories={categories} current={category.slug} style="pills" />
            </div>
          </div>

          {a && (
            <div className="relative">
              <span className="absolute -inset-6 rounded-[3rem] bg-gold/10 blur-2xl" aria-hidden />
              <div className="relative overflow-hidden rounded-[2.25rem] bg-white/[0.06] p-3 ring-1 ring-white/15 backdrop-blur-xl">
                <AnimatePresence mode="wait">
                  <motion.article key={a.id} className="group relative" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.45, ease: EASE }}>
                    <Infographic article={a} className="aspect-square rounded-[1.6rem] sm:aspect-[4/3]" />
                    <div className="flex items-center justify-between gap-4 px-3 pb-2 pt-4">
                      <div className="min-w-0">
                        <When a={a} className="text-white/55" />
                        <PostTitle a={a} as="h2" className="mt-1 line-clamp-1 font-semibold text-white" />
                      </div>
                      <ArrowRight className="size-9 shrink-0 rounded-full bg-gold p-2 text-white transition-transform group-hover:translate-x-1 rtl:-scale-x-100" aria-hidden />
                    </div>
                  </motion.article>
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}

export const DAILY_HERO_LABELS = { now: 'Live hero', h1: 'H1 · Date board', h2: 'H2 · Chart sweep', h3: 'H3 · This week' };

export default function MarketDailyHero({ variant, ...props }) {
  if (variant === 'h1') return <DateBoard {...props} />;
  if (variant === 'h2') return <ChartSweep {...props} />;
  return <ThisWeek {...props} />;
}
