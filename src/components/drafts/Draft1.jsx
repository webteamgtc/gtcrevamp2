'use client';
/**
 * DRAFT 1 — LIGHT · "Clarity"
 * White + soft-gray surfaces, navy (#293b93) structure, gold (#b68756) highlights.
 */
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, ArrowUpRight, Check, Download, Zap, Quote, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../shared/Header';
import Footer from '../shared/Footer';
import { Button } from '../ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { FEATURE_ICONS, MARKET_ICONS, LinkedInIcon } from '../shared/icons';
import { useTicker, FlashPrice, Sparkline, SymbolBadge, UpDown, fmt, TICKER_GROUPS } from '../shared/ticker';
import { CandleChart, DeviceFor } from '../shared/devices';
import GtcGoPhone, { StoreBadges } from '../shared/GtcGoPhone';
import { MarketsExplorer, PlatformsStage, FaqSupport } from './draft1/sections';
import { SectionHeading, Portrait, RegisterForm, Steps, HeadingStyle, Ambient } from '../shared/blocks';
import {
  Reveal,
  Stagger,
  StaggerItem,
  WordReveal,
  TextGenerate,
  CountUp,
  Marquee,
  TiltCard,
  SpotlightCard,
  Magnetic,
  Parallax,
  MaskReveal,
  ScrollProgress,
  EASE
} from '../motion';
import { cn } from '@/lib/utils';

export default function Draft1() {
  return (
    <div className="overflow-x-clip bg-white">
      <ScrollProgress />
      <HeadingStyle.Provider value="pill">
      <Header theme="light" variant="floating" />
      <main>
        <Hero />
        <Features />
        <MarketsExplorer />
        <Stats />
        <PlatformsStage />
        <Accounts />
        <Leaders />
        <FaqSupport />
        <Register />
      </main>
      <Footer theme="light" />
      </HeadingStyle.Provider>
    </div>
  );
}

