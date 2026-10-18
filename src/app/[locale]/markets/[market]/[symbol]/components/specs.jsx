'use client';
/**
 * Symbol page — trading specifications + about. Copy: marketsPage.symbol.specs / .about.
 * Contract values come from the symbols API (/trade/symbol_info); anything it doesn't return shows "—".
 */
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Package, Scale, Ruler, Coins, Gauge, Percent, CalendarClock, Clock, Sparkles } from 'lucide-react';
import { SectionIntro } from '@/components/shared/SectionIntro';
import { Reveal, Stagger, StaggerItem, EASE } from '@/components/motion';
import { cn } from '@/lib/utils';
import { useSymT, useFigures, useAbout, RelatedSymbols } from './shared';

const SPEC_ICON = { contractSize: Package, minLot: Scale, tickSize: Ruler, valuePerPip: Coins, leverage: Gauge, marginRate: Percent, tripleSwap: CalendarClock, hours: Clock };

const Bar = ({ children }) => <h2 className="heading-title border-s-4 border-brand ps-3">{children}</h2>;

function Chips({ chips, className }) {
  return (
    <ul className={cn('flex flex-wrap gap-2', className)}>
      {chips.map((c) => (
        <li key={c} className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand">
          {c}
        </li>
      ))}
    </ul>
  );
}

/** Columns — as in the design: the specification grid on the start side, the about card on the other. */
export function SpecsColumns() {
  const t = useSymT();
  const f = useFigures();
  const a = useAbout();
  return (
    <section className="bg-white py-14 text-ink md:py-24">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <Reveal y={20}>
            <Bar>{t('specs.title')}</Bar>
            <dl className="mt-6 grid grid-cols-1 overflow-hidden rounded-3xl bg-[#f6f8fc] ring-1 ring-brand/10 sm:grid-cols-2">
              {f.specs.map(([k, v], i) => (
                <div key={k} className={cn('border-brand/10 px-6 py-5', i > 0 && 'border-t', i === 1 && 'sm:border-t-0', i % 2 === 1 && 'sm:border-s')}>
                  <dt className="text-sm text-ink/50">{t(`specs.${k}`)}</dt>
                  <dd className="mt-1.5 text-lg font-semibold" dir={k === 'hours' || k === 'tripleSwap' ? undefined : 'ltr'}>
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal y={20} delay={0.1} className="flex flex-col">
            <Bar>{a.title}</Bar>
            <div className="relative mt-6 flex flex-1 flex-col justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-white to-[#f6f8fc] p-7 ring-1 ring-brand/10 md:p-9">
              <motion.span className="absolute -end-16 -top-16 size-56 rounded-full bg-brand-50" animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 8, repeat: Infinity }} aria-hidden />
              <p className="relative text-base leading-relaxed text-ink/70 md:text-[17px]">{a.text}</p>
              <Chips chips={a.chips} className="relative mt-6" />
            </div>
          </Reveal>
        </div>
        <RelatedSymbols className="mt-12" />
      </div>
    </section>
  );
}

/** Tiles — eight spec tiles with icons that rise in, then a wide about band with chips and related symbols. */
export function SpecsTiles() {
  const t = useSymT();
  const f = useFigures();
  const a = useAbout();
  return (
    <section className="bg-[#f6f8fc] py-14 text-ink md:py-24">
      <div className="container-x">
        <SectionIntro title={t('specs.heading')} description={t('specs.description')} />
        <Stagger className="mt-12 grid grid-cols-2 gap-4 md:mt-16 lg:grid-cols-4" stagger={0.06}>
          {f.specs.map(([k, v]) => {
            const I = SPEC_ICON[k] ?? Sparkles;
            return (
              <StaggerItem key={k}>
                <div className="group h-full rounded-3xl bg-white p-5 ring-1 ring-brand/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(41,59,147,0.5)] md:p-6">
                  <span className="grid size-11 place-items-center rounded-2xl bg-brand-50 text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                    <I className="size-5" aria-hidden />
                  </span>
                  <p className="mt-5 text-sm text-ink/50">{t(`specs.${k}`)}</p>
                  <p className="mt-1 text-lg font-semibold md:text-xl" dir={k === 'hours' || k === 'tripleSwap' ? undefined : 'ltr'}>
                    {v}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
        <Reveal y={20} className="mt-6">
          <div className="grid gap-8 rounded-[2rem] bg-white p-7 ring-1 ring-brand/10 md:p-10 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
            <div>
              <h3 className="heading-card">{a.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/65 md:text-base">{a.text}</p>
              <Chips chips={a.chips} className="mt-5" />
            </div>
            <RelatedSymbols className="lg:border-s lg:border-brand/10 lg:ps-10" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Tabs — one card with Specifications / About / Related tabs; the panel slides between them. */
export function SpecsTabs() {
  const t = useSymT();
  const f = useFigures();
  const a = useAbout();
  const [tab, setTab] = useState('specs');
  const tabs = ['specs', 'about', 'related'];
  return (
    <section className="bg-white py-14 text-ink md:py-24">
      <div className="container-x">
        <SectionIntro title={t('specs.heading')} description={t('specs.description')} />
        <Reveal y={20} className="mx-auto mt-12 max-w-5xl md:mt-16">
          <div className="overflow-hidden rounded-[2rem] bg-[#f6f8fc] ring-1 ring-brand/10">
            <div role="tablist" aria-label={t('specs.heading').replace(/[[\]]/g, '')} className="flex gap-1 overflow-x-auto border-b border-brand/10 px-3 pt-3 sm:px-6">
              {tabs.map((k) => (
                <button key={k} id={`sp-t-${k}`} type="button" role="tab" aria-selected={tab === k} aria-controls="sp-panel" onClick={() => setTab(k)} className={cn('relative whitespace-nowrap px-4 pb-3.5 pt-2 text-sm font-semibold transition-colors', tab === k ? 'text-brand' : 'text-ink/50 hover:text-ink')}>
                  {t(`tabs.${k}`)}
                  {tab === k && <motion.span layoutId="sp-tab" className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                </button>
              ))}
            </div>
            <div id="sp-panel" role="tabpanel" aria-labelledby={`sp-t-${tab}`} className="min-h-[300px] p-5 sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: EASE }}>
                  {tab === 'specs' && (
                    <dl className="grid gap-x-10 sm:grid-cols-2">
                      {f.specs.map(([k, v]) => {
                        const I = SPEC_ICON[k] ?? Sparkles;
                        return (
                          <div key={k} className="flex items-center justify-between gap-4 border-b border-brand/10 py-4">
                            <dt className="flex items-center gap-3 text-sm text-ink/60">
                              <I className="size-4 text-brand" aria-hidden />
                              {t(`specs.${k}`)}
                            </dt>
                            <dd className="text-end font-semibold" dir={k === 'hours' || k === 'tripleSwap' ? undefined : 'ltr'}>
                              {v}
                            </dd>
                          </div>
                        );
                      })}
                    </dl>
                  )}
                  {tab === 'about' && (
                    <div className="max-w-3xl">
                      <h3 className="heading-card">{a.title}</h3>
                      <p className="mt-3 text-base leading-relaxed text-ink/70">{a.text}</p>
                      <Chips chips={a.chips} className="mt-6" />
                    </div>
                  )}
                  {tab === 'related' && <RelatedSymbols limit={30} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
