'use client';
/**
 * DRAFT 1 — LIGHT · "Clarity"
 * White + soft-gray surfaces, navy (#293b93) structure, gold (#b68756) highlights.
 */
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, ArrowUpRight, Check, Download, Headphones, Zap, Quote, SlidersHorizontal, Sparkles, Wallet, Scale,Plus, X } from 'lucide-react';
import Header from '../shared/Header';
import Footer from '../shared/Footer';
import { Button } from '../ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { FEATURE_ICONS, MARKET_ICONS, LinkedInIcon } from '../shared/icons';
import { useTicker, FlashPrice, Sparkline, SymbolBadge, UpDown, fmt, TICKER_GROUPS } from '../shared/ticker';
import GtcGoPhone, { StoreBadges } from '../shared/GtcGoPhone';
import { MarketsExplorer, PlatformsStage, FaqSupport } from './draft1/sections';
import { SectionHeading, Portrait, RegisterForm, Steps, HeadingStyle, Ambient } from '../shared/blocks';
import { CandleChart, AreaChart, DeviceFor, TabletMockup, LaptopMockup, PhoneMockup } from '../shared/devices';

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
import Image from 'next/image';

export default function Draft1() {
    return (
        <div className="overflow-x-clip bg-white">
            <ScrollProgress />
            <HeadingStyle.Provider value="pill">
                <Header theme="light" variant="floating" />
                <main>
                    <Hero />
                    <Features />
                    <Markets />
                    <Stats />
                    <Platforms />
                    <Accounts />
                    <Leaders />
                    <Faq />
                    <Register />
                </main>
                <Footer theme="dark" />
            </HeadingStyle.Provider>
        </div>
    );
}

function platformBadge(key) {
    if (key === 'gtcgo') return 'G';
    if (key === 'mt5') return '5';
    return '4';
}

const PLATFORM_DEVICES = {
    mt4: { className: 'start-[2%] bottom-[64px] z-10', node: () => <TabletMockup className="w-[300px] lg:w-[330px]" symbol="XAUUSD" price="4,158.99" seed={11} /> },
    gtcgo: {
        className: 'start-1/2 -translate-x-1/2 rtl:translate-x-1/2 bottom-[52px] z-20',
        node: () => <LaptopMockup className="w-[min(100vw-3rem,420px)] lg:w-[470px]" symbol="GBPUSD" price="1.34218" seed={21} />
    },
    mt5: { className: 'end-[3%] bottom-[40px] z-30', node: () => <PhoneMockup className="w-[158px] sm:w-[170px]" symbol="EURUSD" price="1.16035" seed={5} /> }
};

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

