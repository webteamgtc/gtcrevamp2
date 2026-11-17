'use client';
/**
 * /gtc-news/market-daily-updates archive ("Gallery + viewer", chosen 18 Nov 2026): a gallery of the earlier
 * infographics; a click opens a full-size viewer with previous / next, arrow keys and swipe, and a button to the
 * full update. The newest update is in the hero, so it starts from the second post.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import NavLink from '@/components/shared/nav/NavLink';
import { NewsCover } from '@/components/shared/news/NewsCard';
import { Reveal, EASE } from '@/components/motion';
import { intlLocale } from '@/i18n/locales';
import { cn } from '@/lib/utils';
import { Empty, LoadMore } from './categoryShared';

const inView = (i = 0) => ({ initial: { opacity: 0, y: 22 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.12 }, transition: { duration: 0.5, ease: EASE, delay: (i % 4) * 0.06 } });

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
        <span dir="ltr" className="text-sm tabular-nums text-white/60">
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

export default function MarketDailyArchive({ articles, t, loadMore }) {
  const tm = (key, v) => t(`marketDaily.${key}`, v);
  if (!articles.length)
    return (
      <Section>
        <Empty t={t} />
      </Section>
    );
  return <Gallery rows={articles.slice(1)} t={t} tm={tm} loadMore={loadMore} />; // the newest update is in the hero
}
