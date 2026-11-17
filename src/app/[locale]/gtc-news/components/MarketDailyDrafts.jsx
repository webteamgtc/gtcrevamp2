'use client';
/**
 * /gtc-news/market-daily-updates — DRAFTS for review (switch with the draft bar or ?daily=d1|d2|d3; "now" is the
 * live layout, MarketDailyCategory.jsx). The posts are infographics, so covers are always shown whole (fit contain).
 *  D1 · Briefing desk — dark hero with today's date block and the newest infographic in a floating tablet frame,
 *       a ticker of recent headlines, then a 4-column wall of infographic tiles with date badges.
 *  D2 · Week board — light hero with the newest update, then the archive laid out week by week (Mon–Fri columns),
 *       so the daily rhythm is visible and a missing day shows as an empty slot.
 *  D3 · Gallery + viewer — dark gallery of infographics; a click opens a full-size viewer with previous / next,
 *       keyboard and swipe, and a link to the full update.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Expand, LineChart, X } from 'lucide-react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import HeroBackdrop from '@/components/shared/HeroBackdrop';
import NavLink from '@/components/shared/nav/NavLink';
import { NewsCover } from '@/components/shared/news/NewsCard';
import { Marquee, Reveal, EASE } from '@/components/motion';
import { intlLocale } from '@/i18n/locales';
import { cn } from '@/lib/utils';
import { CategoryLinks, Empty, LoadMore, PostTitle, When } from './categoryShared';

const inView = (i = 0) => ({ initial: { opacity: 0, y: 22 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.12 }, transition: { duration: 0.5, ease: EASE, delay: (i % 4) * 0.06 } });

/** Day / weekday / month parts of a post date in the page language. */
function useDateParts() {
  const locale = useLocale();
  return useMemo(() => {
    const loc = intlLocale(locale);
    const day = new Intl.DateTimeFormat(loc, { day: 'numeric', timeZone: 'UTC' });
    const wd = new Intl.DateTimeFormat(loc, { weekday: 'long', timeZone: 'UTC' });
    const wdShort = new Intl.DateTimeFormat(loc, { weekday: 'short', timeZone: 'UTC' });
    const mon = new Intl.DateTimeFormat(loc, { month: 'short', timeZone: 'UTC' });
    const monYear = new Intl.DateTimeFormat(loc, { month: 'long', year: 'numeric', timeZone: 'UTC' });
    const dm = new Intl.DateTimeFormat(loc, { day: 'numeric', month: 'short', timeZone: 'UTC' });
    return (iso) => {
      const d = iso ? new Date(iso) : null;
      if (!d || Number.isNaN(+d)) return null;
      return { d, day: day.format(d), weekday: wd.format(d), wdShort: wdShort.format(d), month: mon.format(d), monthYear: monYear.format(d), dayMonth: dm.format(d) };
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

/* ------------------------------------------------------------ D1 · Briefing desk */

function Briefing({ category, categories, articles, t, crumbs, loadMore }) {
  const parts = useDateParts();
  const [lead, ...rest] = articles;
  const p = lead && parts(lead.publishedAt);
  return (
    <>
      <section className="is-dark relative overflow-hidden bg-ink pb-14 pt-36 text-white md:pb-20 md:pt-44">
        <HeroBackdrop />
        <motion.span className="absolute -end-24 top-1/4 size-96 rounded-full bg-gold/20 blur-[130px]" animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 7, repeat: Infinity }} aria-hidden />
        <div className="container-x relative">
          <Breadcrumb className="lg:justify-start" items={crumbs} />
          <div className="mt-10 grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="text-center lg:text-start">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-4 py-1.5 text-xs font-semibold text-gold-200 ring-1 ring-white/10">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-up opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-up" />
                </span>
                {t('marketDaily.badge')}
              </span>
              <motion.h1 className="heading-page mt-6 text-balance" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.75, ease: EASE }}>
                {category.name}
              </motion.h1>
              <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/65 md:text-lg lg:mx-0">{t('category.description', { category: category.name })}</p>

              {lead && p && (
                <motion.div className="mx-auto mt-8 flex max-w-md items-center gap-5 rounded-3xl bg-white/[0.06] p-4 text-start ring-1 ring-white/10 backdrop-blur lg:mx-0" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6, ease: EASE }}>
                  <span className="grid w-20 shrink-0 overflow-hidden rounded-2xl bg-white text-center text-ink shadow-xl">
                    <span className="bg-gold py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white">{p.month}</span>
                    <span className="py-1.5 text-3xl font-extrabold leading-none tracking-tight">{p.day}</span>
                    <span className="pb-1.5 text-[10px] font-semibold uppercase text-ink/50">{p.wdShort}</span>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-bold uppercase tracking-[0.16em] text-gold-200">{t('drafts.todaysBrief')}</span>
                    <span className="mt-1 line-clamp-2 block font-semibold">{lead.title}</span>
                  </span>
                </motion.div>
              )}
              <div className="mt-8">
                <CategoryLinks categories={categories} current={category.slug} style="pills" />
              </div>
            </div>

            {lead && (
              <motion.div className="relative mx-auto w-full max-w-lg" initial={{ opacity: 0, y: 40, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}>
                <motion.article className="group relative rounded-[2.25rem] bg-gradient-to-b from-white/25 to-white/5 p-3 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/20" animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
                  <Infographic article={lead} className="aspect-square rounded-[1.6rem]" />
                  <div className="flex items-center justify-between gap-3 px-3 pb-1 pt-4">
                    <PostTitle a={lead} as="h2" className="line-clamp-1 text-sm font-semibold text-white" />
                    <ArrowRight className="size-5 shrink-0 text-gold-200 transition-transform group-hover:translate-x-1 rtl:-scale-x-100" aria-hidden />
                  </div>
                </motion.article>
              </motion.div>
            )}
          </div>
        </div>
        {/* headline ticker */}
        {rest.length > 2 && (
          <div className="relative mt-14 border-y border-white/10 bg-white/[0.03] py-3">
            <Marquee duration={45} gap="3rem" className="mask-fade-x text-sm text-white/70">
              {rest.slice(0, 10).map((a) => (
                <NavLink key={a.id} href={a.href} className="flex items-center gap-3 whitespace-nowrap hover:text-white">
                  <span className="rounded bg-gold/20 px-1.5 py-0.5 text-[11px] font-bold text-gold-200">{parts(a.publishedAt)?.dayMonth}</span>
                  {a.title}
                </NavLink>
              ))}
            </Marquee>
          </div>
        )}
      </section>

      <section className="relative overflow-clip bg-[#f6f7fb] py-14 md:py-24">
        <div className="bg-grid-light mask-radial absolute inset-0 opacity-60" aria-hidden />
        <div className="container-x relative">
          {!articles.length ? (
            <Empty t={t} />
          ) : (
            <>
              <Reveal y={16} className="mb-10">
                <h2 className="heading-section">{t('marketDaily.archive')}</h2>
                <p className="mt-3 max-w-2xl text-ink/60">{t('marketDaily.archiveSub')}</p>
              </Reveal>
              <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
                {rest.map((a, i) => {
                  const q = parts(a.publishedAt);
                  return (
                    <motion.article key={a.id} {...inView(i)} className="group relative flex flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-sm ring-1 ring-brand/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-brand/15">
                      <div className="overflow-hidden">
                        <Infographic article={a} className="aspect-square transition-transform duration-500 group-hover:scale-[1.04]" />
                      </div>
                      <div className="flex flex-1 gap-3 p-4">
                        {q && (
                          <span className="grid h-fit w-11 shrink-0 overflow-hidden rounded-xl bg-white text-center ring-1 ring-brand/15">
                            <span className="bg-brand py-0.5 text-[9px] font-bold uppercase text-white">{q.month}</span>
                            <span className="py-1 text-base font-extrabold leading-none">{q.day}</span>
                          </span>
                        )}
                        <span className="min-w-0">
                          <PostTitle a={a} className="line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-brand" />
                          <span className="mt-1 block text-xs text-ink/45">{q?.weekday}</span>
                        </span>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
              <LoadMore {...loadMore} label={t('category.loadMore')} />
            </>
          )}
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------ D2 · Week board */

const DAY = 86400000;
/** Monday 00:00 UTC of the post's week */
const weekStart = (d) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - ((d.getUTCDay() + 6) % 7) * DAY);

function WeekBoard({ category, categories, articles, t, crumbs, loadMore }) {
  const parts = useDateParts();
  const [lead, ...rest] = articles;
  const weeks = useMemo(() => {
    const map = new Map();
    for (const a of articles) {
      const p = parts(a.publishedAt);
      if (!p) continue;
      const ws = +weekStart(p.d);
      if (!map.has(ws)) map.set(ws, Array(7).fill(null));
      const idx = (p.d.getUTCDay() + 6) % 7;
      if (!map.get(ws)[idx]) map.get(ws)[idx] = a;
    }
    // Mon–Fri; Saturday and Sunday appear only in a week that has a weekend update
    return [...map.entries()].sort((x, y) => y[0] - x[0]).map(([ws, days]) => ({ ws, days: days[5] || days[6] ? days : days.slice(0, 5) }));
  }, [articles, parts]);
  const lp = lead && parts(lead.publishedAt);

  return (
    <>
      <section className="relative overflow-hidden bg-white pb-12 pt-36 md:pt-44">
        <div className="bg-grid-light mask-radial absolute inset-0 opacity-50" aria-hidden />
        <span className="absolute -start-40 top-20 size-[420px] rounded-full bg-brand/10 blur-[120px]" aria-hidden />
        <div className="container-x relative">
          <Breadcrumb tone="light" className="lg:justify-start" items={crumbs} />
          <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <span className="heading-label inline-flex items-center gap-2">
                <LineChart className="size-4" aria-hidden /> {t('marketDaily.badge')}
              </span>
              <motion.h1 className="heading-page mt-4" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.75, ease: EASE }}>
                {category.name}
              </motion.h1>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink/60">{t('category.description', { category: category.name })}</p>
              <div className="mt-8">
                <CategoryLinks categories={categories} current={category.slug} style="underline" />
              </div>
            </div>
            {lead && (
              <motion.article className="is-dark group relative grid overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-700 to-brand-950 p-3 text-white shadow-[0_40px_80px_-40px_rgba(41,59,147,0.7)] sm:grid-cols-[1fr_1fr]" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}>
                <Infographic article={lead} className="aspect-square rounded-[1.5rem]" />
                <div className="flex flex-col justify-center p-5">
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-gold-200">{t('hero.latest')}</span>
                  {lp && <span className="mt-2 text-4xl font-extrabold tracking-tight">{lp.dayMonth}</span>}
                  {lp && <span className="text-sm text-white/55">{lp.weekday}</span>}
                  <PostTitle a={lead} as="h2" className="mt-4 line-clamp-3 font-semibold text-white" />
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold-200">
                    {t('trends.readMore')} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100" aria-hidden />
                  </span>
                </div>
              </motion.article>
            )}
          </div>
        </div>
      </section>

      <section className="relative bg-[#f6f7fb] py-14 md:py-20">
        <div className="container-x">
          {!articles.length ? (
            <Empty t={t} />
          ) : (
            <>
              <Reveal y={16} className="mb-8">
                <h2 className="heading-section">{t('marketDaily.archive')}</h2>
              </Reveal>
              <div className="grid gap-8">
                {weeks.map(({ ws, days }, w) => {
                  const from = parts(new Date(ws).toISOString());
                  const to = parts(new Date(ws + (days.length - 1) * DAY).toISOString());
                  return (
                    <motion.div key={ws} {...inView(w)} className="rounded-[1.75rem] bg-white p-4 shadow-sm ring-1 ring-brand/10 md:p-5">
                      <div className="mb-4 flex items-center gap-3 px-1">
                        <CalendarDays className="size-4 text-gold" aria-hidden />
                        <span className="text-sm font-bold text-ink">
                          {from?.dayMonth} – {to?.dayMonth}
                        </span>
                        <span className="h-px flex-1 bg-brand/10" />
                        <span className="text-xs font-semibold text-ink/40">{t('drafts.updatesCount', { count: days.filter(Boolean).length })}</span>
                      </div>
                      <div className={cn('no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 md:mx-0 md:grid md:px-0', days.length === 7 ? 'md:grid-cols-7' : 'md:grid-cols-5')}>
                        {days.map((a, k) => {
                          const dayIso = new Date(ws + k * DAY).toISOString();
                          const dp = parts(dayIso);
                          return (
                            <div key={k} className="w-40 shrink-0 md:w-auto">
                              <p className="mb-2 flex items-baseline justify-between px-1 text-xs">
                                <span className="font-bold uppercase tracking-wide text-ink/60">{dp?.wdShort}</span>
                                <span className="text-ink/40">{dp?.day}</span>
                              </p>
                              {a ? (
                                <article className="group relative overflow-hidden rounded-2xl ring-1 ring-brand/10 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/15 hover:ring-gold/50">
                                  <Infographic article={a} className="aspect-square" />
                                  <div className="border-t border-brand/5 p-3">
                                    <PostTitle a={a} className="line-clamp-2 text-xs font-semibold leading-snug transition-colors group-hover:text-brand" />
                                  </div>
                                </article>
                              ) : (
                                <div className="grid aspect-square place-items-center rounded-2xl border-2 border-dashed border-brand/10 text-xs text-ink/30">{t('drafts.noUpdate')}</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <LoadMore {...loadMore} label={t('category.loadMore')} />
            </>
          )}
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------ D3 · Gallery + viewer */

function Viewer({ items, index, onClose, onGo, t }) {
  const parts = useDateParts();
  const a = items[index];
  const [dir, setDir] = useState(1);
  const go = useCallback(
    (d) => {
      setDir(d);
      onGo((index + d + items.length) % items.length);
    },
    [index, items.length, onGo]
  );
  useEffect(() => {
    const key = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(document.dir === 'rtl' ? -1 : 1);
      if (e.key === 'ArrowLeft') go(document.dir === 'rtl' ? 1 : -1);
    };
    document.addEventListener('keydown', key);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', key);
      document.body.style.overflow = prev;
    };
  }, [go, onClose]);
  const p = parts(a.publishedAt);

  return (
    <motion.div className="fixed inset-0 z-[80] flex flex-col bg-ink/95 text-white backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label={a.title}>
      <div className="container-x flex items-center justify-between gap-4 py-4">
        <span className="text-sm text-white/60">
          {index + 1} / {items.length}
        </span>
        <button type="button" onClick={onClose} aria-label={t('drafts.close')} className="grid size-11 place-items-center rounded-full bg-white/10 ring-1 ring-white/15 hover:bg-white/20">
          <X className="size-5" />
        </button>
      </div>
      <div className="container-x grid min-h-0 flex-1 items-center gap-6 pb-6 lg:grid-cols-[auto_minmax(0,1fr)_minmax(0,22rem)_auto]">
        <button type="button" onClick={() => go(-1)} aria-label={t('article.prev')} className="hidden size-12 place-items-center rounded-full bg-white/10 ring-1 ring-white/15 hover:bg-white/20 lg:grid">
          <ChevronLeft className="size-6 rtl:-scale-x-100" />
        </button>
        <div className="relative flex h-full min-h-[45vh] items-center justify-center">
          <AnimatePresence mode="popLayout" custom={dir} initial={false}>
            <motion.div
              key={a.id}
              custom={dir}
              className="h-full max-h-[72vh] w-full"
              variants={{ enter: (d) => ({ opacity: 0, x: d * 60, scale: 0.96 }), center: { opacity: 1, x: 0, scale: 1 }, exit: (d) => ({ opacity: 0, x: d * -60, scale: 0.96 }) }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: EASE }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => Math.abs(info.offset.x) > 80 && go(info.offset.x < 0 ? 1 : -1)}
            >
              <Infographic article={a} className="size-full rounded-3xl" />
            </motion.div>
          </AnimatePresence>
        </div>
        <div>
          {p && <span className="text-xs font-bold uppercase tracking-[0.16em] text-gold-200">{p.weekday} · {p.dayMonth}</span>}
          <h2 className="heading-card mt-3 text-white">{a.title}</h2>
          {a.excerpt && <p className="mt-3 line-clamp-5 text-sm leading-relaxed text-white/65">{a.excerpt}</p>}
          <NavLink href={a.href} className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-gold pe-2 ps-6 text-sm font-semibold text-white hover:bg-gold-600">
            {t('drafts.openFull')}
            <span className="grid size-8 place-items-center rounded-full bg-white text-gold-700">
              <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden />
            </span>
          </NavLink>
          <div className="mt-6 flex gap-2 lg:hidden">
            <button type="button" onClick={() => go(-1)} className="grid size-11 place-items-center rounded-full bg-white/10 ring-1 ring-white/15" aria-label={t('article.prev')}>
              <ArrowLeft className="size-5 rtl:-scale-x-100" />
            </button>
            <button type="button" onClick={() => go(1)} className="grid size-11 place-items-center rounded-full bg-white/10 ring-1 ring-white/15" aria-label={t('article.next')}>
              <ArrowRight className="size-5 rtl:-scale-x-100" />
            </button>
          </div>
        </div>
        <button type="button" onClick={() => go(1)} aria-label={t('article.next')} className="hidden size-12 place-items-center rounded-full bg-white/10 ring-1 ring-white/15 hover:bg-white/20 lg:grid">
          <ChevronRight className="size-6 rtl:-scale-x-100" />
        </button>
      </div>
    </motion.div>
  );
}

function Gallery({ category, categories, articles, t, crumbs, loadMore }) {
  const parts = useDateParts();
  const [open, setOpen] = useState(null);
  const [lead, ...rest] = articles;

  return (
    <>
      <section className="is-dark relative overflow-hidden bg-ink pb-16 pt-36 text-white md:pb-20 md:pt-44">
        <HeroBackdrop />
        <div className="container-x relative">
          <Breadcrumb className="lg:justify-start" items={crumbs} />
          <div className="mt-10 grid items-end gap-10 lg:grid-cols-[1fr_auto]">
            <div className="text-center lg:text-start">
              <span className="heading-label">{t('marketDaily.badge')}</span>
              <motion.h1 className="heading-page mt-4" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.75, ease: EASE }}>
                {category.name}
              </motion.h1>
              <p className="mx-auto mt-4 max-w-xl text-white/65 md:text-lg lg:mx-0">{t('marketDaily.archiveSub')}</p>
            </div>
            <CategoryLinks categories={categories} current={category.slug} style="pills" />
          </div>

          {lead && (
            <motion.button type="button" onClick={() => setOpen(0)} className="group relative mt-12 grid w-full overflow-hidden rounded-[2.25rem] bg-white/[0.05] text-start ring-1 ring-white/10 transition-colors hover:ring-gold/40 md:grid-cols-[minmax(0,26rem)_1fr]" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}>
              <span className="relative block p-3">
                <Infographic article={lead} className="aspect-square rounded-[1.6rem]" />
                <span className="absolute end-6 top-6 grid size-10 place-items-center rounded-full bg-ink/70 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                  <Expand className="size-4" aria-hidden />
                </span>
              </span>
              <span className="flex flex-col justify-center p-6 md:p-10">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-gold-200">
                  <span className="size-1.5 animate-pulse rounded-full bg-up" aria-hidden /> {t('hero.latest')}
                </span>
                <span className="heading-section mt-4 line-clamp-3 text-white">{lead.title}</span>
                {lead.excerpt && <span className="mt-4 line-clamp-3 text-white/65">{lead.excerpt}</span>}
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-200">
                  <Expand className="size-4" aria-hidden /> {t('drafts.view')}
                </span>
              </span>
            </motion.button>
          )}
        </div>
      </section>

      <section className="is-dark relative bg-[#0b0f2e] py-14 text-white md:py-20">
        <div className="container-x">
          {!articles.length ? (
            <Empty t={t} />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
                {rest.map((a, i) => {
                  const q = parts(a.publishedAt);
                  return (
                    <motion.button key={a.id} type="button" onClick={() => setOpen(i + 1)} {...inView(i)} className="group relative block w-full overflow-hidden rounded-[1.5rem] bg-white/[0.04] p-2 text-start ring-1 ring-white/10 transition-colors hover:ring-gold/40">
                      <span className="relative block overflow-hidden rounded-[1.1rem]">
                        <Infographic article={a} className="aspect-square transition-transform duration-500 group-hover:scale-105" />
                        <span className="absolute inset-0 grid place-items-center bg-ink/50 opacity-0 transition-opacity group-hover:opacity-100">
                          <Expand className="size-7" aria-hidden />
                        </span>
                      </span>
                      <span className="block px-2 pb-2 pt-3">
                        <span className="text-[11px] font-semibold text-gold-200">{q?.weekday} · {q?.dayMonth}</span>
                        <span className="mt-1 line-clamp-2 block text-sm font-semibold leading-snug">{a.title}</span>
                      </span>
                    </motion.button>
                  );
                })}
              </div>
              <LoadMore {...loadMore} label={t('category.loadMore')} />
            </>
          )}
        </div>
      </section>

      <AnimatePresence>{open !== null && articles[open] && <Viewer items={articles} index={open} onClose={() => setOpen(null)} onGo={setOpen} t={t} />}</AnimatePresence>
    </>
  );
}

export const DAILY_LABELS = { now: 'Live (current)', d1: 'D1 · Briefing desk', d2: 'D2 · Week board', d3: 'D3 · Gallery + viewer' };
export const DAILY_HEADER = { d1: 'dark', d2: 'light', d3: 'dark' };

export default function MarketDailyDrafts({ variant, ...props }) {
  if (variant === 'd1') return <Briefing {...props} />;
  if (variant === 'd2') return <WeekBoard {...props} />;
  return <Gallery {...props} />;
}