/* ------------------------------------------------------------------ HERO */
function Hero() {
  const t = useTranslations('hero');
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const phoneRotate = useTransform(scrollYProgress, [0, 1], [-6, 4]);
  const gold = useTicker(0);

  return (
    <section ref={ref} className="relative overflow-hidden pt-36 md:pt-40">
      <div className="bg-grid-light mask-radial absolute inset-0" />
      <motion.div className="absolute -start-40 top-20 size-[520px] rounded-full bg-brand-200/50 blur-[120px]" animate={{ x: [0, 60, 0], y: [0, 40, 0] }} transition={{ duration: 14, repeat: Infinity }} />
      <motion.div className="absolute -end-20 top-40 size-[420px] rounded-full bg-gold-200/60 blur-[120px]" animate={{ x: [0, -50, 0], y: [0, 60, 0] }} transition={{ duration: 16, repeat: Infinity }} />

      <div className="container-x relative grid items-center gap-12 pb-14 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-brand/10 bg-white px-3 py-1.5 text-xs font-semibold text-brand shadow-sm"
          >
            <span className="grid size-5 place-items-center rounded-full bg-gold text-white">
              <Sparkles className="size-3" />
            </span>
            {t('appBadge')}
          </motion.span>

          <h1 className="mt-6 text-[2.3rem] font-bold leading-[1.08] tracking-[-0.03em] text-ink sm:text-5xl lg:text-[3.4rem]">
            <WordReveal text={t('titleA')} immediate delay={0.15} />
            <br />
            <WordReveal text={t('titleB')} immediate delay={0.35} wordClassName="text-gradient-brand" />
          </h1>

          <Reveal delay={0.6} y={16}>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-ink/60 md:text-lg">{t('subtitle')}</p>
          </Reveal>

          <Reveal delay={0.75} y={16} className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Button size="lg" as="a" href="#register">
                {t('ctaLive')} <ArrowRight className="rtl:-scale-x-100" />
              </Button>
            </Magnetic>
            <Magnetic>
              <Button size="lg" variant="outline" as="a" href="#register">
                {t('ctaDemo')}
              </Button>
            </Magnetic>
          </Reveal>

          <Stagger className="mt-9 grid max-w-md grid-cols-3 gap-3" delay={0.9}>
            {[
              [t('spreadLabel'), '0.0', 'pips'],
              [t('leverageLabel'), '1:2000', ''],
              [t('executionLabel'), '<10', 'ms']
            ].map(([l, v, u]) => (
              <StaggerItem key={l} className="rounded-2xl border border-brand/10 bg-white/70 p-3 backdrop-blur transition-transform hover:-translate-y-1">
                <div className="text-[11px] text-ink/50">{l}</div>
                <div dir="ltr" className="mt-1 text-lg font-bold text-brand rtl:text-end">
                  {v}
                  <span className="ms-0.5 text-xs font-semibold text-gold">{u}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        {/* GTC Go app advert */}
        <div className="relative mx-auto flex h-[600px] w-full max-w-[520px] items-center justify-center">
          {/* pulsing rings */}
          {[340, 460, 580].map((d, k) => (
            <motion.div
              key={d}
              className="absolute rounded-full border border-brand/10"
              style={{ width: d, height: d }}
              animate={{ scale: [1, 1.04, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 4, delay: k * 0.7, repeat: Infinity }}
            />
          ))}
          {/* orbiting market icons */}
          <motion.div dir="ltr" className="absolute size-[460px]" animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}>
            {MARKET_ICONS.slice(0, 6).map((Icon, k) => {
              const a = (k / 6) * Math.PI * 2;
              return (
                <motion.span
                  key={k}
                  className="absolute grid size-11 place-items-center rounded-2xl border border-brand/10 bg-white text-brand shadow-lg shadow-brand/10"
                  style={{ left: `calc(50% + ${Math.cos(a) * 230}px - 22px)`, top: `calc(50% + ${Math.sin(a) * 230}px - 22px)` }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                >
                  <Icon className="size-5" />
                </motion.span>
              );
            })}
          </motion.div>

          <motion.div
            style={{ y: phoneY, rotate: phoneRotate }}
            initial={{ opacity: 0, y: 80, rotate: -12 }}
            animate={{ opacity: 1, y: 0, rotate: -6 }}
            transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
            className="relative z-10"
          >
            <GtcGoPhone />
          </motion.div>

          {/* floating live price */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1, duration: 0.8, ease: EASE }} className="absolute start-0 top-20 z-20 md:-start-6">
            <div className="animate-float rounded-2xl border border-white/60 bg-white/90 p-3.5 shadow-2xl shadow-brand/15 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <SymbolBadge symbol={gold[0].s} />
                <div>
                  <div className="text-xs font-semibold text-ink/50">{gold[0].s}</div>
                  <div className="flex items-center gap-1 font-bold text-ink">
                    <FlashPrice value={gold[0].bid} decimals={2} dir={gold[0].dir} tick={gold[0].tick} />
                    <UpDown dir={gold[0].dir} />
                  </div>
                </div>
              </div>
              <Sparkline data={gold[0].hist} up={gold[0].dir > 0} className="mt-2 w-full" width={150} height={30} />
            </div>
          </motion.div>

          {/* execution badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4, type: 'spring', stiffness: 200, damping: 14 }}
            className="absolute bottom-24 end-0 z-20 flex items-center gap-3 rounded-full bg-brand px-4 py-2.5 text-white shadow-xl shadow-brand/40 md:-end-4"
          >
            <span className="relative grid size-7 place-items-center rounded-full bg-gold">
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-gold" />
              <Zap className="relative size-3.5" />
            </span>
            <span className="text-sm font-semibold">
              <bdi>&lt;10ms</bdi> {t('executionLabel')}
            </span>
          </motion.div>

          <Reveal delay={1.6} y={20} className="absolute -bottom-2 z-20">
            <StoreBadges />
          </Reveal>
        </div>
      </div>

      <TickerPanel />
    </section>
  );
}

function TickerPanel() {
  const t = useTranslations('hero');
  const tabs = t.raw('tabs');
  const [tab, setTab] = useState(0);
  const rows = useTicker(tab);

  useEffect(() => {
    const id = setInterval(() => setTab((x) => (x + 1) % tabs.length), 9000);
    return () => clearInterval(id);
  }, []);

  return (
    <Reveal delay={0.2} className="container-x relative z-10 pb-10">
      <div className="rounded-[2rem] border border-brand/10 bg-white/90 p-4 shadow-2xl shadow-brand/10 backdrop-blur-xl md:p-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-up opacity-70" />
              <span className="relative inline-flex size-2.5 rounded-full bg-up" />
            </span>
            {t('liveLabel')}
          </div>
          <div className="no-scrollbar flex max-w-full gap-1 overflow-x-auto rounded-full bg-[#f3f4f8] p-1">
            {tabs.map((label, i) => (
              <button key={label} onClick={() => setTab(i)} className={cn('relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors', tab === i ? 'text-white' : 'text-ink/60 hover:text-ink')}>
                {tab === i && <motion.span layoutId="d1-tab" className="absolute inset-0 rounded-full bg-brand shadow-lg shadow-brand/30" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
                <span className="relative">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial="h"
            animate="s"
            exit={{ opacity: 0, y: -10 }}
            variants={{ h: {}, s: { transition: { staggerChildren: 0.07 } } }}
            className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            {rows.map((r) => (
              <motion.div
                key={r.s}
                variants={{ h: { opacity: 0, y: 20, scale: 0.96 }, s: { opacity: 1, y: 0, scale: 1 } }}
                whileHover={{ y: -4 }}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-brand/5 bg-[#f7f8fc] p-4 transition-shadow hover:shadow-lg hover:shadow-brand/10"
              >
                <div className="flex items-center gap-3">
                  <SymbolBadge symbol={r.s} />
                  <div>
                    <div className="font-semibold text-ink">{r.s}</div>
                    <div className="text-xs text-ink/50">{r.n}</div>
                  </div>
                </div>
                <div className="text-end">
                  <div className="flex items-center justify-end gap-1 font-bold">
                    <FlashPrice value={r.bid} decimals={r.d} dir={r.dir} tick={r.tick} />
                    <UpDown dir={r.dir} />
                  </div>
                  <div className="text-[11px] tabular-nums">
                    <span className="text-down">{fmt(r.bid, r.d)}</span>
                    <span className="text-ink/30"> / </span>
                    <span className="text-up">{fmt(r.ask, r.d)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        <p className="mt-3 text-center text-[11px] text-ink/40">{t('pricesNote')}</p>
      </div>
    </Reveal>
  );
}

/* -------------------------------------------------------------- FEATURES */
function Features() {
  const t = useTranslations('features');
  const items = t.raw('items');
  const layout = ['', 'md:col-span-2 md:row-span-1 lg:col-span-1 lg:row-span-2', '', '', '', 'md:col-span-2 lg:col-span-3'];
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <Ambient />
      <div className="container-x relative">
        <SectionHeading title={t('titleA')} titleB={t('titleB')} subtitle={t('subtitle')} />
        <Stagger className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
          {items.map((it, i) => {
            const Icon = FEATURE_ICONS[i];
            const hero = i === 1;
            return (
              <StaggerItem key={it.title} className={layout[i]}>
                <SpotlightCard
                  color={hero ? 'rgba(182,135,86,0.35)' : 'rgba(41,59,147,0.10)'}
                  className={cn(
                    'h-full min-h-[230px] rounded-[1.75rem] border p-7 transition-all duration-500 hover:-translate-y-1.5',
                    i === 5 && 'lg:min-h-0',
                    hero
                      ? 'border-brand bg-gradient-to-br from-brand via-brand-700 to-brand-900 text-white shadow-2xl shadow-brand/30'
                      : 'border-brand/10 bg-white hover:border-brand/25 hover:shadow-2xl hover:shadow-brand/10'
                  )}
                >
                  {hero && <div className="bg-grid-dark absolute inset-0 opacity-60" />}
                  <div className={cn('relative flex h-full flex-col', i === 5 && 'lg:flex-row lg:items-center lg:gap-10')}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={cn('text-xs font-medium', hero ? 'text-white/60' : 'text-ink/45')}>{it.eyebrow}</p>
                        <h3 className={cn('mt-1.5 font-semibold', hero ? 'text-2xl md:text-3xl' : 'text-xl text-ink')}>{it.title}</h3>
                      </div>
                      <motion.span
                        whileHover={{ rotate: 12, scale: 1.1 }}
                        className={cn('grid size-12 shrink-0 place-items-center rounded-2xl', hero ? 'bg-white/10 text-gold-200' : 'bg-brand-50 text-brand')}
                      >
                        <Icon className="size-6" />
                      </motion.span>
                    </div>

                    {hero && (
                      <div className="my-8 flex flex-1 flex-col items-center justify-center">
                        <LeverageGauge />
                      </div>
                    )}

                    <p className={cn('mt-auto pt-6 leading-relaxed', i === 5 && 'lg:order-first lg:hidden', hero ? 'text-white/75' : 'text-ink/60')}>{it.text}</p>
                    {i === 5 && <p className="hidden max-w-2xl leading-relaxed text-ink/60 lg:block">{it.text}</p>}
                  </div>
                </SpotlightCard>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

function LeverageGauge() {
  const t = useTranslations('features');
  const R = 90;
  const C = Math.PI * R;
  return (
    <div className="relative w-full max-w-[280px]">
      <svg viewBox="0 0 220 120" className="w-full">
        <path d="M20 110 A90 90 0 0 1 200 110" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="14" strokeLinecap="round" />
        <motion.path
          d="M20 110 A90 90 0 0 1 200 110"
          fill="none"
          stroke="url(#gg)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          whileInView={{ strokeDashoffset: C * 0.04 }}
          viewport={{ once: true }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        />
        <defs>
          <linearGradient id="gg" x1="0" x2="1">
            <stop offset="0%" stopColor="#8390d4" />
            <stop offset="100%" stopColor="#d2a67a" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-x-0 bottom-0 text-center">
        <div className="text-4xl font-bold tracking-tight">
          1:<CountUp value={2000} />
        </div>
        <div className="text-xs uppercase tracking-[0.2em] text-white/50">{t('maxLeverage')}</div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- STATS */
function Stats() {
  const t = useTranslations('stats');
  const items = t.raw('items');
  const symbols = TICKER_GROUPS.flat();
  return (
    <section className="relative py-20">
      <Marquee className="mask-fade-x mb-12" duration={50} gap="2.5rem">
        {symbols.map((s) => (
          <span key={s.s} className="flex items-center gap-2 text-sm font-semibold text-ink/35">
            <span className="size-1.5 rounded-full bg-gold" /> {s.s}
          </span>
        ))}
      </Marquee>
      <div className="container-x">
        <Reveal y={30} scale={0.96}>
          <div className="relative grid grid-cols-2 overflow-hidden rounded-[2.5rem] border border-brand/10 bg-[#f3f4f8] md:grid-cols-4 md:rounded-full">
            <motion.div
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent"
              animate={{ x: ['-100%', '400%'] }}
              transition={{ duration: 5, repeat: Infinity, repeatDelay: 2 }}
            />
            {items.map((s, i) => (
              <div key={s.label} className={cn('relative px-6 py-10 text-center', i > 0 && 'md:border-s md:border-brand/10')}>
                <div className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
                  <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
                </div>
                <div className="mt-2 text-sm text-ink/55">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- ACCOUNTS */
function Accounts() {
  const t = useTranslations('accounts');
  const [compare, setCompare] = useState(false);
  const keys = ['minDeposit', 'spreads', 'commission', 'leverage', 'lot'];
  const accs = ['standard', 'ecn'];
  return (
    <section className="relative overflow-hidden bg-[#f5f6fa] py-24 md:py-32">
      <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="container-x relative">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
        <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-2">
          {accs.map((a, idx) => {
            const rec = a === 'standard';
            return (
              <Reveal key={a} delay={idx * 0.15} y={40}>
                <TiltCard max={5} className="group h-full rounded-[2rem]">
                  <div className={cn('relative h-full rounded-[2rem] p-8 md:p-10', rec ? 'border-beam bg-white shadow-2xl shadow-brand/15' : 'border border-brand/10 bg-white')}>
                    <div className="flex items-start justify-between">
                      <h3 className="text-2xl font-bold text-ink">{t(`${a}.name`)}</h3>
                      {rec && (
                        <motion.span initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', delay: 0.4 }} className="rounded-full bg-brand px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                          {t('recommended')}
                        </motion.span>
                      )}
                    </div>
                    <p className="mt-3 min-h-[72px] leading-relaxed text-ink/60">{t(`${a}.desc`)}</p>
                    <Stagger className="mt-6" stagger={0.08}>
                      {keys.map((k) => (
                        <StaggerItem key={k} variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0 } }} className="flex items-center justify-between border-b border-dashed border-brand/15 py-4">
                          <span className="text-ink/55">{t(`labels.${k}`)}</span>
                          <span className="font-bold text-ink">{t(`${a}.${k}`)}</span>
                        </StaggerItem>
                      ))}
                    </Stagger>
                    <Button className="mt-8 w-full" size="lg" variant={rec ? 'primary' : 'outline'} as="a" href="#register">
                      {t('open')}
                    </Button>
                  </div>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
        <div className="mt-10 text-center">
          <Button variant="outline" size="lg" onClick={() => setCompare((c) => !c)}>
            {t('compare')}
            <motion.span animate={{ rotate: compare ? 45 : 0 }}>+</motion.span>
          </Button>
        </div>
        <AnimatePresence>
          {compare && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: EASE }} className="mx-auto mt-8 max-w-3xl overflow-hidden">
              <div className="overflow-hidden rounded-3xl border border-brand/10 bg-white">
                <div className="grid grid-cols-3 bg-brand px-6 py-4 text-sm font-semibold text-white">
                  <span />
                  <span className="text-center">{t('standard.name')}</span>
                  <span className="text-center">{t('ecn.name')}</span>
                </div>
                {keys.map((k, i) => (
                  <motion.div key={k} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.06 }} className="grid grid-cols-3 border-t border-brand/5 px-6 py-4 text-sm odd:bg-[#f9fafc]">
                    <span className="text-ink/60">{t(`labels.${k}`)}</span>
                    <span className="text-center font-semibold">{t(`standard.${k}`)}</span>
                    <span className="text-center font-semibold">{t(`ecn.${k}`)}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- LEADERS */
function Leaders() {
  const t = useTranslations('leaders');
  const people = [
    { k: 'ceo', initials: 'CEO', tone: 'brand' },
    { k: 'gm', initials: 'GM', tone: 'gold' }
  ];
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <Ambient />
      <div className="container-x relative">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
        <div className="mx-auto mt-16 grid max-w-6xl gap-8 md:grid-cols-2">
          {people.map((p, i) => (
            <Reveal key={p.k} delay={i * 0.15} y={50}>
              <div className="group relative overflow-hidden rounded-[2.25rem] border border-brand/10 bg-white p-3 shadow-xl shadow-brand/5 transition-shadow duration-500 hover:shadow-2xl hover:shadow-brand/15">
                <MaskReveal className="relative aspect-[4/3.4] overflow-hidden rounded-[1.75rem]" from={i === 0 ? 'left' : 'right'}>
                  <div className="h-full w-full transition-transform duration-[1.2s] group-hover:scale-105">
                    <Portrait initials={p.initials} tone={p.tone} />
                  </div>
                </MaskReveal>
                <div className="relative -mt-20 mx-4 rounded-[1.5rem] border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-xl md:mx-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-ink">{t(`${p.k}.name`)}</h3>
                      <p className="mt-1 text-sm font-semibold uppercase tracking-[0.16em] text-gold">{t(`${p.k}.role`)}</p>
                    </div>
                    <a href="#" aria-label={t(`${p.k}.linkedin`)} className="grid size-10 place-items-center rounded-full bg-brand-50 text-brand transition hover:bg-brand hover:text-white">
                      <LinkedInIcon className="size-4" />
                    </a>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <Quote className="size-6 shrink-0 text-gold/60 rtl:-scale-x-100" />
                    <TextGenerate text={t(`${p.k}.quote`)} className="leading-relaxed text-ink/70" />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- REGISTER */
function Register() {
  const t = useTranslations('register');
  return (
    <section id="register" className="relative py-24 md:py-32">
      <div className="container-x">
        <Reveal y={40} scale={0.97}>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand via-brand-700 to-brand-950 p-8 md:p-14">
            <div className="bg-grid-dark absolute inset-0 opacity-60" />
            <motion.div className="absolute -end-20 -top-20 size-96 rounded-full bg-gold/30 blur-[100px]" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity }} />
            <div className="relative grid items-center gap-12 lg:grid-cols-2">
              <div className="text-white">
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-200">{t('eyebrow')}</span>
                <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight md:text-5xl">
                  <WordReveal text={t('title')} />
                </h2>
                <p className="mt-5 max-w-md text-lg text-white/70">{t('subtitle')}</p>
                <Steps dark />
              </div>
              <div className="rounded-[2rem] bg-white p-6 shadow-2xl md:p-8">
                <RegisterForm />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
