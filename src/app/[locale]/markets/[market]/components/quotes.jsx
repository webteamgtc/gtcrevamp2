'use client';
/** Live quotes for the market (both templates) Every row links to the symbol's own page. */
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ChevronDown, Search } from 'lucide-react';
import NavLink from '@/components/shared/nav/NavLink';
import { SectionIntro } from '@/components/shared/SectionIntro';
import { useLiveRows, FlashPrice, Sparkline, fmt, pct } from '@/components/shared/ticker';
import { EASE } from '@/components/motion';
import { cn } from '@/lib/utils';
import { useMarket, usePageT, spreadOf, rangePos, changeTone, useSymbolHref, LiveDot } from './shared';

const PAGE = 10;

/** Live rows + search + "show all" state shared by the three layouts. */
function useQuoteList() {
  const { symbols } = useMarket();
  const rows = useLiveRows(symbols, 1000);
  const [q, setQ] = useState('');
  const [all, setAll] = useState(false);
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? rows.filter((r) => r.s.toLowerCase().includes(s) || r.n.toLowerCase().includes(s)) : rows;
  }, [rows, q]);
  return { rows, q, setQ, all, setAll, filtered, shown: all || q ? filtered : filtered.slice(0, PAGE) };
}

function SearchBox({ q, setQ, className }) {
  const t = useTranslations('marketsPage.detail.labels');
  return (
    <label className={cn('relative flex items-center', className)}>
      <span className="sr-only">{t('search')}</span>
      <Search className="pointer-events-none absolute start-4 size-4 text-ink/40" aria-hidden />
      <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('searchPlaceholder')} className="h-12 w-full rounded-full border border-brand/15 bg-white ps-11 pe-4 text-sm text-ink outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10" />
    </label>
  );
}

function MoreButton({ list }) {
  const t = useTranslations('marketsPage.detail.labels');
  if (list.q || list.filtered.length <= PAGE) return null;
  return (
    <div className="mt-8 flex justify-center">
      <button type="button" onClick={() => list.setAll((a) => !a)} className="inline-flex items-center gap-2 rounded-full border border-brand/15 bg-white px-6 py-3 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white">
        {list.all ? t('showLess') : t('showMore', { count: list.filtered.length })}
        <ChevronDown className={cn('size-4 transition-transform', list.all && 'rotate-180')} />
      </button>
    </div>
  );
}

function Empty({ q }) {
  const t = useTranslations('marketsPage.detail.labels');
  return <p className="py-12 text-center text-sm text-ink/50">{t('noResults', { query: q })}</p>;
}

function Intro({ list, center = true }) {
  const t = usePageT();
  return (
    <div className={cn('flex flex-col gap-6', !center && 'lg:flex-row lg:items-end lg:justify-between')}>
      <SectionIntro layout={center ? 'center' : 'split'} title={t('quotes.title')} description={t('quotes.description')} className={center ? '' : 'flex-1'} />
      <SearchBox q={list.q} setQ={list.setQ} className={center ? 'mx-auto w-full max-w-md' : 'w-full lg:max-w-xs'} />
    </div>
  );
}

