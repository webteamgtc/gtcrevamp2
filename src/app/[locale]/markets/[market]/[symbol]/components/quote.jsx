'use client';
/**
 * Symbol page — top section (live quote + chart). Copy: marketsPage.symbol.
 * The H1 is the symbol. Prices come from the live feed ("—" until the first tick).
 */
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { Info } from 'lucide-react';
import ArrowLink from '@/components/shared/ArrowLink';
import NavLink from '@/components/shared/nav/NavLink';
import { FlashPrice, fmt, pct } from '@/components/shared/ticker';
import { PORTAL } from '@/config/menu';
import { EASE } from '@/components/motion';
import { cn } from '@/lib/utils';
import { LiveDot, rangePos } from '../../components/shared';
import { useSymbol, useSymT, useFigures, Swap, SymbolCrumb } from './shared';
import { CandleChart, TimeframeTabs, useCandles } from './chart';

/** Load-time stagger for above-the-fold tiles (no waiting on scroll observers). */
const Rise = ({ i = 0, className, children }) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.25 + i * 0.06, ease: EASE }} className={className}>
    {children}
  </motion.div>
);

function useChart() {
  const { sym, row } = useSymbol();
  const [tf, setTf] = useState(1);
  const data = useCandles(sym.s, tf, row.bid);
  return { tf, setTf, ...data };
}

function Pills({ dark = false }) {
  const { page } = useSymbol();
  const t = useSymT();
  const tp = useTranslations(`marketsPage.pages.${page.id}`);
  return (
    <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em]">
      <span className={cn('inline-flex items-center gap-2 rounded-full px-3.5 py-1.5', dark ? 'bg-white/10 text-white' : 'bg-brand-50 text-brand')}>
        <LiveDot />
        {t('liveQuote')}
      </span>
      <span className={dark ? 'text-white/55' : 'text-brand/70'}>{t('brand', { market: tp('name') })}</span>
    </div>
  );
}

function Title({ dark = false, className }) {
  const { sym } = useSymbol();
  return (
    <div className={cn('flex flex-wrap items-baseline gap-x-4 gap-y-1', className)}>
      <h1 className={cn('heading-display', dark && 'is-dark')} dir="ltr">
        {sym.s}
      </h1>
      <p className={cn('text-lg md:text-xl', dark ? 'text-white/60' : 'text-ink/60')}>{sym.n}</p>
    </div>
  );
}

function ChangeChip({ dark = false }) {
  const { row } = useSymbol();
  const f = useFigures();
  const up = row.change == null || row.change >= 0;
  return (
    <span dir="ltr" className={cn('inline-flex items-center rounded-full px-3.5 py-1.5 text-sm font-semibold tabular-nums', row.change == null ? (dark ? 'bg-white/10 text-white/50' : 'bg-brand-50 text-ink/40') : up ? (dark ? 'bg-green-400/15 text-green-300' : 'bg-up/10 text-up') : dark ? 'bg-red-400/15 text-red-300' : 'bg-down/10 text-down')}>
      {pct(row.change)}
      {f.changeAbs != null && ` (${f.changeAbs >= 0 ? '+' : ''}${fmt(f.changeAbs, f.d)})`}
    </span>
  );
}

function BigPrice({ dark = false, className }) {
  const { row } = useSymbol();
  const f = useFigures();
  return (
    <div className={cn('flex flex-wrap items-center gap-4', className)} dir="ltr">
      <FlashPrice value={row.bid} decimals={f.d} dir={row.dir} tick={row.tick} className={cn('text-4xl font-bold tracking-tight md:text-5xl', dark ? 'text-white' : 'text-brand-900')} />
      <ChangeChip dark={dark} />
    </div>
  );
}

function Disclaimer({ dark = false, className }) {
  const t = useSymT();
  return (
    <p className={cn('flex items-start gap-2 text-xs leading-relaxed', dark ? 'text-white/50' : 'text-ink/60', className)}>
      <Info className="mt-0.5 size-4 shrink-0 text-down" aria-hidden />
      {t('disclaimer')}
    </p>
  );
}

/** Sell / Buy tiles (red / green) */
function SellBuy({ size = 'lg' }) {
  const { row } = useSymbol();
  const f = useFigures();
  const t = useSymT();
  const tiles = [
    ['sell', 'bid', row.bid, 'from-[#f05252] to-[#d92d2d]'],
    ['buy', 'ask', row.ask, 'from-[#12b47a] to-[#07915e]']
  ];
  return (
    <div className="grid grid-cols-2 gap-3">
      {tiles.map(([k, sub, v, bg], i) => (
        <motion.div key={k} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 + i * 0.08, ease: EASE }} className={cn('relative overflow-hidden rounded-2xl bg-gradient-to-br text-center text-white shadow-lg', bg, size === 'lg' ? 'px-3 py-6' : 'px-3 py-4')}>
          <span className="absolute -end-6 -top-6 size-20 rounded-full bg-white/10" aria-hidden />
          <p className="text-xs font-semibold uppercase tracking-wider text-white/85">{t(k)}</p>
          <p className={cn('mt-1.5 font-bold tracking-tight tabular-nums', size === 'lg' ? 'text-3xl md:text-4xl' : 'text-2xl')} dir="ltr">
            {fmt(v, f.d)}
          </p>
          <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-white/75">{t(sub)}</p>
        </motion.div>
      ))}
    </div>
  );
}

