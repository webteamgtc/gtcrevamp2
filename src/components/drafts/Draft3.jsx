'use client';
/**
 * DRAFT 3 — FUSION · light + dark + gray
 * Dark navy hero → white → gray → navy → white → black → gray → white → navy → black footer.
 */
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { ArrowRight, ArrowUpRight, Check, Download, Quote, ChevronDown } from 'lucide-react';
import Header from '../shared/Header';
import Footer from '../shared/Footer';
import { Button } from '../ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { FEATURE_ICONS, MARKET_ICONS, LinkedInIcon } from '../shared/icons';
import { useTicker, FlashPrice, Sparkline, SymbolBadge, UpDown, fmt, TICKER_GROUPS } from '../shared/ticker';
import { CandleChart, AreaChart, DeviceFor } from '../shared/devices';
import { SectionHeading, Portrait, RegisterForm, Steps, HeadingStyle, Ambient } from '../shared/blocks';
import InstrumentRing from '../shared/InstrumentRing';
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
  MaskReveal,
  ScrollProgress,
  EASE
} from '../motion';
import { cn } from '@/lib/utils';

export default function Draft3() {
  return (
    <div className="overflow-x-clip bg-white">
      <ScrollProgress />
      <HeadingStyle.Provider value="split">
      <Header theme="overlay" />
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
      <Footer theme="dark" layout="split" />
      </HeadingStyle.Provider>
    </div>
  );
}

/* ---------------------------------------------------------- HERO (dark) */
function Hero() {
  const t = useTranslations('hero');
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const ringScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);

  return (
    <section ref={ref} className="relative bg-brand-950 text-white">
      <div className="relative overflow-hidden pb-48 pt-36 md:pt-40">
        <div className="bg-grid-dark mask-radial absolute inset-0 opacity-70" />
        <motion.div className="absolute left-1/2 top-[-260px] h-[620px] w-[1000px] -translate-x-1/2 rounded-full bg-brand/60 blur-[140px]" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 8, repeat: Infinity }} />
        <motion.div className="absolute -start-20 bottom-20 size-[360px] rounded-full bg-gold/20 blur-[120px]" animate={{ x: [0, 120, 0] }} transition={{ duration: 14, repeat: Infinity }} />

        {/* animated chart line across the hero */}
        <svg dir="ltr" className="pointer-events-none absolute inset-x-0 top-[38%] h-56 w-full opacity-50" viewBox="0 0 1440 200" preserveAspectRatio="none" aria-hidden>
          <motion.path
            d="M0 160 C 120 150, 180 90, 300 110 S 480 170, 600 120 S 780 40, 900 70 S 1080 140, 1200 80 S 1380 30, 1440 40"
            fill="none"
            stroke="url(#d3line)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, delay: 0.6, ease: 'easeInOut' }}
          />
          <defs>
            <linearGradient id="d3line" x1="0" x2="1">
              <stop offset="0%" stopColor="#b68756" stopOpacity="0" />
              <stop offset="40%" stopColor="#b68756" />
              <stop offset="100%" stopColor="#8390d4" />
            </linearGradient>
          </defs>
        </svg>

        <motion.div style={{ y: textY }} className="container-x relative text-center">
          <Reveal y={10} blur={0}>
            <span className="inline-flex items-center gap-3 text-sm font-medium text-gold-200">
              <span className="h-px w-10 bg-gold" /> {t('badge')} <span className="h-px w-10 bg-gold" />
            </span>
          </Reveal>
          <h1 className="mx-auto mt-6 max-w-3xl text-[2.2rem] font-bold leading-[1.08] tracking-[-0.03em] sm:text-5xl lg:text-[3.6rem]">
            <WordReveal text={t('titleA')} immediate delay={0.15} />{' '}
            <WordReveal text={t('titleB')} immediate delay={0.35} wordClassName="text-gradient-gold" />
          </h1>
          <Reveal delay={0.6} y={16}>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">{t('subtitle')}</p>
          </Reveal>
          <Reveal delay={0.75} y={16} className="mt-8 flex flex-wrap justify-center gap-3">
            <Magnetic>
              <Button size="lg" variant="white" as="a" href="#register">
                {t('ctaLive')} <ArrowRight className="rtl:-scale-x-100" />
              </Button>
            </Magnetic>
            <Magnetic>
              <Button size="lg" variant="outlineLight" as="a" href="#register">
                {t('ctaDemo')}
              </Button>
            </Magnetic>
          </Reveal>
        </motion.div>

        <motion.div style={{ scale: ringScale }} initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.7, ease: EASE }} className="relative mt-10">
          <InstrumentRing />
          <div className="absolute inset-x-0 bottom-0 mx-auto h-16 w-2/3 rounded-[100%] bg-brand-400/30 blur-2xl" />
        </motion.div>
      </div>

      <div className="container-x relative z-10 -mt-36 pb-0">
        <TickerPanel />
      </div>
      <div className="h-16 bg-white" />
    </section>
  );
}