/* --------------------------------------------- FEATURES (white, sticky) */
function Features() {
    const t = useTranslations('features');
    const items = t.raw('items');
    return (
        <section className="relative overflow-hidden bg-white py-10 md:py-16">
            <Ambient />
            <div className="container-x relative grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
                <div className="lg:sticky lg:top-36 lg:self-start">
                    <SectionHeading title={t('titleA')} titleB={t('titleB')} subtitle={t('subtitle')} align="start" />
                    <Reveal delay={0.3} className="mt-10 overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand to-brand-900 p-8 text-white">
                        <div className="text-sm text-white/60">{t('maxLeverage')}</div>
                        <div className="mt-1 text-5xl font-bold tracking-tight">
                            1:<CountUp value={2000} />
                        </div>
                        <div className="mt-6 h-24">
                            <AreaChart seed={12} dark color="#d2a67a" className="h-full" />
                        </div>
                    </Reveal>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                    {items.map((it, i) => {
                        const Icon = FEATURE_ICONS[i];
                        return (
                            <Reveal key={it.title} delay={(i % 2) * 0.12} y={60} className={cn(i % 2 === 1 && 'sm:translate-y-12')}>
                                <TiltCard max={6} className="group h-full rounded-[1.75rem]">
                                    <div className="relative h-full overflow-hidden rounded-[1.75rem] border border-brand/10 bg-[#f7f8fb] p-7 transition-colors duration-500 group-hover:border-transparent group-hover:bg-brand">
                                        <span className="absolute -end-4 -top-6 text-[7rem] font-black leading-none text-brand/[0.05] transition-colors duration-500 group-hover:text-white/10">0{i + 1}</span>
                                        <span className="relative grid size-14 place-items-center rounded-2xl bg-white text-brand shadow-sm transition-all duration-500 group-hover:rotate-[-8deg] group-hover:bg-gold group-hover:text-white">
                                            <Icon className="size-6" />
                                        </span>
                                        <p className="relative mt-8 text-xs font-medium text-ink/45 transition-colors duration-500 group-hover:text-white/60">{it.eyebrow}</p>
                                        <h3 className="relative mt-1 text-xl font-semibold text-ink transition-colors duration-500 group-hover:text-white">{it.title}</h3>
                                        <p className="relative mt-3 leading-relaxed text-ink/60 transition-colors duration-500 group-hover:text-white/75">{it.text}</p>
                                    </div>
                                </TiltCard>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

/* -------------------------------------- MARKETS (gray, expanding panels) */
function Markets() {
    const t = useTranslations('markets');
    const items = t.raw('items');
    const [active, setActive] = useState(0);
    return (
        <section className="relative bg-[#eef0f5] py-10 md:py-16">
            <div className="container-x">
                <div className="flex flex-wrap items-end justify-between gap-6">
                    <SectionHeading eyebrow={t('eyebrow')} title={t('titleA')} titleB={t('titleB')} align="start" />
                    <Reveal>
                        <Button as="a" href="#">
                            {t('cta')} <ArrowUpRight className="rtl:-scale-x-100" />
                        </Button>
                    </Reveal>
                </div>

                <Stagger className="mt-14 flex flex-col gap-3 lg:h-[460px] lg:flex-row" stagger={0.06}>
                    {items.map((it, i) => {
                        const Icon = MARKET_ICONS[i];
                        const on = active === i;
                        return (
                            <StaggerItem
                                key={it.name}
                                as="button"
                                onMouseEnter={() => setActive(i)}
                                onFocus={() => setActive(i)}
                                onClick={() => setActive(i)}
                                className={cn(
                                    'group relative overflow-hidden rounded-[1.75rem] text-start transition-[flex-grow,background-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:min-w-[76px]',
                                    on ? 'bg-brand text-white lg:flex-[5]' : 'bg-white text-ink hover:bg-white/70 lg:flex-1'
                                )}
                            >
                                {on && <div className="bg-grid-dark absolute inset-0 opacity-50" />}
                                {on && <motion.div layoutId="d3-mk-glow" className="absolute -bottom-20 -end-20 size-72 rounded-full bg-gold/40 blur-3xl" />}
                                <div className="relative flex h-full flex-col p-6">
                                    <span className={cn('grid size-12 place-items-center rounded-2xl transition-colors', on ? 'bg-gold text-white' : 'bg-brand-50 text-brand')}>
                                        <Icon className="size-6" />
                                    </span>
                                    {/* collapsed vertical label (desktop) */}
                                    <span className={cn('mt-6 hidden whitespace-nowrap text-lg font-semibold lg:block', on ? 'lg:hidden' : '[writing-mode:vertical-rl] rtl:[writing-mode:vertical-lr]')}>{it.name}</span>
                                    <span className={cn('mt-4 text-lg font-semibold lg:hidden')}>{it.name}</span>
                                    <AnimatePresence>
                                        {on && (
                                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mt-auto pt-8">
                                                <span className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-200">{it.name}</span>
                                                <h3 className="mt-2 text-xl font-bold md:text-2xl">{it.title}</h3>
                                                <p className="mt-3 max-w-md text-white/70">{it.text}</p>
                                                <div className="mt-5 hidden h-20 max-w-md lg:block">
                                                    <CandleChart n={30} seed={i + 40} dark className="h-full" />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
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

/* ------------------------------------------------------- STATS (navy) */
function Stats() {
    const t = useTranslations('stats');
    const items = t.raw('items');
    return (
        <section className="relative overflow-hidden bg-brand py-10 text-white">
            <div className="bg-dots-dark absolute inset-0 opacity-50" />
            <svg dir="ltr" className="absolute inset-x-0 bottom-0 h-full w-full opacity-30" viewBox="0 0 1440 300" preserveAspectRatio="none" aria-hidden>
                {[0, 1, 2].map((k) => (
                    <motion.path
                        key={k}
                        d={`M0 ${200 + k * 25} C 240 ${120 + k * 30}, 480 ${260 - k * 20}, 720 ${180 + k * 15} S 1200 ${100 + k * 30}, 1440 ${160 + k * 20}`}
                        fill="none"
                        stroke={k === 1 ? '#d2a67a' : '#8390d4'}
                        strokeWidth="1.5"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 2.5, delay: k * 0.3 }}
                    />
                ))}
            </svg>
            <div className="container-x relative">
                <Stagger className="grid grid-cols-2 gap-8 lg:grid-cols-4" stagger={0.12}>
                    {items.map((s) => (
                        <StaggerItem key={s.label} className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur transition-colors hover:bg-white/10">
                            <div className="text-3xl font-bold tracking-tight md:text-4xl xl:text-[2.6rem] lg:whitespace-nowrap">
                                <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
                            </div>
                            <div className="mt-2 text-sm text-white/65">{s.label}</div>
                        </StaggerItem>
                    ))}
                </Stagger>
            </div>
        </section>
    );
}

/* ------------------------------------------------------- PLATFORMS (tabs) */
function Platforms() {
    const t = useTranslations('platforms');
    const items = t.raw('items');
    const features = t.raw('features');
    const perks = t.raw('perks');
    const [i, setI] = useState(0);
    const [paused, setPaused] = useState(false);
    const DURATION = 6500;
  
    useEffect(() => {
      if (paused) return;
      const id = setTimeout(() => setI((x) => (x + 1) % items.length), DURATION);
      return () => clearTimeout(id);
    }, [i, paused, items.length]);
  
    const it = items[i];
    return (
      <section className="relative overflow-hidden bg-white py-10 text-ink md:py-16">
        <div className="bg-dots-light mask-radial pointer-events-none absolute inset-0 opacity-30" />
        <Ambient tone="light" />
        <div className="container-x relative">
          <SectionHeading index={3} eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
  
          <Reveal y={24} className="relative mt-14 overflow-hidden rounded-[2rem] border border-brand/10 bg-[#f7f8fc] shadow-xl shadow-brand/[0.06]">
            <div className="absolute -end-24 -top-24 size-72 rounded-full bg-gold-100/80 blur-3xl" aria-hidden />
            <div className="absolute -start-20 bottom-0 size-64 rounded-full bg-brand-100/60 blur-3xl" aria-hidden />
  
            <div className="relative border-b border-brand/5 px-5 py-6 md:px-8 md:py-7">
              <div className="mx-auto flex w-fit max-w-full gap-1 overflow-x-auto rounded-full bg-[#f4f5fa] p-1.5 no-scrollbar">
                {items.map((x, k) => (
                  <button
                    key={x.key}
                    type="button"
                    onClick={() => setI(k)}
                    className={cn(
                      'relative overflow-hidden whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-colors',
                      i === k ? 'text-white' : 'text-ink/55 hover:text-ink'
                    )}
                  >
                    {i === k && (
                      <motion.span layoutId="d4-plat" className="absolute inset-0 rounded-full bg-brand shadow-md shadow-brand/25" transition={{ type: 'spring', stiffness: 380, damping: 30 }}>
                        {!paused && (
                          <motion.span
                            key={`plat-progress-${i}`}
                            className="absolute inset-y-0 start-0 bg-white/20"
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: DURATION / 1000, ease: 'linear' }}
                          />
                        )}
                      </motion.span>
                    )}
                    <span className="relative">{x.brand}</span>
                  </button>
                ))}
              </div>
            </div>
  
            <div className="relative grid lg:grid-cols-[min(100%,380px)_1fr]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
              <div className="relative border-b border-brand/5 p-6 md:p-8 lg:border-b-0 lg:border-e lg:pe-8">
                <AnimatePresence mode="wait">
                  <motion.div key={it.key} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.45, ease: EASE }}>
                    <span className="inline-flex items-center gap-2 rounded-full border border-brand/10 bg-[#f7f8fc] px-3 py-1.5 text-xs font-semibold text-brand">
                      <span className="grid size-5 place-items-center rounded-full bg-gradient-to-br from-gold to-gold-600 text-[9px] font-black text-white">{platformBadge(it.key)}</span>
                      {it.brand}
                    </span>
                    <h3 className="mt-5 text-2xl font-bold tracking-tight text-ink md:text-3xl">{it.title}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-ink/60 md:text-base">{it.tagline}</p>
                    <ul className="mt-6 space-y-2.5">
                      {features.map((f, k) => (
                        <motion.li
                          key={f}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.12 + k * 0.07 }}
                          className="flex items-center gap-3 text-sm text-ink/75"
                        >
                          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand text-white shadow-sm shadow-brand/20">
                            <Check className="size-3.5" strokeWidth={2.5} />
                          </span>
                          {f}
                        </motion.li>
                      ))}
                    </ul>
                    <Button size="lg" className="mt-8 w-full sm:w-auto" as="a" href="#">
                      <Download /> {it.cta}
                    </Button>
                  </motion.div>
                </AnimatePresence>
              </div>
  
              <div className="relative min-h-[400px] overflow-hidden bg-gradient-to-b from-[#eef1fb] via-[#f4f6fc] to-white md:min-h-[520px]">
                <div className="absolute inset-x-[-18%] bottom-[-32%] h-[78%] [perspective:600px]">
                  <motion.div
                    className="h-full w-full origin-top [transform:rotateX(62deg)] [mask-image:linear-gradient(to_bottom,black,transparent_86%)]"
                    style={{
                      backgroundImage:
                        'linear-gradient(to right, rgba(41,59,147,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(41,59,147,0.12) 1px, transparent 1px)',
                      backgroundSize: '48px 48px'
                    }}
                    animate={{ backgroundPositionY: ['0px', '48px'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
                <motion.div
                  className="absolute bottom-8 h-20 w-72 rounded-[100%] bg-brand/20 blur-2xl"
                  animate={{ left: it.key === 'mt4' ? '6%' : it.key === 'gtcgo' ? '32%' : '58%' }}
                  transition={{ type: 'spring', stiffness: 90, damping: 18 }}
                />
                {perks.map((p, k) => (
                  <motion.span
                    key={p}
                    className={cn(
                      'absolute z-40 hidden items-center gap-2 rounded-full border border-brand/10 bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-brand shadow-md shadow-brand/10 md:inline-flex',
                      ['start-4 top-4', 'end-4 top-6', 'start-[38%] top-3'][k]
                    )}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 4 + k, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Sparkles className="size-3.5 text-gold" /> {p}
                  </motion.span>
                ))}
  
                <div dir="ltr" className="absolute inset-0 hidden md:block">
                  {(['mt4', 'gtcgo', 'mt5']).map((k) => {
                    const on = it.key === k;
                    const idx = items.findIndex((x) => x.key === k);
                    const dev = PLATFORM_DEVICES[k];
                    return (
                      <motion.button
                        key={k}
                        type="button"
                        onClick={() => setI(idx)}
                        className={cn('absolute origin-bottom', dev.className, on && 'z-40')}
                        animate={{
                          scale: on ? 1.05 : 0.88,
                          opacity: on ? 1 : 0.5,
                          filter: on ? 'blur(0px) saturate(1)' : 'blur(1px) saturate(0.75)',
                          y: on ? -8 : 0
                        }}
                        whileHover={{ opacity: 0.92 }}
                        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                        aria-label={items[idx].brand}
                      >
                        <div className={cn(on && 'animate-float')}>{dev.node()}</div>
                      </motion.button>
                    );
                  })}
                </div>
  
                <div className="absolute inset-0 flex items-end justify-center pb-10 md:hidden">
                  <AnimatePresence mode="wait">
                    <motion.div key={it.key} initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.45, ease: EASE }}>
                      {it.key === 'mt5' ? (
                        <PhoneMockup className="w-[180px]" symbol="EURUSD" price="1.16035" seed={5} />
                      ) : it.key === 'mt4' ? (
                        <TabletMockup className="w-[min(100vw-2.5rem,320px)]" symbol="XAUUSD" price="4,158.99" seed={11} />
                      ) : (
                        <LaptopMockup className="w-[min(100vw-2.5rem,340px)]" symbol="GBPUSD" price="1.34218" seed={21} />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

const ACCOUNT_KEYS = ['minDeposit', 'spreads', 'commission', 'leverage', 'lot'];
const ACCOUNT_DETAIL_KEYS = ['minDeposit', 'leverage', 'lot'];
const ACCOUNT_DETAIL_ICONS = [Wallet, Scale, SlidersHorizontal];

function AccountsCompareDialog({ open, onOpenChange, t, items, labels }) {
    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.button
                        type="button"
                        aria-label="Close"
                        className="fixed inset-0 z-[80] bg-ink/45 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => onOpenChange(false)}
                    />
                    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="accounts-compare-title"
                            className="pointer-events-auto max-h-[min(85vh,640px)] w-full max-w-3xl overflow-hidden rounded-[1.75rem] border border-brand/10 bg-white shadow-2xl shadow-brand/20"
                            initial={{ opacity: 0, y: 24, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 16, scale: 0.98 }}
                            transition={{ duration: 0.35, ease: EASE }}
                        >
                            <div className="border-b border-brand/10 px-6 py-5 md:px-8">
                                <h2 id="accounts-compare-title" className="text-xl font-bold text-ink">
                                    {t('compare')}
                                </h2>
                                <p className="mt-1 text-sm text-ink/60">{t('subtitle')}</p>
                            </div>
                            <div className="overflow-x-auto px-4 py-4 md:px-6">
                                <table className="w-full min-w-[480px] border-collapse text-sm">
                                    <thead>
                                        <tr className="border-b border-brand/10">
                                            <th scope="col" className="pb-3 pe-4 text-start font-semibold text-ink/50">
                                                <span className="sr-only">{t('compare')}</span>
                                            </th>
                                            {items.map((item) => (
                                                <th scope="col" key={item.id} className="pb-3 px-3 text-center font-bold text-brand">
                                                    {item.name}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {labels.map((label) => (
                                            <tr key={label} className="border-b border-brand/5 last:border-0">
                                                <th scope="row" className="py-3.5 pe-4 text-start font-medium text-ink/55">
                                                    {label}
                                                </th>
                                                {items.map((item) => (
                                                    <td key={item.id + label} className="px-3 py-3.5 text-center font-semibold text-ink">
                                                        <bdi>{item.values[label]}</bdi>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="border-t border-brand/10 px-6 py-5 md:px-8">
                                <Button size="lg" className="w-full sm:w-auto" as="a" href="#register" onClick={() => onOpenChange(false)}>
                                    {t('open')}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

/* ------------------------------------------------- ACCOUNTS (pricing cards) */
function Accounts() {
    const t = useTranslations('accounts');
    const [compare, setCompare] = useState(false);
    const accIds = ['standard', 'ecn'];
    const labels = ACCOUNT_KEYS.map((k) => t(`labels.${k}`));
    const items = accIds.map((id) => ({
      id,
      name: t(`${id}.name`),
      description: t(`${id}.desc`),
      values: Object.fromEntries(ACCOUNT_KEYS.map((k) => [t(`labels.${k}`), t(`${id}.${k}`)]))
    }));
  
    return (
      <section id="accounts" className="relative overflow-hidden bg-[#eef0f5] py-10 text-ink md:py-16">
        <div className="container-x relative">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <Reveal y={16} className="max-w-xl">
              <div className="flex items-center gap-3">
                <span className="h-0.5 w-10 shrink-0 bg-gold" aria-hidden />
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/45">{t('eyebrow')}</span>
              </div>
              <h2 className="mt-5 text-balance text-3xl font-bold leading-[1.12] tracking-tight sm:text-4xl lg:text-[2.65rem]">
                {t('titleA')}
                <br />
                <span className="text-gradient-brand">{t('titleB')}</span>
              </h2>
            </Reveal>
            <Reveal y={12} delay={0.1} className="max-w-md lg:pb-1">
              <p className="text-[15px] leading-relaxed text-ink/55 md:text-base">{t('subtitle')}</p>
            </Reveal>
          </div>
  
          <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-2 md:gap-7">
            {items.map((item, i) => {
              const spreadsRaw = item.values[labels[1]] ?? '';
              const spreadParts = spreadsRaw.split(' ');
              const spreadAmount = spreadParts[0] ?? spreadsRaw;
              const spreadUnit = spreadParts.slice(1).join(' ');
              const standard = item.id === 'standard';
              return (
                <Reveal key={item.id} delay={i * 0.1} y={32}>
                  <article className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-brand/10 bg-white shadow-[0_20px_50px_-24px_rgba(41,59,147,0.35)]">
                    <div
                      className={cn(
                        'px-6 pb-7 pt-6 md:px-7 md:pt-7',
                        standard ? 'bg-brand text-white' : 'bg-[#d4d8e1] text-ink'
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span
                          className={cn(
                            'text-[11px] font-semibold uppercase tracking-[0.18em]',
                            standard ? 'text-white/55' : 'text-ink/40'
                          )}
                        >
                          0{i + 1} / GTCFX
                        </span>
                        {standard && (
                          <span className="rounded-full border border-white/70 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                            {t('recommended')}
                          </span>
                        )}
                      </div>
                      <h3 className={cn('mt-4 text-[1.65rem] font-bold leading-tight md:text-[1.75rem]', standard ? 'text-white' : 'text-ink')}>
                        {item.name}
                      </h3>
                      <p
                        className={cn(
                          'mt-2 max-w-[95%] text-[13px] leading-relaxed md:text-sm',
                          standard ? 'text-white/75' : 'text-ink/55'
                        )}
                      >
                        {item.description}
                      </p>
                      <div
                        className={cn(
                          'mt-6 grid grid-cols-2 gap-4 border-t pt-5',
                          standard ? 'border-white/15' : 'border-brand/10'
                        )}
                      >
                        <div>
                          <span className={cn('text-xs font-medium', standard ? 'text-white/55' : 'text-ink/45')}>{labels[1]}</span>
                          <div className="mt-1 flex items-baseline gap-1" dir="ltr">
                            <strong className={cn('text-[2rem] font-bold leading-none', standard ? 'text-white' : 'text-brand')}>
                              {spreadAmount}
                            </strong>
                            {spreadUnit && (
                              <span className={cn('text-sm font-medium', standard ? 'text-white/70' : 'text-gold-600')}>{spreadUnit}</span>
                            )}
                          </div>
                        </div>
                        <div className={cn('border-s ps-4', standard ? 'border-white/15' : 'border-brand/10')}>
                          <span className={cn('text-xs font-medium', standard ? 'text-white/55' : 'text-ink/45')}>{labels[2]}</span>
                          <strong
                            className={cn('mt-1 block text-[2rem] font-bold leading-none', standard ? 'text-white' : 'text-ink')}
                            dir="ltr"
                          >
                            {item.values[labels[2]]}
                          </strong>
                        </div>
                      </div>
                    </div>
  
                    <div className="flex flex-1 flex-col bg-white px-6 pb-6 pt-2 md:px-7 md:pb-7">
                      <dl className="flex-1">
                        {ACCOUNT_DETAIL_KEYS.map((key, row) => {
                          const DetailIcon = ACCOUNT_DETAIL_ICONS[row];
                          const label = t(`labels.${key}`);
                          return (
                            <div
                              key={key}
                              className="flex items-center justify-between gap-4 border-b border-brand/10 py-4 text-sm last:border-b-0"
                            >
                              <dt className="flex min-w-0 flex-1 items-center gap-2.5 font-medium text-ink/55">
                                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#f0f2f8] text-brand">
                                  <DetailIcon className="size-4" strokeWidth={1.6} />
                                </span>
                                <span className="truncate">{label}</span>
                              </dt>
                              <dd className="shrink-0 font-semibold text-ink">
                                <bdi>{item.values[label]}</bdi>
                              </dd>
                            </div>
                          );
                        })}
                      </dl>
                      <Button size="lg" className="mt-5 w-full" variant={standard ? 'primary' : 'outline'} as="a" href="#register">
                        {t('open')}
                      </Button>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
  
          <Reveal className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setCompare(true)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand underline decoration-gold decoration-2 underline-offset-[6px] transition hover:text-brand-700"
            >
              <SlidersHorizontal className="size-4" strokeWidth={2} aria-hidden />
              {t('compare')}
            </button>
          </Reveal>
        </div>
  
        <AccountsCompareDialog open={compare} onOpenChange={setCompare} t={t} items={items} labels={labels} />
      </section>
    );
  }
  
  /* ---------------------------------------------------- LEADERS (editorial) */
  function Leaders() {
    const t = useTranslations('leaders');
    const people = [{ k: 'ceo', photo: '/ceo.png' }];
    return (
      <section className="relative overflow-hidden bg-white py-10 text-ink md:py-16">
        <div className="bg-dots-light mask-radial pointer-events-none absolute inset-0 opacity-30" />
        <Ambient tone="light" />
        <div className="container-x relative">
          <SectionHeading index={5} eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
          <div className="mt-20 space-y-24">
            {people.map((p) => (
              <div key={p.k} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
                <div className="lg:pe-4">
                  <Reveal y={16}>
                    <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-700">{t(`${p.k}.role`)}</span>
                  </Reveal>
                  <h3 className="mt-4 text-3xl font-bold tracking-tight text-ink md:text-4xl">
                    <WordReveal text={t(`${p.k}.name`)} />
                  </h3>
                  <TextGenerate text={`“${t(`${p.k}.quote`)}”`} className="mt-6 text-lg font-light leading-relaxed text-ink/70 md:text-2xl" />
                  <Reveal delay={0.4} className="mt-10 flex items-center gap-4">
                    <span className="h-px w-16 bg-gold" />
                    <a
                      href="#"
                      className="inline-flex items-center gap-2 rounded-full border border-brand/15 bg-white px-4 py-2 text-sm font-semibold text-brand shadow-sm transition hover:border-gold hover:bg-gold hover:text-white"
                    >
                      <LinkedInIcon className="size-4" /> {t(`${p.k}.linkedin`)}
                    </a>
                  </Reveal>
                </div>
                <div className="relative lg:ps-4">
                  <div className="absolute -inset-4 rounded-[2.5rem] bg-brand/15 blur-2xl" aria-hidden />
                  <Parallax offset={30}>
                    <MaskReveal className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-brand/10 bg-white shadow-xl shadow-brand/10" from="circle">
                      <Image src={p.photo} alt={t(`${p.k}.name`)} fill className="object-cover object-top" sizes="(max-width: 1024px) 100vw, 560px" priority />
                    </MaskReveal>
                  </Parallax>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', delay: 0.6 }}
                    className="absolute -bottom-6 end-6 grid size-24 place-items-center rounded-full bg-gold text-white shadow-2xl shadow-gold/25"
                  >
                    <Quote className="size-10 rtl:-scale-x-100" />
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  /* ------------------------------------------------------------------- FAQ */
  function Faq() {
    const t = useTranslations('faq');
    const items = t.raw('items');
    const [active, setActive] = useState(0);
    const current = items[active];
    const total = String(items.length).padStart(2, '0');
  
    return (
      <section className="relative overflow-hidden bg-[#f5f6fa] py-10 text-ink md:py-16">
        <Ambient tone="light" />
        <div className="container-x relative">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading index={6} eyebrow={t('eyebrow')} title={t('titleA')} titleB={t('titleB')} align="start" className="max-w-xl" />
            <Reveal y={12} className="max-w-sm lg:text-end">
              <p className="text-[15px] leading-relaxed text-ink/60">{t('subtitle')}</p>
              <a href="#" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand transition hover:text-brand-700">
                <Headphones className="size-4 text-gold" strokeWidth={1.75} />
                {t('contact')}
              </a>
            </Reveal>
          </div>
  
          <div className="mt-14 grid items-start gap-8 lg:grid-cols-[min(100%,420px)_1fr] lg:gap-10">
            <Stagger className="space-y-3" stagger={0.06}>
              {items.map((it, i) => {
                const on = active === i;
                return (
                  <StaggerItem key={it.q}>
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      className={cn(
                        'group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border bg-white px-4 py-4 text-start transition-all duration-300 md:px-5 md:py-5',
                        on
                          ? 'border-brand/15 shadow-lg shadow-brand/10'
                          : 'border-brand/10 shadow-sm hover:border-brand/20 hover:shadow-md'
                      )}
                    >
                      {on && <span className="absolute inset-y-3 start-0 w-1 rounded-full bg-gradient-to-b from-gold to-gold-600" />}
                      <span
                        className={cn(
                          'grid size-10 shrink-0 place-items-center rounded-full text-xs font-bold tabular-nums transition-colors md:size-11',
                          on ? 'bg-brand text-white shadow-md shadow-brand/25' : 'border border-brand/15 bg-white text-ink/35'
                        )}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className={cn('min-w-0 flex-1 text-sm font-semibold leading-snug md:text-[15px]', on ? 'text-brand' : 'text-ink/70')}>{it.q}</span>
                      <span
                        className={cn(
                          'grid size-8 shrink-0 place-items-center rounded-full border transition-colors',
                          on ? 'border-transparent bg-brand-50 text-brand' : 'border-brand/10 text-ink/40 group-hover:border-brand/25 group-hover:text-brand'
                        )}
                        aria-hidden
                      >
                        {on ? <X className="size-4" strokeWidth={2} /> : <Plus className="size-4" strokeWidth={2} />}
                      </span>
                    </button>
                  </StaggerItem>
                );
              })}
            </Stagger>
  
            <Reveal y={24} className="min-w-0 lg:sticky lg:top-32">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="relative flex min-h-[min(520px,70vh)] flex-col overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand via-brand-700 to-brand-950 p-8 text-white shadow-2xl shadow-brand/30 md:p-10"
                >
                  <div className="bg-grid-dark absolute inset-0 opacity-40" />
                  <div className="relative flex items-start justify-between gap-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold tabular-nums text-gold md:text-6xl">{String(active + 1).padStart(2, '0')}</span>
                      <span className="text-lg font-medium text-white/35">/ {total}</span>
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">GTCFX</span>
                  </div>
                  <h3 className="relative mt-10 text-2xl font-bold leading-snug md:text-[1.65rem]">{current.q}</h3>
                  <p className="relative mt-5 flex-1 text-[15px] leading-relaxed text-white/75 md:text-base">{current.a}</p>
                  <div className="relative mt-10 flex gap-2">
                    {items.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        aria-label={`${t('questions')} ${i + 1}`}
                        onClick={() => setActive(i)}
                        className={cn('h-1 flex-1 rounded-full transition-colors', i === active ? 'bg-gold' : 'bg-white/20 hover:bg-white/35')}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </Reveal>
          </div>
        </div>
      </section>
    );
  }
  
  /* -------------------------------------------------------------- REGISTER */
  function Register() {
    const t = useTranslations('register');
    return (
      <section id="register" className="relative overflow-hidden py-10 md:py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-brand-950 to-ink" />
        <div dir="ltr" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {[300, 500, 700, 900].map((sz, i) => (
            <motion.div key={sz} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/10" style={{ width: sz, height: sz }} animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 4, delay: i * 0.6, repeat: Infinity }} />
          ))}
        </div>
        <div className="container-x relative mx-auto max-w-5xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">{t('eyebrow')}</span>
          <h2 className="mt-4 text-3xl font-bold leading-[1.1] tracking-tight md:text-5xl">
            <WordReveal text={t('title')} />
          </h2>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-5 max-w-md text-white/60">{t('subtitle')}</p>
          </Reveal>
          <div className="mx-auto max-w-2xl">
            <Steps dark />
          </div>
          <Reveal y={40} className="mt-12">
            <div className="border-beam rounded-[2rem] bg-[#10132a]/90 p-5 text-start shadow-2xl backdrop-blur-xl md:p-7">
              <RegisterForm dark wide />
            </div>
          </Reveal>
        </div>
      </section>
    );
  }
