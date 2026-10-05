'use client';
/**
 * Draft 1 (light) — redesigned sections: Markets explorer, Platforms stage, FAQ with support chat.
 */
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, Check, Download, Headphones, Languages, Clock, Sparkles } from 'lucide-react';
import { Button } from '../../ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../ui/accordion';
import { MARKET_ICONS } from '../../shared/icons';
import { useTicker, FlashPrice, Sparkline, UpDown, fmt } from '../../shared/ticker';
import { CandleChart, LaptopMockup, PhoneMockup, TabletMockup } from '../../shared/devices';
import { SectionHeading, Ambient } from '../../shared/blocks';
import { Reveal, Stagger, StaggerItem, EASE } from '../../motion';
import { cn } from '@/lib/utils';

/* ============================================================ MARKETS */
// which demo price group represents each market (same order as markets.items)
const MARKET_GROUP = [2, 0, 1, 4, 6, 3, 5, 4];

export function MarketsExplorer() {
  const t = useTranslations('markets');
  const items = t.raw('items');
  const groups = [useTicker(0), useTicker(1), useTicker(2), useTicker(3), useTicker(4), useTicker(5), useTicker(6)];
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const DURATION = 5000;

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % items.length), DURATION);
    return () => clearTimeout(id);
  }, [active, paused, items.length]);

  const rows = groups[MARKET_GROUP[active]];
  const lead = rows[0];
  const ActiveIcon = MARKET_ICONS[active];

  return (
    <section className="relative overflow-hidden bg-[#f5f6fa] py-24 md:py-32">
      <div className="bg-dots-light mask-radial absolute inset-0 opacity-60" />
      <Ambient />
      <div className="container-x relative">
        <SectionHeading eyebrow={t('eyebrow')} title={t('titleA')} titleB={t('titleB')} />

        <div className="mt-14 grid gap-6 lg:grid-cols-[360px_1fr]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          {/* market list */}
          <Stagger className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-1" stagger={0.06}>
            {items.map((it, i) => {
              const Icon = MARKET_ICONS[i];
              const r = groups[MARKET_GROUP[i]][0];
              const on = i === active;
              return (
                <StaggerItem key={it.name} variants={{ hidden: { opacity: 0, x: -24 }, show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } } }}>
                  <button
                    onClick={() => setActive(i)}
                    className={cn(
                      'group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl p-3 text-start transition-all duration-300',
                      on ? 'bg-white shadow-xl shadow-brand/10' : 'hover:bg-white/70'
                    )}
                  >
                    {on && <motion.span layoutId="d1-mk-bar" className="absolute inset-y-3 start-0 w-1 rounded-full bg-gradient-to-b from-gold to-brand" />}
                    <span className={cn('grid size-11 shrink-0 place-items-center rounded-xl transition-all duration-500', on ? 'bg-gradient-to-br from-brand to-brand-400 text-white shadow-lg shadow-brand/30' : 'bg-white text-brand group-hover:scale-105')}>
                      <Icon className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={cn('block truncate text-sm font-semibold', on ? 'text-ink' : 'text-ink/70')}>{it.name}</span>
                      <span className="hidden items-center gap-1.5 text-xs text-ink/45 lg:flex">
                        {r.s} · <FlashPrice value={r.bid} decimals={r.d} dir={r.dir} tick={r.tick} />
                      </span>
                    </span>
                    <span className="hidden lg:block">
                      <Sparkline data={r.hist} up={r.dir > 0} width={56} height={22} />
                    </span>
                    {on && !paused && (
                      <motion.span key={`p-${active}`} className="absolute inset-x-3 bottom-1 h-0.5 origin-left rounded-full bg-gold/60 rtl:origin-right" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: DURATION / 1000, ease: 'linear' }} />
                    )}
                  </button>
                </StaggerItem>
              );
            })}
          </Stagger>

          {/* showcase */}
          <Reveal y={40} className="min-w-0">
            <div className="relative h-full min-h-[520px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand via-brand-700 to-brand-950 p-7 text-white shadow-2xl shadow-brand/30 md:p-10">
              <div className="bg-grid-dark absolute inset-0 opacity-50" />
              <motion.div className="absolute -end-24 -top-24 size-80 rounded-full bg-gold/30 blur-[90px]" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 7, repeat: Infinity }} />
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="relative flex h-full flex-col"
                >
                  <div className="flex flex-wrap items-start justify-between gap-6">
                    <div className="max-w-md">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-gold-200 backdrop-blur">
                        <ActiveIcon className="size-3.5" /> {items[active].name}
                      </span>
                      <h3 className="mt-4 text-2xl font-bold md:text-3xl">{items[active].title}</h3>
                      <p className="mt-3 text-white/70">{items[active].text}</p>
                    </div>
                    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                      <div className="flex items-center gap-2 text-xs text-white/60">
                        <span className="relative flex size-2">
                          <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-70" />
                          <span className="relative inline-flex size-2 rounded-full bg-green-400" />
                        </span>
                        {lead.s} · {t('live')}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-2xl font-bold">
                        <FlashPrice value={lead.bid} decimals={lead.d} dir={lead.dir} tick={lead.tick} />
                        <UpDown dir={lead.dir} />
                      </div>
                      <div className={cn('text-xs font-semibold', lead.change >= 0 ? 'text-green-300' : 'text-red-300')}>
                        {lead.change >= 0 ? '+' : ''}
                        {lead.change.toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  <div className="relative mt-6 h-44 rounded-2xl border border-white/10 bg-white/[0.04] p-2 md:h-52">
                    <CandleChart n={46} seed={active * 7 + 3} dark trigger="mount" className="h-full" />
                  </div>

                  <div className="mt-6">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">{t('topInstruments')}</div>
                    <div className="mt-3 grid gap-2 sm:grid-cols-3">
                      {rows.slice(1, 4).map((r, k) => (
                        <motion.div key={r.s} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + k * 0.08 }} className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur transition-colors hover:bg-white/15">
                          <span className="text-sm font-semibold">{r.s}</span>
                          <span className="text-end text-sm">
                            <FlashPrice value={r.bid} decimals={r.d} dir={r.dir} tick={r.tick} className="font-semibold" />
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button variant="white" as="a" href="#">
                      {t('cta')} <ArrowUpRight className="rtl:-scale-x-100" />
                    </Button>
                    <Button variant="outlineLight" as="a" href="#register">
                      {t('tradeCta', { name: items[active].name })} <ArrowRight className="rtl:-scale-x-100" />
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ============================================================ PLATFORMS */
const DEVICE_POS = {
  mt4: { className: 'start-[2%] bottom-[70px] z-10', node: (p) => <TabletMockup className="w-[330px]" {...p} /> },
  gtcgo: { className: 'start-1/2 -translate-x-1/2 rtl:translate-x-1/2 bottom-[56px] z-20', node: (p) => <LaptopMockup className="w-[470px]" symbol="GBPUSD" price="1.34218" seed={21} {...p} /> },
  mt5: { className: 'end-[4%] bottom-[44px] z-30', node: (p) => <PhoneMockup className="w-[170px]" symbol="EURUSD" price="1.16035" seed={5} {...p} /> }
};

export function PlatformsStage() {
  const t = useTranslations('platforms');
  const items = t.raw('items');
  const features = t.raw('features');
  const perks = t.raw('perks');
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const DURATION = 6000;
  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => setI((x) => (x + 1) % items.length), DURATION);
    return () => clearTimeout(id);
  }, [i, paused, items.length]);
  const it = items[i];

  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-32">
      <Ambient />
      <div className="container-x relative">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />

        {/* selector */}
        <Reveal y={16} className="mx-auto mt-10 flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border border-brand/10 bg-[#f4f5fa] p-1.5 no-scrollbar">
          {items.map((x, k) => (
            <button key={x.key} onClick={() => setI(k)} className={cn('relative overflow-hidden whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-colors', i === k ? 'text-white' : 'text-ink/60 hover:text-ink')}>
              {i === k && (
                <motion.span layoutId="d1-plat" className="absolute inset-0 rounded-full bg-brand shadow-lg shadow-brand/30" transition={{ type: 'spring', stiffness: 380, damping: 30 }}>
                  {!paused && <motion.span key={`pp-${i}`} className="absolute inset-y-0 start-0 bg-white/15" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: DURATION / 1000, ease: 'linear' }} />}
                </motion.span>
              )}
              <span className="relative">{x.brand}</span>
            </button>
          ))}
        </Reveal>

        <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-[380px_1fr]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          {/* info card */}
          <Reveal x={-30} y={0} className="min-w-0">
            <div className="relative h-full overflow-hidden rounded-[2rem] border border-brand/10 bg-gradient-to-b from-[#f7f8fc] to-white p-8">
              <div className="absolute -end-16 -top-16 size-48 rounded-full bg-gold-100 blur-3xl" />
              <AnimatePresence mode="wait">
                <motion.div key={it.key} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} transition={{ duration: 0.45, ease: EASE }} className="relative">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-brand shadow-sm">
                    <span className="grid size-5 place-items-center rounded-full bg-gradient-to-br from-gold to-gold-600 text-[9px] font-black text-white">{it.key === 'gtcgo' ? 'G' : it.key === 'mt5' ? '5' : '4'}</span>
                    {it.brand}
                  </span>
                  <h3 className="mt-5 text-2xl font-bold tracking-tight text-ink md:text-3xl">{it.title}</h3>
                  <p className="mt-3 text-ink/60">{it.tagline}</p>
                  <ul className="mt-6 space-y-3">
                    {features.map((f, k) => (
                      <motion.li key={f} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + k * 0.08 }} className="flex items-center gap-3 text-sm text-ink/75">
                        <span className="grid size-6 place-items-center rounded-full bg-brand-50 text-brand">
                          <Check className="size-3.5" />
                        </span>
                        {f}
                      </motion.li>
                    ))}
                  </ul>
                  <Button size="lg" className="mt-8 w-full" as="a" href="#">
                    <Download /> {it.cta}
                  </Button>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>

          {/* stage */}
          <Reveal y={40} className="min-w-0">
            <div className="relative h-[460px] overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#eef1fb] via-[#f6f7fc] to-white md:h-[540px]">
              {/* 3D floor */}
              <div className="absolute inset-x-[-20%] bottom-[-35%] h-[80%] [perspective:600px]">
                <motion.div className="h-full w-full origin-top [transform:rotateX(62deg)] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" style={{ backgroundImage: "linear-gradient(to right, rgba(41,59,147,0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(41,59,147,0.16) 1px, transparent 1px)", backgroundSize: "48px 48px" }} animate={{ backgroundPositionY: ["0px", "48px"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
              </div>
              {/* spotlight following the active device */}
              <motion.div
                className="absolute bottom-6 h-24 w-80 rounded-[100%] bg-brand/25 blur-2xl"
                animate={{ left: it.key === 'mt4' ? '4%' : it.key === 'gtcgo' ? '30%' : '62%' }}
                transition={{ type: 'spring', stiffness: 90, damping: 18 }}
              />
              {/* perks */}
              {perks.map((p, k) => (
                <motion.span
                  key={p}
                  className={cn('absolute z-40 hidden items-center gap-2 rounded-full border border-white bg-white/90 px-3 py-1.5 text-xs font-semibold text-brand shadow-lg shadow-brand/10 backdrop-blur md:inline-flex', ['start-6 top-6', 'end-6 top-10', 'start-1/3 top-4'][k])}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4 + k, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Sparkles className="size-3.5 text-gold" /> {p}
                </motion.span>
              ))}

              {/* desktop: all three devices, active one spotlighted */}
              <div dir="ltr" className="absolute inset-0 hidden md:block">
                {['mt4', 'gtcgo', 'mt5'].map((k) => {
                  const on = it.key === k;
                  const idx = items.findIndex((x) => x.key === k);
                  return (
                    <motion.button
                      key={k}
                      onClick={() => setI(idx)}
                      className={cn('absolute origin-bottom', DEVICE_POS[k].className, on && 'z-40')}
                      animate={{ scale: on ? 1.06 : 0.9, opacity: on ? 1 : 0.55, filter: on ? 'blur(0px) saturate(1)' : 'blur(1.5px) saturate(0.6)', y: on ? -10 : 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                      aria-label={items[idx].brand}
                    >
                      <div className={cn(on && 'animate-float')}>{DEVICE_POS[k].node({})}</div>
                    </motion.button>
                  );
                })}
              </div>
              {/* mobile: only the active device */}
              <div className="absolute inset-0 flex items-end justify-center pb-10 md:hidden">
                <AnimatePresence mode="wait">
                  <motion.div key={it.key} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                    {it.key === 'mt5' ? <PhoneMockup className="w-[170px]" /> : it.key === 'mt4' ? <TabletMockup className="w-[300px]" /> : <LaptopMockup className="w-[300px]" />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ============================================================ FAQ */
export function FaqSupport() {
  const t = useTranslations('faq');
  const items = t.raw('items');
  const [open, setOpen] = useState('q0');
  const [phase, setPhase] = useState('answer');
  const idx = open ? Number(open.slice(1)) : null;

  useEffect(() => {
    if (idx === null) return;
    setPhase('typing');
    const id = setTimeout(() => setPhase('answer'), 1100);
    return () => clearTimeout(id);
  }, [idx]);

  const q = idx !== null ? items[idx] : null;

  return (
    <section className="relative overflow-hidden bg-[#f5f6fa] py-24 md:py-32">
      <Ambient />
      <div className="container-x relative grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        {/* left: heading + live support chat */}
        <div className="lg:sticky lg:top-36 lg:self-start">
          <SectionHeading title={t('title')} subtitle={t('subtitle')} align="start" />
          <Reveal delay={0.2} y={30} className="mt-8">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-brand/10 bg-white shadow-2xl shadow-brand/10">
              <div className="flex items-center gap-3 border-b border-brand/5 bg-gradient-to-r from-brand to-brand-500 px-5 py-4 text-white">
                <span className="relative grid size-10 place-items-center rounded-full bg-white text-xs font-black text-brand">
                  GTC
                  <span className="absolute -bottom-0.5 -end-0.5 size-3 rounded-full border-2 border-white bg-green-400" />
                </span>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{t('chatAgent')}</div>
                  <div className="text-xs text-white/70">{t('online')}</div>
                </div>
                <Headphones className="size-5 text-white/70" />
              </div>
              <div className="flex min-h-[250px] flex-col gap-3 bg-[#f8f9fc] p-5">
                <Bubble side="agent">{t('chatHello')}</Bubble>
                <AnimatePresence mode="popLayout">
                  {q && (
                    <motion.div key={`q-${idx}`} layout initial={{ opacity: 0, y: 12, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl rounded-ee-md bg-brand px-4 py-2.5 text-sm text-white shadow-md shadow-brand/20">{q.q}</div>
                    </motion.div>
                  )}
                  {q && phase === 'typing' && (
                    <motion.div key={`t-${idx}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex w-fit items-center gap-1 rounded-2xl rounded-es-md bg-white px-4 py-3 shadow-sm" aria-label={t('chatTyping')}>
                      {[0, 1, 2].map((k) => (
                        <motion.span key={k} className="size-1.5 rounded-full bg-brand/50" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: k * 0.12 }} />
                      ))}
                    </motion.div>
                  )}
                  {q && phase === 'answer' && (
                    <motion.div key={`a-${idx}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <Bubble side="agent">{q.a.split('. ')[0]}.</Bubble>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="grid grid-cols-3 border-t border-brand/5 text-center">
                {[
                  [Clock, t('supportHours')],
                  [Languages, t('languages')],
                  [Headphones, t('contact')]
                ].map(([Icon, label], k) => (
                  <a key={label} href="#" className={cn('flex flex-col items-center gap-1 px-2 py-3 text-xs font-medium text-ink/60 transition-colors hover:bg-brand-50 hover:text-brand', k > 0 && 'border-s border-brand/5')}>
                    <Icon className="size-4 text-gold" /> {label}
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* right: question cards */}
        <Stagger stagger={0.08}>
          <Accordion type="single" collapsible value={open} onValueChange={setOpen} className="space-y-3">
            {items.map((it, i) => (
              <StaggerItem key={it.q} variants={{ hidden: { opacity: 0, x: 40 }, show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } } }}>
                <AccordionItem
                  value={`q${i}`}
                  className="group/item relative overflow-hidden rounded-2xl border border-brand/10 bg-white px-5 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand/10 data-[state=open]:border-brand/20 data-[state=open]:shadow-2xl data-[state=open]:shadow-brand/15 md:px-6"
                >
                  <span className="absolute inset-y-0 start-0 w-1 origin-top scale-y-0 bg-gradient-to-b from-gold to-brand transition-transform duration-500 group-data-[state=open]/item:scale-y-100" />
                  <AccordionTrigger className="text-ink hover:text-brand" iconClassName="border-brand/15 text-brand group-data-[state=open]:border-brand group-data-[state=open]:bg-brand group-data-[state=open]:text-white">
                    <span className="flex items-center gap-4">
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-xs font-bold tabular-nums text-brand transition-colors group-data-[state=open]/item:bg-gold group-data-[state=open]/item:text-white">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {it.q}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="ps-[3.25rem] text-ink/60">{it.a}</AccordionContent>
                </AccordionItem>
              </StaggerItem>
            ))}
          </Accordion>
          <Reveal delay={0.3} className="mt-6">
            <Button size="lg" as="a" href="#">
              {t('contact')} <ArrowRight className="rtl:-scale-x-100" />
            </Button>
          </Reveal>
        </Stagger>
      </div>
    </section>
  );
}

function Bubble({ side, children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={cn('flex', side === 'agent' ? 'justify-start' : 'justify-end')}>
      <div className="max-w-[85%] rounded-2xl rounded-es-md bg-white px-4 py-2.5 text-sm leading-relaxed text-ink/80 shadow-sm">{children}</div>
    </motion.div>
  );
}