/** Day high / low, swap long / short tiles */
function StatTiles({ dark = false }) {
  const { row } = useSymbol();
  const f = useFigures();
  const t = useSymT();
  const tile = dark ? 'bg-white/[0.05] ring-1 ring-white/10' : 'bg-[#f2f4f9]';
  const items = [
    ['dayHigh', <span key="h" dir="ltr" className="tabular-nums">{fmt(row.high, f.d)}</span>],
    ['dayLow', <span key="l" dir="ltr" className="tabular-nums">{fmt(row.low, f.d)}</span>],
    ['swapLong', <Swap key="sl" value={f.swapLong} />],
    ['swapShort', <Swap key="ss" value={f.swapShort} />]
  ];
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map(([k, v], i) => (
        <Rise key={k} i={i} className={cn('rounded-2xl px-4 py-3.5', tile)}>
          <p className={cn('text-xs', dark ? 'text-white/50' : 'text-ink/55')}>{t(k)}</p>
          <p className="mt-1 text-[15px] font-semibold">{v}</p>
        </Rise>
      ))}
    </div>
  );
}

function RangeBar({ dark = false }) {
  const { row } = useSymbol();
  const f = useFigures();
  const t = useSymT();
  const p = rangePos(row);
  return (
    <div>
      <div className={cn('flex items-center justify-between text-xs', dark ? 'text-white/50' : 'text-ink/55')}>
        <span>{t('range')}</span>
        <span dir="ltr" className="tabular-nums">
          {fmt(row.low, f.d)} – {fmt(row.high, f.d)}
        </span>
      </div>
      <div dir="ltr" className={cn('relative mt-2 h-2 rounded-full', dark ? 'bg-white/10' : 'bg-brand-50')}>
        <div className="absolute inset-y-0 start-0 rounded-full bg-gradient-to-r from-down via-gold to-up opacity-80" style={{ width: '100%' }} />
        {p != null && <motion.span className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-brand shadow" animate={{ left: `${p}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />}
      </div>
    </div>
  );
}

/** Classic — light page as in the design: price card on the start side, chart on the other. */
export function QuoteClassic() {
  const { sym } = useSymbol();
  const f = useFigures();
  const t = useSymT();
  const c = useChart();
  const { row } = useSymbol();
  return (
    <section className="relative overflow-hidden bg-[#f6f8fc] pb-16 pt-28 text-ink md:pb-24 md:pt-36">
      <div className="bg-grid-light absolute inset-x-0 top-0 h-[480px] opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden />
      <div className="container-x relative">
        <SymbolCrumb className="justify-start" />
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="mt-10 space-y-5">
          <Pills />
          <Title />
          <BigPrice />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: EASE }} className="mt-10 grid gap-6 rounded-[2rem] bg-white p-4 shadow-[0_40px_100px_-60px_rgba(41,59,147,0.55)] ring-1 ring-brand/10 sm:p-6 lg:grid-cols-[minmax(300px,380px)_1fr] lg:gap-8 lg:p-8">
          <div className="space-y-4">
            <SellBuy />
            <p className="text-center">
              <span className="inline-flex rounded-full bg-[#f2f4f9] px-4 py-2 text-sm text-ink/60">
                {t('spread')}: <span className="ms-1 font-semibold text-brand" dir="ltr">{f.spread}</span>
              </span>
            </p>
            <StatTiles />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="heading-card" dir="ltr">
                {sym.s}
              </h2>
              <TimeframeTabs value={c.tf} onChange={c.setTf} />
            </div>
            <CandleChart className="mt-4" candles={c.candles} status={c.status} digits={f.d} bid={row.bid} tf={c.tf} height={380} />
            <Disclaimer className="mt-4" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/** Terminal — dark hero: symbol and price with Sell / Buy buttons, a full-width chart, then a stats strip. */
export function QuoteTerminal() {
  const { sym, row } = useSymbol();
  const f = useFigures();
  const t = useSymT();
  const c = useChart();
  const cells = [
    ['spread', <span key="s" dir="ltr">{f.spread}</span>],
    ['dayHigh', <span key="h" dir="ltr" className="tabular-nums">{fmt(row.high, f.d)}</span>],
    ['dayLow', <span key="l" dir="ltr" className="tabular-nums">{fmt(row.low, f.d)}</span>],
    ['swapLong', <Swap key="sl" value={f.swapLong} />],
    ['swapShort', <Swap key="ss" value={f.swapShort} />]
  ];
  return (
    <section className="is-dark relative overflow-hidden bg-gradient-to-b from-brand-950 via-[#0d1233] to-ink pb-16 pt-28 text-white md:pb-24 md:pt-36">
      <div className="bg-grid-dark mask-radial absolute inset-0 opacity-60" aria-hidden />
      <motion.span className="absolute -start-32 top-20 size-[420px] rounded-full bg-brand/40 blur-[120px]" animate={{ opacity: [0.5, 0.9, 0.5] }} transition={{ duration: 7, repeat: Infinity }} aria-hidden />
      <span className="absolute -end-24 bottom-0 size-80 rounded-full bg-gold/15 blur-[110px]" aria-hidden />
      <div className="container-x relative">
        <SymbolCrumb tone="dark" className="justify-start" />
        <div className="mt-10 grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="space-y-5">
            <Pills dark />
            <Title dark />
            <BigPrice dark />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15, ease: EASE }} className="grid grid-cols-2 gap-3 sm:w-96" dir="ltr">
            {[
              ['sellNow', row.bid, 'bg-[#e23b3b] hover:bg-[#c92f2f]'],
              ['buyNow', row.ask, 'bg-[#0ea371] hover:bg-[#0b8a5f]']
            ].map(([k, v, bg]) => (
              <NavLink key={k} href={PORTAL.register} className={cn('group rounded-2xl px-4 py-3.5 text-center shadow-lg transition-colors', bg)}>
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-white/80">{t(k)}</span>
                <span className="mt-0.5 block text-xl font-bold tabular-nums">{fmt(v, f.d)}</span>
              </NavLink>
            ))}
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: EASE }} className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 backdrop-blur sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-white/80" dir="ltr">
              <LiveDot /> {sym.s} · {sym.n}
            </p>
            <TimeframeTabs value={c.tf} onChange={c.setTf} dark />
          </div>
          <CandleChart className="mt-4" candles={c.candles} status={c.status} digits={f.d} bid={row.bid} tf={c.tf} height={420} dark />
        </motion.div>
        <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3 lg:grid-cols-6">
          {cells.map(([k, v], i) => (
            <Rise key={k} i={i} className="bg-brand-950/70 px-4 py-4">
              <p className="text-xs text-white/50">{t(k)}</p>
              <p className="mt-1 text-[15px] font-semibold">{v}</p>
            </Rise>
          ))}
          <Rise i={cells.length} className="col-span-2 bg-brand-950/70 px-4 py-4 sm:col-span-1">
            <RangeBar dark />
          </Rise>
        </div>
        <Disclaimer dark className="mt-5" />
      </div>
    </section>
  );
}