/** Cards — a grid of live tiles with a sparkline built from incoming ticks; tiles lift on hover. */
export function QuotesCards() {
  const href = useSymbolHref();
  const list = useQuoteList();
  return (
    <section className="relative bg-white py-14 text-ink md:py-24">
      <div className="container-x">
        <Intro list={list} center={false} />
        {list.shown.length === 0 && <Empty q={list.q} />}
        <motion.div layout className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-12 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence initial={false}>
            {list.shown.map((r) => (
              <motion.div key={r.s} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.35, ease: EASE }}>
                <NavLink href={href(r.s)} prefetch={false} className="group relative block h-full overflow-hidden rounded-3xl border border-brand/10 bg-gradient-to-b from-white to-[#f8f9fd] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand/25 hover:shadow-[0_24px_60px_-30px_rgba(41,59,147,0.5)]">
                  <div className="flex items-start justify-between gap-3" dir="ltr">
                    <div className="min-w-0">
                      <p className="text-base font-bold text-brand">{r.s}</p>
                      <p className="truncate text-xs text-ink/50">{r.n}</p>
                    </div>
                    <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums', r.change == null ? 'bg-ink/5 text-ink/40' : r.change >= 0 ? 'bg-up/10 text-up' : 'bg-down/10 text-down')}>{pct(r.change)}</span>
                  </div>
                  <Sparkline data={r.hist} up={(r.change ?? 0) >= 0} width={240} height={40} className="mt-4 w-full" />
                  <div dir="ltr" className="mt-4 grid grid-cols-2 gap-2 text-center">
                    <div className="rounded-xl bg-down/[0.07] py-2">
                      <FlashPrice value={r.bid} decimals={r.d} dir={r.dir} tick={r.tick} className="text-sm font-bold text-ink" />
                    </div>
                    <div className="rounded-xl bg-up/[0.07] py-2">
                      <FlashPrice value={r.ask} decimals={r.d} dir={r.dir} tick={r.tick} className="text-sm font-bold text-ink" />
                    </div>
                  </div>
                </NavLink>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        <MoreButton list={list} />
      </div>
    </section>
  );
}

/** Watchlist — a compact live list on the start side, the selected instrument in detail on the other. */
export function QuotesWatchlist() {
  const t = useTranslations('marketsPage.detail.labels');
  const href = useSymbolHref();
  const list = useQuoteList();
  const [sel, setSel] = useState(0);
  const r = list.shown[sel] ?? list.shown[0] ?? list.rows[0];
  const pos = rangePos(r);
  return (
    <section className="relative bg-white py-14 text-ink md:py-24">
      <div className="container-x">
        <Intro list={list} center={false} />
        <div className="mt-10 grid gap-6 md:mt-12 lg:grid-cols-[1fr_1.1fr]">
          <div className="overflow-hidden rounded-3xl border border-brand/10">
            {list.shown.length === 0 && <Empty q={list.q} />}
            <ul className="max-h-[560px] overflow-y-auto">
              {list.shown.map((x, k) => (
                <li key={x.s}>
                  <button type="button" onClick={() => setSel(k)} onMouseEnter={() => setSel(k)} className={cn('relative flex w-full items-center justify-between gap-4 border-b border-brand/10 px-5 py-3.5 text-start transition-colors', k === sel ? 'bg-brand text-white' : 'hover:bg-[#f8f9fd]')}>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold" dir="ltr">{x.s}</span>
                      <span className={cn('block truncate text-xs', k === sel ? 'text-white/60' : 'text-ink/50')}>{x.n}</span>
                    </span>
                    <span className="flex items-center gap-4" dir="ltr">
                      <FlashPrice value={x.bid} decimals={x.d} dir={x.dir} tick={x.tick} className="text-sm font-semibold" />
                      <span className={cn('w-16 text-end text-xs font-semibold tabular-nums', changeTone(x.change, k === sel))}>{pct(x.change)}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {r && (
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-brand to-brand-700 p-6 text-white md:p-8 lg:sticky lg:top-24 lg:self-start">
              <div className="bg-grid-dark absolute inset-0 opacity-40" aria-hidden />
              <span className="absolute -end-16 -top-16 size-56 rounded-full bg-gold/25 blur-3xl" aria-hidden />
              <AnimatePresence mode="wait">
                <motion.div key={r.s} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="relative">
                  <div className="flex items-center justify-between" dir="ltr">
                    <div>
                      <p className="text-3xl font-black">{r.s}</p>
                      <p className="text-sm text-white/60">{r.n}</p>
                    </div>
                    <span className="inline-flex items-center gap-2 text-[11px] font-bold text-gold-200">
                      <LiveDot /> {t('live')}
                    </span>
                  </div>
                  <FlashPrice value={r.bid} decimals={r.d} dir={r.dir} tick={r.tick} className="mt-6 block text-5xl font-bold tracking-tight" />
                  <p className={cn('mt-1 text-sm font-semibold tabular-nums', changeTone(r.change, true))} dir="ltr">{pct(r.change)}</p>
                  <Sparkline data={r.hist} up={(r.change ?? 0) >= 0} width={420} height={70} className="mt-6 w-full" />
                  <dl dir="ltr" className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      [t('sell'), fmt(r.bid, r.d)],
                      [t('buy'), fmt(r.ask, r.d)],
                      [t('spread'), spreadOf(r)],
                      [t('dayHigh'), fmt(r.high, r.d)]
                    ].map(([l, v]) => (
                      <div key={l} className="rounded-xl bg-white/10 px-3 py-2.5">
                        <dt className="text-[10px] font-semibold uppercase tracking-wide text-white/50">{l}</dt>
                        <dd className="mt-0.5 text-sm font-bold tabular-nums">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <div dir="ltr" className="relative mt-6 h-2 rounded-full bg-white/15">
                    {pos != null && <motion.span className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-gold" animate={{ left: `${pos}%` }} />}
                  </div>
                  <NavLink href={href(r.s)} prefetch={false} className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand-900 transition-colors hover:bg-gold-50">
                    {t('viewDetails')} <ArrowRight className="size-4 rtl:-scale-x-100" />
                  </NavLink>
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
        <MoreButton list={list} />
      </div>
    </section>
  );
}
