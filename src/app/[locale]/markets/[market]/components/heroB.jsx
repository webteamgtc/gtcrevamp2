'use client';
/** Template B hero (even pages: Energy, Metals, Crypto) */
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Play } from 'lucide-react';
import { PORTAL } from '@/config/menu';
import ArrowLink from '@/components/shared/ArrowLink';
import NavLink from '@/components/shared/nav/NavLink';
import HeroBackdrop from '@/components/shared/HeroBackdrop';
import StatValue from '@/components/shared/StatValue';
import { AccentTitle } from '@/components/shared/SectionIntro';
import { useLiveRows, FlashPrice, Sparkline, fmt, pct } from '@/components/shared/ticker';
import { EASE } from '@/components/motion';
import { cn } from '@/lib/utils';
import { useMarket, usePageT, MarketCrumb, LiveDot, spreadOf, rangePos, changeTone, useSymbolHref } from './shared';

const Stat = ({ value }) => (String(value).includes(',') ? value : <StatValue value={value} />);

function Copy({ center = false }) {
  const t = usePageT();
  const td = useTranslations('marketsPage.detail.cta');
  return (
    <div className={center ? 'mx-auto max-w-3xl text-center' : 'text-center lg:text-start'}>
      <motion.h1 className="heading-page" initial={{ y: 20 }} animate={{ y: 0 }} transition={{ duration: 0.75, ease: EASE }}>
        <AccentTitle text={t('hero.title')} />
      </motion.h1>
      <motion.p className={cn('mt-5 max-w-2xl text-pretty text-base leading-relaxed text-white/65 md:text-lg', center ? 'mx-auto' : 'mx-auto lg:mx-0')} initial={{ y: 10 }} animate={{ y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}>
        {t('hero.text')}
      </motion.p>
      <motion.div className={cn('mt-9 flex flex-wrap items-center gap-3', center ? 'justify-center' : 'justify-center lg:justify-start')} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
        <ArrowLink href={PORTAL.register} variant="gold">
          {td('start')}
        </ArrowLink>
        <NavLink href={PORTAL.demo} className="inline-flex h-13 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white hover:text-brand-900">
          <Play className="size-4" /> {td('demo')}
        </NavLink>
      </motion.div>
    </div>
  );
}

function StatRow({ className, center = false }) {
  const t = usePageT();
  return (
    <motion.dl className={cn('grid grid-cols-2 gap-y-6 border-t border-white/10 pt-7 sm:grid-cols-4', className)} initial="h" animate="s" variants={{ s: { transition: { staggerChildren: 0.1, delayChildren: 0.35 } } }}>
      {t.raw('hero.stats').map((s) => (
        <motion.div key={s.label} variants={{ h: { opacity: 0, y: 12 }, s: { opacity: 1, y: 0 } }} className={cn('flex flex-col', center ? 'items-center text-center' : 'items-center text-center lg:items-start lg:text-start')}>
          <dt className="order-2 mt-1 text-xs text-white/55 md:text-sm">{s.label}</dt>
          <dd dir="ltr" className="heading-accent text-2xl font-bold tracking-tight md:text-3xl">
            <Stat value={s.value} />
          </dd>
        </motion.div>
      ))}
    </motion.dl>
  );
}

const Shell = ({ children, className }) => (
  <section className={cn('is-dark relative overflow-hidden bg-ink pb-20 pt-36 text-white md:pb-28 md:pt-44', className)}>
    <HeroBackdrop />
    <div className="container-x relative">{children}</div>
  </section>
);

/** Live quote card (sell/buy, spread, daily change, day high/low, range) with symbol tabs. */
export function LiveQuoteCard({ list, className }) {
  const t = useTranslations('marketsPage.detail.labels');
  const href = useSymbolHref();
  const rows = useLiveRows(list, 800);
  const [i, setI] = useState(0);
  const r = rows[i] ?? rows[0];
  const pos = rangePos(r);
  return (
    <div className={cn('relative mx-auto w-full max-w-[480px]', className)}>
      <div className="mb-3 flex flex-wrap gap-2" dir="ltr">
        {rows.map((x, k) => (
          <button key={x.s} type="button" onClick={() => setI(k)} aria-pressed={k === i} className={cn('relative rounded-full px-4 py-1.5 text-xs font-bold transition-colors', k === i ? 'text-white' : 'bg-white/10 text-white/75 hover:text-white')}>
            {k === i && <motion.span layoutId="quote-card-tab" className="absolute inset-0 rounded-full bg-brand ring-1 ring-white/20" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
            <span className="relative">{x.s}</span>
          </button>
        ))}
      </div>
      <div className="relative overflow-hidden rounded-[1.75rem] bg-white p-5 text-ink shadow-[0_40px_100px_-30px_rgba(41,59,147,0.75)] md:p-6">
        <div className="flex items-center justify-between" dir="ltr">
          <NavLink href={href(r.s)} prefetch={false} className="group inline-flex items-center gap-2 text-2xl font-bold hover:text-brand">
            {r.s} <ArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
          </NavLink>
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-up">
            <LiveDot /> {t('live')}
          </span>
        </div>
        <p className="text-xs text-ink/50">{r.n}</p>
        <AnimatePresence mode="wait">
          <motion.div key={r.s} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}>
            <div dir="ltr" className="mt-5 grid grid-cols-2 gap-3">
              <NavLink href={PORTAL.register} className="group rounded-2xl border border-down/20 bg-down/[0.06] p-4 transition-colors hover:bg-down/10">
                <span className="text-xs font-bold uppercase text-down">{t('sell')}</span>
                <FlashPrice value={r.bid} decimals={r.d} dir={r.dir} tick={r.tick} className="mt-1 block text-2xl font-bold text-ink" />
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-down">▸ {t('sellNow')}</span>
              </NavLink>
              <NavLink href={PORTAL.register} className="group rounded-2xl border border-up/20 bg-up/[0.06] p-4 transition-colors hover:bg-up/10">
                <span className="text-xs font-bold uppercase text-up">{t('buy')}</span>
                <FlashPrice value={r.ask} decimals={r.d} dir={r.dir} tick={r.tick} className="mt-1 block text-2xl font-bold text-ink" />
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-up">{t('buyNow')} ▸</span>
              </NavLink>
            </div>
            <dl dir="ltr" className="mt-3 grid grid-cols-2 gap-3">
              {[
                [t('spread'), spreadOf(r), ''],
                [t('dailyChange'), pct(r.change), changeTone(r.change)],
                [t('dayHigh'), fmt(r.high, r.d), ''],
                [t('dayLow'), fmt(r.low, r.d), '']
              ].map(([l, v, c]) => (
                <div key={l} className="rounded-xl bg-[#f6f7fb] px-3.5 py-3">
                  <dt className="text-[11px] font-medium uppercase tracking-wide text-ink/50">{l}</dt>
                  <dd className={cn('mt-0.5 text-base font-bold tabular-nums', c)}>{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4">
              <p className="text-xs font-medium text-ink/55">{t('range')}</p>
              <div dir="ltr" className="relative mt-2 h-2 rounded-full bg-gradient-to-r from-down via-[#e5e7f0] to-up">
                {pos != null && <motion.span className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-brand shadow" animate={{ left: `${pos}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />}
              </div>
              {!r.live && <p className="mt-2 text-center text-[11px] text-ink/40">{t('waiting')}</p>}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Spotlight — centred copy, then three large live price cards that rise in, with sparklines; stats underneath. */
export function HeroSpotlightB() {
  const { symbols } = useMarket();
  const t = useTranslations('marketsPage.detail.labels');
  const href = useSymbolHref();
  const lead = useMemo(() => symbols.slice(0, 3), [symbols]);
  const rows = useLiveRows(lead, 900);
  return (
    <Shell>
      <MarketCrumb />
      <div className="mt-12">
        <Copy center />
      </div>
      <div dir="ltr" className="mx-auto mt-14 grid max-w-5xl gap-4 md:grid-cols-3">
        {rows.map((r, k) => (
          <motion.div key={r.s} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + k * 0.12, duration: 0.8, ease: EASE }} whileHover={{ y: -6 }}>
            <NavLink href={href(r.s)} prefetch={false} className={cn('group relative block overflow-hidden rounded-3xl p-5 ring-1 transition-colors', k === 1 ? 'bg-white text-ink ring-white' : 'bg-white/[0.06] text-white ring-white/10 backdrop-blur hover:bg-white/[0.1]')}>
              <div className="flex items-center justify-between">
                <span className="text-lg font-black">{r.s}</span>
                <span className={cn('text-xs font-semibold tabular-nums', changeTone(r.change, k !== 1))}>{pct(r.change)}</span>
              </div>
              <p className={cn('text-xs', k === 1 ? 'text-ink/50' : 'text-white/50')}>{r.n}</p>
              <FlashPrice value={r.bid} decimals={r.d} dir={r.dir} tick={r.tick} className="mt-4 block text-3xl font-bold" />
              <Sparkline data={r.hist} up={(r.change ?? 0) >= 0} width={260} height={46} className="mt-3 w-full" />
              <div className={cn('mt-3 flex justify-between text-[11px]', k === 1 ? 'text-ink/50' : 'text-white/50')}>
                <span>
                  {t('dayLow')} <b className="font-semibold tabular-nums">{fmt(r.low, r.d)}</b>
                </span>
                <span>
                  {t('dayHigh')} <b className="font-semibold tabular-nums">{fmt(r.high, r.d)}</b>
                </span>
              </div>
            </NavLink>
          </motion.div>
        ))}
      </div>
      <StatRow center className="mx-auto mt-14 max-w-4xl" />
    </Shell>
  );
}
