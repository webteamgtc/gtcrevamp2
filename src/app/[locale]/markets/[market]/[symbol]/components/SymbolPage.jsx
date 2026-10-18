'use client';
/**
 * /markets/<market>/<symbol> — one component for every symbol page.
 * Order: live quote + chart → trading specifications + about → "Unlock global markets" → the market page's CTA.
 */
import { useEffect, useMemo, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { ScrollProgress } from '@/components/motion';
import { useLiveRows } from '@/components/shared/ticker';
import { cn } from '@/lib/utils';
import { MarketCtx } from '../../components/shared';
import { MARKET_CTA } from '../../components/cta';
import { SymbolCtx } from './shared';
import { QuoteClassic, QuoteTerminal, QuoteTicket } from './quote';
import { SpecsColumns, SpecsTiles, SpecsTabs } from './specs';
import { UnlockCentered, UnlockSplit, UnlockStage } from './unlock';

// TEMPORARY design review — each section has A + B + C. Remove the panel and the unused options once chosen.
// `header` = header style that sits on top of that hero.
const SECTIONS = [
  { id: 'quote', label: 'Quote', options: [['A', 'Classic', QuoteClassic, 'light'], ['B', 'Terminal', QuoteTerminal, 'dark'], ['C', 'Ticket', QuoteTicket, 'light']] },
  { id: 'specs', label: 'Specs', options: [['A', 'Columns', SpecsColumns], ['B', 'Tiles', SpecsTiles], ['C', 'Tabs', SpecsTabs]] },
  { id: 'unlock', label: 'Platforms', options: [['A', 'Centred', UnlockCentered], ['B', 'Split', UnlockSplit], ['C', 'Stage', UnlockStage]] }
];

function DesignPanel({ pick, setPick }) {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    if (window.matchMedia('(max-width: 767px)').matches) setOpen(false);
  }, []);
  return (
    <div dir="ltr" className="fixed bottom-4 end-4 z-[70] w-[min(23rem,calc(100vw-2rem))] text-ink">
      {open ? (
        <div className="rounded-2xl border border-dashed border-gold/60 bg-white/95 p-3 shadow-2xl backdrop-blur">
          <div className="mb-2 flex items-center justify-between px-1">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold-700">Design options · Symbol page</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Hide" className="grid size-7 place-items-center rounded-full hover:bg-brand-50">
              <X className="size-4" />
            </button>
          </div>
          <div className="grid gap-1.5">
            {SECTIONS.map((s) => (
              <div key={s.id} className="flex items-center gap-2">
                <a href={`#opt-${s.id}`} className="w-20 shrink-0 text-xs font-semibold text-ink/60 hover:text-brand">
                  {s.label}
                </a>
                <div className="flex flex-1 gap-1">
                  {s.options.map(([id, name]) => (
                    <button key={id} type="button" onClick={() => setPick((p) => ({ ...p, [s.id]: id }))} title={name} className={cn('flex-1 truncate rounded-lg px-1.5 py-1.5 text-[11px] font-semibold transition-colors', pick[s.id] === id ? 'bg-brand text-white' : 'bg-[#f3f5fb] text-ink/60 hover:bg-brand-50')}>
                      {id} · {name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className="ms-auto flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-2xl">
          <SlidersHorizontal className="size-4" />
          Design options
        </button>
      )}
    </div>
  );
}

export default function SymbolPage({ page, symbols, sym, spec }) {
  const base = useMemo(() => [sym], [sym]);
  const [row] = useLiveRows(base, 500);
  const [pick, setPick] = useState({ quote: 'A', specs: 'A', unlock: 'A' });
  const opt = (id) => SECTIONS.find((s) => s.id === id).options.find(([k]) => k === pick[id]);
  const Cta = MARKET_CTA[page.template];
  return (
    <MarketCtx.Provider value={{ page, symbols }}>
      <SymbolCtx.Provider value={{ page, symbols, sym, spec, row }}>
        <div className="overflow-x-clip bg-white text-ink">
          <ScrollProgress />
          <Header theme={opt('quote')[3]} />
          <main>
            {SECTIONS.map((s) => {
              const C = opt(s.id)[2];
              return (
                <div key={s.id} id={`opt-${s.id}`} className="scroll-mt-20">
                  <C />
                </div>
              );
            })}
            <Cta />
          </main>
          <Footer theme="dark" />
          <DesignPanel pick={pick} setPick={setPick} />
        </div>
      </SymbolCtx.Provider>
    </MarketCtx.Provider>
  );
}
