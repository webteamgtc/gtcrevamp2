'use client';
/**
 * /gtc-news/market-daily-updates — ARCHIVE drafts (section 2 of the section-by-section review; the hero above is final).
 * Switch with the draft bar or ?dailyArchive=a1|a2|a3 ("now" = the live archive rows).
 *  A1 · Month wall — the updates as a wall of square infographic tiles, grouped by month with a sticky month label.
 *  A2 · Week board — one card per week, Monday to Friday, so a missing day shows as an empty slot (Saturday /
 *       Sunday columns only in a week that has a weekend update).
 *  A3 · Gallery + viewer — infographic gallery; a click opens a full-size viewer with previous / next, arrow keys
 *       and swipe, and a button to the full update.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import NavLink from '@/components/shared/nav/NavLink';
import { NewsCover } from '@/components/shared/news/NewsCard';
import { Reveal, EASE } from '@/components/motion';
import { intlLocale } from '@/i18n/locales';
import { cn } from '@/lib/utils';
import { Empty, LoadMore, PostTitle } from './categoryShared';

const inView = (i = 0) => ({ initial: { opacity: 0, y: 22 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.12 }, transition: { duration: 0.5, ease: EASE, delay: (i % 4) * 0.06 } });
const DAY = 86400000;

function useParts() {
  const locale = useLocale();
  return useMemo(() => {
    const loc = intlLocale(locale);
    const f = (o) => new Intl.DateTimeFormat(loc, { timeZone: 'UTC', ...o });
    const day = f({ day: 'numeric' }), mon = f({ month: 'short' }), monYear = f({ month: 'long', year: 'numeric' }), wd = f({ weekday: 'long' }), wds = f({ weekday: 'short' }), dm = f({ day: 'numeric', month: 'short' });
    return (iso) => {
      const d = iso ? new Date(iso) : null;
      if (!d || Number.isNaN(+d)) return null;
      return { d, day: day.format(d), month: mon.format(d), monthYear: monYear.format(d), weekday: wd.format(d), wdShort: wds.format(d), dayMonth: dm.format(d) };
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

function DateChip({ q, className }) {
  if (!q) return null;
  return (
    <span className={cn('grid h-fit w-11 shrink-0 overflow-hidden rounded-xl bg-white text-center ring-1 ring-brand/15', className)}>
      <span className="bg-brand py-0.5 text-[9px] font-bold uppercase text-white">{q.month}</span>
      <span className="py-1 text-base font-extrabold leading-none text-ink">{q.day}</span>
    </span>
  );
}

function Intro({ tm }) {
  return (
    <Reveal y={16} className="mb-10 md:mb-12">
      <h2 className="heading-section text-balance">{tm('archive')}</h2>
      <p className="mt-3 max-w-2xl text-pretty text-[15px] leading-relaxed text-ink/60 md:text-base">{tm('archiveSub')}</p>
    </Reveal>
  );
}

function Section({ children }) {
  return (
    <section className="relative scroll-mt-20 overflow-clip bg-[#f6f7fb] py-14 md:py-24">
      <div className="bg-grid-light mask-radial absolute inset-0 opacity-60" aria-hidden />
      <div className="container-x relative">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------ A1 · Month wall */