/** Ticket — light: a large chart on the start side, an order-ticket card on the other with Sell / Buy, range, swaps and the account buttons. */
export function QuoteTicket() {
  const { sym, row } = useSymbol();
  const f = useFigures();
  const t = useSymT();
  const td = useTranslations('marketsPage.detail.cta');
  const c = useChart();
  return (
    <section className="relative overflow-hidden bg-white pb-16 pt-28 text-ink md:pb-24 md:pt-36">
      <span className="absolute -end-40 -top-40 size-[520px] rounded-full bg-brand-50 blur-3xl" aria-hidden />
      <div className="container-x relative">
        <SymbolCrumb className="justify-start" />
        <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="space-y-4">
            <Pills />
            <Title />
          </motion.div>
          <BigPrice />
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_380px]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: EASE }} className="min-w-0 rounded-[2rem] bg-white p-4 shadow-[0_40px_100px_-60px_rgba(41,59,147,0.55)] ring-1 ring-brand/10 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="heading-card" dir="ltr">
                {sym.s}
              </h2>
              <TimeframeTabs value={c.tf} onChange={c.setTf} />
            </div>
            <CandleChart className="mt-4" candles={c.candles} status={c.status} digits={f.d} bid={row.bid} tf={c.tf} height={440} />
            <Disclaimer className="mt-4" />
          </motion.div>
          <motion.aside initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: EASE }} className="h-fit space-y-5 rounded-[2rem] bg-gradient-to-b from-[#f6f8fc] to-white p-5 ring-1 ring-brand/10 sm:p-6 lg:sticky lg:top-24">
            <SellBuy size="sm" />
            <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-brand/10">
              <span className="text-ink/55">{t('spread')}</span>
              <span className="font-semibold text-brand" dir="ltr">
                {f.spread}
              </span>
            </div>
            <RangeBar />
            <div className="grid grid-cols-2 gap-3">
              {[
                ['swapLong', f.swapLong],
                ['swapShort', f.swapShort]
              ].map(([k, v]) => (
                <div key={k} className="rounded-2xl bg-white px-4 py-3 ring-1 ring-brand/10">
                  <p className="text-xs text-ink/55">{t(k)}</p>
                  <Swap value={v} className="mt-1 block text-[15px] font-semibold" />
                </div>
              ))}
            </div>
            <div className="space-y-2.5 pt-1">
              <ArrowLink href={PORTAL.register} variant="gold" className="w-full justify-between">
                {t('trade', { symbol: sym.s })}
              </ArrowLink>
              <NavLink href={PORTAL.demo} className="flex h-12 items-center justify-center rounded-full border border-brand/15 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white">
                {td('demo')}
              </NavLink>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