function TickerPanel() {
  const t = useTranslations('hero');
  const tabs = t.raw('tabs');
  const [tab, setTab] = useState(0);
  const rows = useTicker(tab);
  return (
    <Reveal y={50} delay={0.9} className="rounded-[2rem] bg-white p-4 text-ink shadow-[0_30px_80px_-20px_rgba(10,14,38,0.35)] md:p-6">
      <div className="no-scrollbar mx-auto flex w-fit max-w-full gap-6 overflow-x-auto border-b border-brand/10">
        {tabs.map((l, i) => (
          <button key={l} onClick={() => setTab(i)} className={cn('relative whitespace-nowrap px-1 pb-3 text-sm font-semibold transition-colors', tab === i ? 'text-brand' : 'text-ink/45 hover:text-ink')}>
            {l}
            {tab === i && <motion.span layoutId="d3-tab" className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-gold" />}
          </button>
        ))}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {rows.map((r, i) => (
            <motion.div
              key={`${tab}-${r.s}`}
              initial={{ opacity: 0, rotateX: -60, y: 20 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              exit={{ opacity: 0, rotateX: 60 }}
              transition={{ delay: i * 0.06, duration: 0.5, ease: EASE }}
              className="flex items-center justify-between rounded-full bg-[#f4f5f9] py-2.5 pe-5 ps-2.5 transition-shadow hover:shadow-lg hover:shadow-brand/10"
            >
              <div className="flex items-center gap-3">
                <SymbolBadge symbol={r.s} className="bg-white from-white to-white" />
                <span className="font-semibold">{r.s}</span>
              </div>
              <div className="text-end">
                <div className="flex items-center justify-end gap-1 font-bold text-up">
                  <FlashPrice value={r.bid} decimals={r.d} dir={r.dir} tick={r.tick} />
                  <UpDown dir={r.dir} />
                </div>
                <div className="text-[11px] tabular-nums">
                  <span className="text-down">{fmt(r.bid, r.d)}</span> / <span className="text-up">{fmt(r.ask, r.d)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Reveal>
  );
}

/* --------------------------------------------- FEATURES (white, sticky) */
function Features() {
  const t = useTranslations('features');
  const items = t.raw('items');
  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-32">
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
    <section className="relative bg-[#eef0f5] py-24 md:py-32">
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

/* ------------------------------------------------------- STATS (navy) */
function Stats() {
  const t = useTranslations('stats');
  const items = t.raw('items');
  return (
    <section className="relative overflow-hidden bg-brand py-20 text-white">
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

/* ------------------------------------- PLATFORMS (white, scrollytelling) */
function Platforms() {
  const t = useTranslations('platforms');
  const items = t.raw('items');
  const features = t.raw('features');
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start center', 'end center'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => setActive(Math.min(items.length - 1, Math.floor(v * items.length))));

  return (
    <section className="relative bg-white py-24 md:py-32">
      <div className="container-x">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
        <div ref={ref} className="relative mt-16 grid gap-10 lg:grid-cols-2">
          <div>
            {items.map((it, i) => (
              <div key={it.key} className="flex min-h-[70vh] items-center">
                <motion.div animate={{ opacity: active === i ? 1 : 0.25, x: active === i ? 0 : -10 }} transition={{ duration: 0.5 }} className="max-w-md">
                  <span className="text-sm font-semibold text-gold">0{i + 1} / 0{items.length}</span>
                  <h3 className="mt-3 text-2xl font-bold tracking-tight text-ink md:text-4xl">{it.title}</h3>
                  <p className="mt-4 text-lg text-ink/60">{it.tagline}</p>
                  <ul className="mt-6 space-y-2">
                    {features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-ink/70">
                        <Check className="size-4 text-gold" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Button size="lg" className="mt-8" as="a" href="#">
                    <Download /> {it.cta}
                  </Button>
                  {/* device inline on mobile */}
                  <div className="mt-10 flex justify-center lg:hidden">
                    <DeviceFor k={it.key} className={it.key === 'mt5' ? 'w-[200px]' : 'max-w-full'} />
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
          <div className="hidden lg:block">
            <div className="sticky top-[calc(50vh-260px)] flex h-[520px] items-center justify-center overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#eef0f5] to-[#f8f9fc]">
              <div className="bg-dots-light absolute inset-0 opacity-70" />
              <motion.div className="absolute size-[380px] rounded-full bg-brand-200/50 blur-3xl" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 6, repeat: Infinity }} />
              <div className="absolute inset-x-8 top-8 flex gap-2">
                {items.map((_, i) => (
                  <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-brand/10">
                    <motion.div className="h-full bg-brand" animate={{ width: i <= active ? '100%' : '0%' }} transition={{ duration: 0.5 }} />
                  </div>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={active} initial={{ opacity: 0, y: 60, scale: 0.9, rotate: -4 }} animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }} exit={{ opacity: 0, y: -60, scale: 0.9, rotate: 4 }} transition={{ duration: 0.6, ease: EASE }} className="relative">
                  <DeviceFor k={items[active].key} className={items[active].key === 'mt5' ? 'w-[230px]' : 'max-w-[460px]'} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------- ACCOUNTS (black, toggle) */
function Accounts() {
  const t = useTranslations('accounts');
  const keys = ['minDeposit', 'spreads', 'commission', 'leverage', 'lot'];
  const [acc, setAcc] = useState('standard');
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-white md:py-32">
      <div className="absolute left-1/2 top-0 size-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/40 blur-[140px]" />
      <div className="container-x relative">
        <SectionHeading dark eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
        <div className="mx-auto mt-12 flex w-fit rounded-full border border-white/10 bg-white/5 p-1.5">
          {['standard', 'ecn'].map((a) => (
            <button key={a} onClick={() => setAcc(a)} className={cn('relative rounded-full px-8 py-3 text-sm font-semibold transition-colors', acc === a ? 'text-ink' : 'text-white/60')}>
              {acc === a && <motion.span layoutId="d3-acc" className="absolute inset-0 rounded-full bg-white" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
              <span className="relative">{t(`${a}.name`)}</span>
            </button>
          ))}
        </div>

        <Reveal y={40} className="mx-auto mt-10 max-w-5xl">
          <div className="border-beam grid overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-[#161a33] to-[#0d0f1c] lg:grid-cols-[1fr_1.2fr]">
            <div className="relative p-8 md:p-12">
              <AnimatePresence mode="wait">
                <motion.div key={acc} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                  <div className="flex items-center gap-3">
                    <h3 className="text-3xl font-bold">{t(`${acc}.name`)}</h3>
                    {acc === 'standard' && <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase text-ink">{t('recommended')}</span>}
                  </div>
                  <p className="mt-4 text-white/60">{t(`${acc}.desc`)}</p>
                  <div className="mt-8 text-sm text-white/40">{t('labels.spreads')}</div>
                  <div className="text-gradient-gold text-5xl font-bold">{t(`${acc}.spreads`)}</div>
                </motion.div>
              </AnimatePresence>
              <Button size="lg" variant="gold" className="mt-10" as="a" href="#register">
                {t('open')} <ArrowRight className="rtl:-scale-x-100" />
              </Button>
            </div>
            <div className="border-t border-white/10 p-8 md:p-12 lg:border-s lg:border-t-0">
              {keys.map((k, i) => (
                <div key={k} className="flex items-center justify-between border-b border-white/10 py-5 last:border-0">
                  <span className="text-white/50">{t(`labels.${k}`)}</span>
                  <AnimatePresence mode="popLayout">
                    <motion.span key={acc + k} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ delay: i * 0.05 }} className="text-lg font-semibold">
                      {t(`${acc}.${k}`)}
                    </motion.span>
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal className="mt-10 text-center">
          <Button variant="outlineLight" size="lg" as="a" href="#">
            {t('compare')}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------ LEADERS (gray, hover cards) */
function Leaders() {
  const t = useTranslations('leaders');
  const people = [
    { k: 'ceo', initials: 'CEO', tone: 'brand' },
    { k: 'gm', initials: 'GM', tone: 'gold' }
  ];
  return (
    <section className="relative bg-[#eef0f5] py-24 md:py-32">
      <div className="container-x">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
        <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-2">
          {people.map((p, i) => (
            <Reveal key={p.k} delay={i * 0.15} y={60}>
              <div className="group relative aspect-[4/5] overflow-hidden rounded-[2.25rem] shadow-2xl shadow-brand/15">
                <MaskReveal className="absolute inset-0" from="bottom" delay={i * 0.15}>
                  <div className="h-full w-full transition-transform duration-[1.2s] ease-out group-hover:scale-110">
                    <Portrait initials={p.initials} tone={p.tone} />
                  </div>
                </MaskReveal>
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                  <div className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:translate-y-[calc(100%-5.5rem)] md:group-hover:translate-y-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-200">{t(`${p.k}.role`)}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <h3 className="text-2xl font-bold">{t(`${p.k}.name`)}</h3>
                      <a href="#" aria-label={t(`${p.k}.linkedin`)} className="grid size-10 place-items-center rounded-full bg-white/15 backdrop-blur transition hover:bg-gold">
                        <LinkedInIcon className="size-4" />
                      </a>
                    </div>
                    <div className="mt-5 flex gap-3 border-t border-white/15 pt-5 transition-opacity duration-500 md:opacity-0 md:group-hover:opacity-100">
                      <Quote className="size-6 shrink-0 text-gold rtl:-scale-x-100" />
                      <p className="leading-relaxed text-white/80">{t(`${p.k}.quote`)}</p>
                    </div>
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

/* --------------------------------------------------------- FAQ (white) */
function Faq() {
  const t = useTranslations('faq');
  const items = t.raw('items');
  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-32">
      <Ambient />
      <div className="container-x relative grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-36 lg:self-start">
          <SectionHeading title={t('title')} subtitle={t('subtitle')} align="start" />
          <Reveal delay={0.3}>
            <Button size="lg" className="mt-8" as="a" href="#">
              {t('contact')} <ArrowRight className="rtl:-scale-x-100" />
            </Button>
          </Reveal>
        </div>
        <Stagger stagger={0.08}>
          <Accordion type="single" collapsible defaultValue="q0">
            {items.map((it, i) => (
              <StaggerItem key={it.q}>
                <AccordionItem value={`q${i}`} className="border-brand/10">
                  <AccordionTrigger className="text-ink hover:text-brand" iconClassName="border-brand/20 text-brand group-data-[state=open]:border-gold group-data-[state=open]:bg-gold group-data-[state=open]:text-white">
                    <span className="flex items-baseline gap-5">
                      <span className="text-sm font-semibold tabular-nums text-gold">0{i + 1}</span>
                      {it.q}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="ps-10 text-ink/60">{it.a}</AccordionContent>
                </AccordionItem>
              </StaggerItem>
            ))}
          </Accordion>
        </Stagger>
      </div>
    </section>
  );
}

/* ------------------------------------------------------ REGISTER (navy) */
function Register() {
  const t = useTranslations('register');
  const symbols = TICKER_GROUPS.flat();
  return (
    <section id="register" className="relative overflow-hidden bg-gradient-to-br from-brand via-brand-800 to-brand-950 py-24 text-white md:py-32">
      <div className="absolute inset-x-0 top-10 rotate-[-4deg] opacity-[0.07]">
        <Marquee duration={60} gap="3rem">
          {symbols.map((s) => (
            <span key={s.s} className="text-7xl font-black">{s.s}</span>
          ))}
        </Marquee>
      </div>
      <div className="container-x relative grid items-center gap-14 lg:grid-cols-[1fr_0.95fr]">
        <div>
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-200">{t('eyebrow')}</span>
          <h2 className="mt-4 text-3xl font-bold leading-[1.1] tracking-tight md:text-5xl">
            <WordReveal text={t('title')} />
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-md text-lg text-white/70">{t('subtitle')}</p>
          </Reveal>
          <Steps dark />
        </div>
        <Reveal y={50} x={30}>
          <div className="rounded-[2rem] bg-white p-6 text-ink shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] md:p-8">
            <RegisterForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