function MonthWall({ rows, t, tm, loadMore }) {
  const parts = useParts();
  const months = useMemo(() => {
    const out = [];
    for (const a of rows) {
      const q = parts(a.publishedAt);
      const key = q ? `${q.d.getUTCFullYear()}-${q.d.getUTCMonth()}` : 'other';
      let g = out.find((m) => m.key === key);
      if (!g) out.push((g = { key, label: q?.monthYear ?? '', items: [] }));
      g.items.push(a);
    }
    return out;
  }, [rows, parts]);

  return (
    <Section>
      <Intro tm={tm} />
      <div className="grid gap-12">
        {months.map((m) => (
          <div key={m.key} className="grid gap-6 lg:grid-cols-[11rem_minmax(0,1fr)]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <span className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-gold-200">
                <CalendarDays className="size-3.5" aria-hidden /> {m.label}
              </span>
              <p className="mt-3 hidden text-sm text-ink/45 lg:block">{tm('updatesCount', { count: m.items.length })}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
              {m.items.map((a, i) => {
                const q = parts(a.publishedAt);
                return (
                  <motion.article key={a.id} {...inView(i)} className="group relative flex flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-sm ring-1 ring-brand/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-brand/15">
                    <div className="overflow-hidden">
                      <Infographic article={a} className="aspect-square transition-transform duration-500 group-hover:scale-[1.04]" />
                    </div>
                    <div className="flex flex-1 gap-3 p-4">
                      <DateChip q={q} />
                      <span className="min-w-0">
                        <PostTitle a={a} className="line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-brand" />
                        <span className="mt-1 block text-xs text-ink/45">{q?.weekday}</span>
                      </span>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <LoadMore {...loadMore} label={t('category.loadMore')} />
    </Section>
  );
}

/* ------------------------------------------------------------ A2 · Week board */

const weekStart = (d) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - ((d.getUTCDay() + 6) % 7) * DAY);

function WeekBoard({ rows, t, tm, loadMore }) {
  const parts = useParts();
  const weeks = useMemo(() => {
    const map = new Map();
    for (const a of rows) {
      const q = parts(a.publishedAt);
      if (!q) continue;
      const ws = +weekStart(q.d);
      if (!map.has(ws)) map.set(ws, Array(7).fill(null));
      const idx = (q.d.getUTCDay() + 6) % 7;
      if (!map.get(ws)[idx]) map.get(ws)[idx] = a;
    }
    // Mon–Fri; Saturday and Sunday appear only in a week that has a weekend update
    return [...map.entries()].sort((x, y) => y[0] - x[0]).map(([ws, days]) => ({ ws, days: days[5] || days[6] ? days : days.slice(0, 5) }));
  }, [rows, parts]);

  return (
    <Section>
      <Intro tm={tm} />
      <div className="grid gap-6">
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
                <span className="text-xs font-semibold text-ink/40">{tm('updatesCount', { count: days.filter(Boolean).length })}</span>
              </div>
              <div className={cn('no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 md:mx-0 md:grid md:px-0', days.length === 7 ? 'md:grid-cols-7' : 'md:grid-cols-5')}>
                {days.map((a, k) => {
                  const dp = parts(new Date(ws + k * DAY).toISOString());
                  return (
                    <div key={k} className="w-40 shrink-0 md:w-auto">
                      <p className="mb-2 flex items-baseline justify-between px-1 text-xs">
                        <span className="font-bold uppercase tracking-wide text-ink/60">{dp?.wdShort}</span>
                        <span className="text-ink/40">{dp?.day}</span>
                      </p>
                      {a ? (
                        <article className="group relative overflow-hidden rounded-2xl ring-1 ring-brand/10 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/15 hover:ring-gold/50">
                          <Infographic article={a} className="aspect-square" />
                          <div className="border-t border-brand/5 bg-white p-3">
                            <PostTitle a={a} className="line-clamp-2 text-xs font-semibold leading-snug transition-colors group-hover:text-brand" />
                          </div>
                        </article>
                      ) : (
                        <div className="grid aspect-square place-items-center rounded-2xl border-2 border-dashed border-brand/10 text-xs text-ink/30">{tm('noUpdate')}</div>
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
    </Section>
  );
}

/* ------------------------------------------------------------ A3 · Gallery + viewer */

function Viewer({ items, index, onClose, onGo, t, tm }) {
  const parts = useParts();
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
      const rtl = document.dir === 'rtl';
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(rtl ? -1 : 1);
      if (e.key === 'ArrowLeft') go(rtl ? 1 : -1);
    };
    document.addEventListener('keydown', key);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', key);
      document.body.style.overflow = prev;
    };
  }, [go, onClose]);
  const q = parts(a.publishedAt);

  return (
    <motion.div className="is-dark fixed inset-0 z-[80] flex flex-col bg-ink/95 text-white backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label={a.title}>
      <div className="container-x flex items-center justify-between gap-4 py-4">
        <span className="text-sm text-white/60">
          {index + 1} / {items.length}
        </span>
        <button type="button" onClick={onClose} aria-label={tm('close')} className="grid size-11 place-items-center rounded-full bg-white/10 ring-1 ring-white/15 hover:bg-white/20">
          <X className="size-5" />
        </button>
      </div>
      <div className="container-x grid min-h-0 flex-1 items-center gap-6 overflow-y-auto pb-6 lg:grid-cols-[auto_minmax(0,1fr)_minmax(0,22rem)_auto]">
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
          {q && (
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-gold-200">
              {q.weekday} · {q.dayMonth}
            </span>
          )}
          <h2 className="heading-card mt-3 text-white">{a.title}</h2>
          {a.excerpt && <p className="mt-3 line-clamp-5 text-sm leading-relaxed text-white/65">{a.excerpt}</p>}
          <NavLink href={a.href} className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-gold pe-2 ps-6 text-sm font-semibold text-white hover:bg-gold-600">
            {tm('openFull')}
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

function Gallery({ rows, t, tm, loadMore }) {
  const parts = useParts();
  const [open, setOpen] = useState(null);
  return (
    <Section>
      <Intro tm={tm} />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {rows.map((a, i) => {
          const q = parts(a.publishedAt);
          return (
            <motion.button key={a.id} type="button" onClick={() => setOpen(i)} {...inView(i)} className="group relative block w-full overflow-hidden rounded-[1.5rem] bg-white p-2 text-start shadow-sm ring-1 ring-brand/10 transition-shadow hover:shadow-2xl hover:shadow-brand/15">
              <span className="relative block overflow-hidden rounded-[1.1rem]">
                <Infographic article={a} className="aspect-square transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute inset-0 grid place-items-center bg-ink/55 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                    <Expand className="size-4" aria-hidden /> {tm('viewInfographic')}
                  </span>
                </span>
              </span>
              <span className="block px-2 pb-2 pt-3">
                <span className="text-[11px] font-semibold text-gold-700">
                  {q?.weekday} · {q?.dayMonth}
                </span>
                <span className="mt-1 line-clamp-2 block text-sm font-semibold leading-snug text-ink">{a.title}</span>
              </span>
            </motion.button>
          );
        })}
      </div>
      <LoadMore {...loadMore} label={t('category.loadMore')} />
      <AnimatePresence>{open !== null && rows[open] && <Viewer items={rows} index={open} onClose={() => setOpen(null)} onGo={setOpen} t={t} tm={tm} />}</AnimatePresence>
    </Section>
  );
}

export const DAILY_ARCHIVE_LABELS = { now: 'Live archive', a1: 'A1 · Month wall', a2: 'A2 · Week board', a3: 'A3 · Gallery + viewer' };

export default function MarketDailyArchive({ variant, articles, t, loadMore }) {
  const tm = (key, v) => t(`marketDaily.${key}`, v);
  const rows = articles.slice(1); // the newest update is in the hero
  if (!articles.length)
    return (
      <Section>
        <Empty t={t} />
      </Section>
    );
  if (variant === 'a1') return <MonthWall rows={rows} t={t} tm={tm} loadMore={loadMore} />;
  if (variant === 'a2') return <WeekBoard rows={rows} t={t} tm={tm} loadMore={loadMore} />;
  return <Gallery rows={rows} t={t} tm={tm} loadMore={loadMore} />;
}
