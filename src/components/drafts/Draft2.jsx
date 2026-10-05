'use client';
/**
 * DRAFT 2 — DARK · "Midnight"
 * Black + midnight-navy surfaces, glowing gold (#b68756) accents, navy (#293b93) light.
 */
import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, motion, useScroll, useTransform, useSpring } from 'motion/react';
import { ArrowRight, ArrowUpRight, Check, Download, Quote } from 'lucide-react';
import Header from '../shared/Header';
import Footer from '../shared/Footer';
import { Button } from '../ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { FEATURE_ICONS, MARKET_ICONS, LinkedInIcon } from '../shared/icons';
import { useTicker, FlashPrice, Sparkline, UpDown, fmt, TICKER_GROUPS } from '../shared/ticker';
import { CandleChart, AreaChart, DeviceFor } from '../shared/devices';
import { SectionHeading, Portrait, RegisterForm, Steps, HeadingStyle, Ambient } from '../shared/blocks';
import { getDir } from '@/i18n/locales';
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

export default function Draft2() {
  return (
    <div className="dark overflow-x-clip bg-ink text-white">
      <ScrollProgress />
      <HeadingStyle.Provider value="index">
      <Header theme="dark" />
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

/* ------------------------------------------------------------------ HERO */
function Meteors({ count = 14 }) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    setItems(Array.from({ length: count }, () => ({ left: Math.random() * 100, delay: Math.random() * 8, dur: 4 + Math.random() * 6 })));
  }, [count]);
  return (
    <div dir="ltr" className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((m, i) => (
        <motion.span
          key={i}
          className="absolute top-0 h-px w-24 rotate-[215deg] bg-gradient-to-r from-gold to-transparent"
          style={{ left: `${m.left}%` }}
          initial={{ x: 0, y: -50, opacity: 0 }}
          animate={{ x: -500, y: 500, opacity: [0, 1, 0] }}
          transition={{ duration: m.dur, delay: m.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

function Hero() {
  const t = useTranslations('hero');
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const rotateX = useTransform(scrollYProgress, [0, 0.45], [28, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.45], [0.88, 1]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <section ref={ref} className="relative overflow-hidden pt-40 md:pt-48">
      <div className="bg-grid-dark mask-radial absolute inset-0" />
      <motion.div style={{ y: glowY }} className="absolute inset-x-0 top-0 h-[700px]">
        <div className="absolute left-1/2 top-[-200px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-brand/50 blur-[140px]" />
        <motion.div
          className="absolute start-[60%] top-20 size-[380px] rounded-full bg-gold/25 blur-[120px]"
          animate={{ x: [0, -120, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </motion.div>
      <Meteors />

      {/* orbit rings */}
      <div dir="ltr" className="pointer-events-none absolute left-1/2 top-24 -translate-x-1/2">
        {[520, 760, 1000].map((s, i) => (
          <div key={s} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]" style={{ width: s, height: s }}>
            <motion.div className="absolute inset-0" animate={{ rotate: i % 2 ? -360 : 360 }} transition={{ duration: 40 + i * 20, repeat: Infinity, ease: 'linear' }}>
              <span className="absolute -top-1 start-1/2 size-2 rounded-full bg-gold shadow-[0_0_20px_4px_rgba(182,135,86,0.7)]" />
            </motion.div>
          </div>
        ))}
      </div>

      <div className="container-x relative text-center">
        <motion.span
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="border-beam inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold text-gold-200 backdrop-blur"
        >
          <span className="size-1.5 rounded-full bg-gold" /> {t('badge')}
        </motion.span>

        <h1 className="mx-auto mt-8 max-w-5xl text-[2.3rem] font-bold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-[3.9rem]">
          <WordReveal text={t('titleA')} immediate delay={0.1} />
          <br />
          <WordReveal text={t('titleB')} immediate delay={0.3} wordClassName="text-gradient-gold" />
        </h1>

        <Reveal delay={0.55} y={16}>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-white/60">{t('subtitle')}</p>
        </Reveal>

        <Reveal delay={0.7} y={16} className="mt-10 flex flex-wrap justify-center gap-3">
          <Magnetic>
            <Button size="lg" variant="gold" as="a" href="#register">
              {t('ctaLive')} <ArrowRight className="rtl:-scale-x-100" />
            </Button>
          </Magnetic>
          <Magnetic>
            <Button size="lg" variant="outlineLight" as="a" href="#register">
              {t('ctaDemo')}
            </Button>
          </Magnetic>
        </Reveal>

        {/* Terminal that flattens as you scroll */}
        <div className="relative mx-auto mt-16 max-w-6xl" style={{ perspective: 1400 }}>
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.8, ease: EASE }}
            style={{ rotateX, scale, transformOrigin: 'top center' }}
          >
            <Terminal />
          </motion.div>
          <div className="absolute inset-x-10 -bottom-10 h-40 rounded-full bg-brand/40 blur-[90px]" />
        </div>
      </div>

      <div className="relative mt-20 border-y border-white/10 bg-white/[0.02] py-5">
        <TapeMarquee />
      </div>
    </section>
  );
}

function Terminal() {
  const t = useTranslations('hero');
  const tabs = t.raw('tabs');
  const [tab, setTab] = useState(0);
  const rows = useTicker(tab);
  const [sel, setSel] = useState(0);
  const r = rows[sel] ?? rows[0];
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-[#12152a] to-[#0b0d18] p-2 text-start shadow-[0_40px_120px_-20px_rgba(41,59,147,0.6)]">
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <div className="no-scrollbar ms-4 flex gap-1 overflow-x-auto">
          {tabs.map((l, i) => (
            <button
              key={l}
              onClick={() => {
                setTab(i);
                setSel(0);
              }}
              className={cn('relative whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium', tab === i ? 'text-ink' : 'text-white/50 hover:text-white')}
            >
              {tab === i && <motion.span layoutId="d2-tab" className="absolute inset-0 rounded-lg bg-gold" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
              <span className="relative">{l}</span>
            </button>
          ))}
        </div>
        <span className="ms-auto hidden items-center gap-2 text-xs text-white/50 sm:flex">
          <span className="size-2 animate-pulse rounded-full bg-up" /> {t('liveLabel')}
        </span>
      </div>
      <div className="grid gap-2 p-2 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl bg-white/[0.03] p-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-sm text-white/50">{r.n}</div>
              <div className="mt-1 flex items-center gap-2 text-2xl font-bold md:text-3xl">
                {r.s} <UpDown dir={r.dir} className="mt-1" />
              </div>
            </div>
            <div className="flex gap-6 text-sm">
              <div>
                <div className="text-white/40">{t('bid')}</div>
                <FlashPrice value={r.bid} decimals={r.d} dir={r.dir} tick={r.tick} className="text-xl font-bold" />
              </div>
              <div>
                <div className="text-white/40">{t('ask')}</div>
                <FlashPrice value={r.ask} decimals={r.d} dir={r.dir} tick={r.tick} className="text-xl font-bold" />
              </div>
            </div>
          </div>
          <div className="mt-4 h-56 md:h-72">
            <AnimatePresence mode="wait">
              <motion.div key={`${tab}-${sel}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                <CandleChart n={48} seed={tab * 10 + sel + 3} dark className="h-full" />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button className="shine rounded-xl bg-down/90 py-3 text-sm font-bold">SELL · {fmt(r.bid, r.d)}</button>
            <button className="shine rounded-xl bg-up/90 py-3 text-sm font-bold">BUY · {fmt(r.ask, r.d)}</button>
          </div>
        </div>
        <div className="space-y-2">
          {rows.map((x, i) => (
            <motion.button
              key={x.s}
              onClick={() => setSel(i)}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + i * 0.08 }}
              className={cn('flex w-full items-center justify-between rounded-2xl border p-4 text-start transition-all', sel === i ? 'border-gold/50 bg-gold/10' : 'border-white/5 bg-white/[0.03] hover:bg-white/[0.06]')}
            >
              <div>
                <div className="font-semibold">{x.s}</div>
                <div className="text-xs text-white/40">{x.n}</div>
              </div>
              <Sparkline data={x.hist} up={x.dir > 0} width={70} height={26} />
              <div className="text-end">
                <FlashPrice value={x.bid} decimals={x.d} dir={x.dir} tick={x.tick} className="font-bold" />
                <div className={cn('text-xs', x.change >= 0 ? 'text-up' : 'text-down')}>{x.change >= 0 ? '+' : ''}{x.change.toFixed(2)}%</div>
              </div>
            </motion.button>
          ))}
          <p className="px-2 pt-1 text-[11px] text-white/30">{t('pricesNote')}</p>
        </div>
      </div>
    </div>
  );
}

function TapeMarquee() {
  const rows = useTicker(0, 2000);
  const rows2 = useTicker(2, 2200);
  const rows3 = useTicker(4, 2400);
  const all = [...rows, ...rows2, ...rows3];
  return (
    <Marquee duration={45} gap="3rem" className="mask-fade-x">
      {all.map((r) => (
        <span key={r.s} className="flex items-center gap-3 text-sm">
          <span className="font-semibold text-white/80">{r.s}</span>
          <FlashPrice value={r.bid} decimals={r.d} dir={r.dir} tick={r.tick} className="text-white" />
          <span className={cn('flex items-center text-xs', r.dir > 0 ? 'text-up' : 'text-down')}>
            <UpDown dir={r.dir} /> {Math.abs(r.change).toFixed(2)}%
          </span>
        </span>
      ))}
    </Marquee>
  );
}

/* ------------------------------------------------- FEATURES (orbit hub) */
function Features() {
  const t = useTranslations('features');
  const items = t.raw('items');
  const [active, setActive] = useState(1);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActive((a) => (a + 1) % items.length), 3200);
    return () => clearInterval(id);
  }, [paused, items.length]);
  const R = 270;
  const C = 310;
  const nodes = items.map((_, i) => {
    const a = -Math.PI / 2 + (i / items.length) * Math.PI * 2;
    return { x: C + Math.cos(a) * R, y: C + Math.sin(a) * R };
  });
  const it = items[active];
  const ActiveIcon = FEATURE_ICONS[active];

  return (
    <section className="relative overflow-hidden py-28 md:py-36">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="container-x">
        <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading dark index={1} title={t('titleA')} titleB={t('titleB')} subtitle={t('subtitle')} />

          {/* desktop orbit */}
          <div dir="ltr" className="relative mx-auto hidden size-[620px] lg:block" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            <svg className="absolute inset-0" viewBox="0 0 620 620" aria-hidden>
              <circle cx={C} cy={C} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 8" />
              {nodes.map((n, i) => (
                <g key={i}>
                  <line x1={C} y1={C} x2={n.x} y2={n.y} stroke="rgba(255,255,255,0.08)" />
                  <motion.line
                    x1={C}
                    y1={C}
                    x2={n.x}
                    y2={n.y}
                    stroke={i === active ? '#d2a67a' : '#5565bd'}
                    strokeWidth={i === active ? 2 : 1}
                    strokeDasharray="6 10"
                    animate={{ strokeDashoffset: [0, -64], opacity: i === active ? 1 : 0.35 }}
                    transition={{ strokeDashoffset: { duration: 1.6, repeat: Infinity, ease: 'linear' }, opacity: { duration: 0.4 } }}
                  />
                </g>
              ))}
            </svg>
            <motion.div className="absolute inset-0" animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}>
              <span className="absolute left-1/2 top-[40px] size-1.5 rounded-full bg-gold shadow-[0_0_12px_3px_rgba(182,135,86,0.8)]" />
            </motion.div>

            {/* hub */}
            <div className="absolute left-1/2 top-1/2 z-10 size-[300px] -translate-x-1/2 -translate-y-1/2">
            <div className="border-beam grid size-full place-items-center rounded-full bg-gradient-to-b from-[#1b1f3d] to-[#0b0d1a] p-10 text-center shadow-[0_0_80px_-10px_rgba(41,59,147,0.8)]">
              <AnimatePresence mode="wait">
                <motion.div key={active} initial={{ opacity: 0, scale: 0.9, filter: 'blur(6px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, scale: 0.9, filter: 'blur(6px)' }} transition={{ duration: 0.4 }}>
                  <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-gold text-ink">
                    <ActiveIcon className="size-6" />
                  </span>
                  <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.16em] text-white/45">{it.eyebrow}</p>
                  <h3 className="mt-1 text-lg font-semibold">{it.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-white/60">{it.text}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            </div>

            {/* nodes */}
            {items.map((f, i) => {
              const Icon = FEATURE_ICONS[i];
              const on = i === active;
              return (
                <motion.button
                  key={f.title}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  initial={{ opacity: 0, scale: 0.4 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, type: 'spring', stiffness: 200, damping: 16 }}
                  className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
                  style={{ left: nodes[i].x, top: nodes[i].y }}
                >
                  <span className={cn('relative grid size-14 place-items-center rounded-2xl border transition-all duration-500', on ? 'border-gold bg-gold text-ink shadow-[0_0_30px_rgba(182,135,86,0.6)]' : 'border-white/10 bg-[#12152a] text-gold')}>
                    {on && <span className="absolute inset-0 animate-pulse-ring rounded-2xl bg-gold/50" />}
                    <Icon className="relative size-6" />
                  </span>
                  <span className={cn('whitespace-nowrap text-xs font-semibold transition-colors', on ? 'text-white' : 'text-white/50')}>{f.title}</span>
                </motion.button>
              );
            })}
          </div>

          {/* mobile list */}
          <Stagger className="grid gap-3 sm:grid-cols-2 lg:hidden" stagger={0.08}>
            {items.map((f, i) => {
              const Icon = FEATURE_ICONS[i];
              return (
                <StaggerItem key={f.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <span className="grid size-11 place-items-center rounded-xl bg-white/5 text-gold">
                    <Icon className="size-5" />
                  </span>
                  <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-white/40">{f.eyebrow}</p>
                  <h3 className="mt-1 font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-white/55">{f.text}</p>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------- MARKETS (scroll-pinned) */
function Markets() {
  const t = useTranslations('markets');
  const tc = useTranslations('common');
  const items = t.raw('items');
  const rtl = getDir(useLocale()) === 'rtl';
  const ref = useRef(null);
  const rowRef = useRef(null);
  const [dist, setDist] = useState(1800);
  useEffect(() => {
    const measure = () => rowRef.current && setDist(Math.max(0, rowRef.current.scrollWidth - window.innerWidth + 40));
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const xRaw = useTransform(scrollYProgress, [0.05, 0.95], [0, rtl ? dist : -dist]);
  const x = useSpring(xRaw, { stiffness: 90, damping: 25 });
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section ref={ref} className="relative h-[320vh] bg-gradient-to-b from-ink via-[#0b0e22] to-ink">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-24">
        <div className="container-x flex flex-wrap items-end justify-between gap-6">
          <SectionHeading dark index={2} eyebrow={t('eyebrow')} title={t('titleA')} titleB={t('titleB')} align="start" />
          <div className="w-48">
            <div className="text-xs text-white/40">{tc('scroll')}</div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
              <motion.div style={{ width: bar }} className="h-full rounded-full bg-gradient-to-r from-gold to-brand-300" />
            </div>
          </div>
        </div>
        <motion.div ref={rowRef} style={{ x }} className="mt-12 flex w-max gap-6 px-[max(1.25rem,calc((100vw-1280px)/2+2rem))]">
          {items.map((it, i) => {
            const Icon = MARKET_ICONS[i];
            return (
              <TiltCard key={it.name} max={7} className="group shrink-0">
                <div className="relative flex h-[440px] w-[320px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.01] p-8 md:w-[360px]">
                  <div className="absolute -end-16 -top-16 size-48 rounded-full bg-brand/40 blur-3xl transition-all duration-700 group-hover:bg-gold/40" />
                  <div className="relative flex items-center justify-between">
                    <span className="grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-brand to-brand-800 text-white shadow-lg shadow-brand/40 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                      <Icon className="size-8" strokeWidth={1.5} />
                    </span>
                    <span className="text-6xl font-bold text-white/[0.06]">0{i + 1}</span>
                  </div>
                  <div className="relative mt-auto">
                    <span className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">{it.name}</span>
                    <h3 className="mt-3 text-2xl font-semibold">{it.title}</h3>
                    <p className="mt-3 text-white/55">{it.text}</p>
                    <div className="mt-5 h-14">
                      <AreaChart seed={i + 4} dark color={i % 2 ? '#b68756' : '#5565bd'} className="h-full" />
                    </div>
                    <a href="#" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white">
                      {t('cta')}
                      <span className="grid size-8 place-items-center rounded-full bg-white/10 transition-all group-hover:rotate-45 group-hover:bg-gold group-hover:text-ink">
                        <ArrowUpRight className="size-4" />
                      </span>
                    </a>
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- STATS */
function Stats() {
  const t = useTranslations('stats');
  const items = t.raw('items');
  return (
    <section className="relative overflow-hidden py-28">
      <div className="bg-dots-dark mask-radial absolute inset-0 opacity-70" />
      <div className="container-x relative">
        <Stagger className="grid grid-cols-2 gap-y-14 lg:grid-cols-4" stagger={0.15}>
          {items.map((s, i) => (
            <StaggerItem key={s.label} className={cn('relative px-4 text-center', i > 0 && 'lg:border-s lg:border-white/10')}>
              <div className="text-gradient-gold text-3xl font-bold tracking-tight md:text-4xl xl:text-5xl lg:whitespace-nowrap">
                <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <div className="mt-3 text-sm uppercase tracking-[0.18em] text-white/50">{s.label}</div>
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
  const [i, setI] = useState(0);
  const DURATION = 7000;

  useEffect(() => {
    const id = setTimeout(() => setI((x) => (x + 1) % items.length), DURATION);
    return () => clearTimeout(id);
  }, [i, items.length]);

  const it = items[i];
  return (
    <section className="relative overflow-hidden bg-[#0a0c18] py-28 md:py-36">
      <div className="absolute start-0 top-1/3 size-[500px] rounded-full bg-brand/30 blur-[140px]" />
      <div className="container-x relative">
        <SectionHeading dark index={3} eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
        <div className="mt-12 flex max-w-xl justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] p-1.5">
          {items.map((x, k) => (
            <button key={x.key} onClick={() => setI(k)} className={cn('relative flex-1 overflow-hidden rounded-full px-4 py-3 text-sm font-semibold transition-colors', i === k ? 'text-ink' : 'text-white/60 hover:text-white')}>
              {i === k && (
                <motion.span layoutId="d2-plat" className="absolute inset-0 rounded-full bg-white" transition={{ type: 'spring', stiffness: 350, damping: 30 }}>
                  <motion.span key={i} className="absolute inset-y-0 start-0 bg-gold/30" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: DURATION / 1000, ease: 'linear' }} />
                </motion.span>
              )}
              <span className="relative">{x.brand}</span>
            </button>
          ))}
        </div>

        <div className="mt-16 grid min-h-[480px] items-center gap-12 lg:grid-cols-2">
          <AnimatePresence mode="wait">
            <motion.div key={it.key} initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.6, ease: EASE }}>
              <h3 className="text-3xl font-bold tracking-tight md:text-4xl">{it.title}</h3>
              <p className="mt-4 text-lg text-white/60">{it.tagline}</p>
              <ul className="mt-8 space-y-3">
                {features.map((f, k) => (
                  <motion.li key={f} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + k * 0.1 }} className="flex items-center gap-3 text-white/75">
                    <span className="grid size-6 place-items-center rounded-full bg-gold/15 text-gold">
                      <Check className="size-3.5" />
                    </span>
                    {f}
                  </motion.li>
                ))}
              </ul>
              <Button size="lg" variant="gold" className="mt-10" as="a" href="#">
                <Download /> {it.cta}
              </Button>
            </motion.div>
          </AnimatePresence>
          <div className="relative flex min-h-[420px] items-center justify-center" style={{ perspective: 1200 }}>
            <div className="absolute size-[420px] rounded-full border border-white/5" />
            <div className="absolute size-[300px] rounded-full border border-gold/20" />
            <AnimatePresence mode="wait">
              <motion.div key={it.key} initial={{ opacity: 0, rotateY: -35, scale: 0.85, y: 30 }} animate={{ opacity: 1, rotateY: 0, scale: 1, y: 0 }} exit={{ opacity: 0, rotateY: 35, scale: 0.85 }} transition={{ duration: 0.8, ease: EASE }}>
                <div className="animate-float">
                  <DeviceFor k={it.key} dark className={it.key === 'mt5' ? 'w-[240px]' : 'max-w-full'} />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------- ACCOUNTS (head-to-head) */
function Accounts() {
  const t = useTranslations('accounts');
  const keys = ['minDeposit', 'spreads', 'commission', 'leverage', 'lot'];
  return (
    <section className="relative overflow-hidden py-28 md:py-36">
      <Ambient tone="dark" />
      <div className="container-x relative">
        <SectionHeading dark index={4} eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
        <Reveal y={50} className="mx-auto mt-16 max-w-4xl">
          <SpotlightCard color="rgba(182,135,86,0.16)" className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-4 md:p-8">
            <div className="relative grid grid-cols-[1fr_auto_1fr] items-end gap-3 md:gap-6">
              {['standard', 'ecn'].map((a, k) => (
                <motion.div
                  key={a}
                  initial={{ opacity: 0, x: k ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: EASE }}
                  className={cn('text-center', k === 1 && 'col-start-3')}
                >
                  {a === 'standard' && <span className="mb-2 inline-block rounded-full bg-gold px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">{t('recommended')}</span>}
                  <h3 className="text-xl font-bold md:text-2xl">{t(`${a}.name`)}</h3>
                  <div className="text-gradient-gold mt-1 text-2xl font-bold md:text-4xl">{t(`${a}.spreads`)}</div>
                </motion.div>
              ))}
              <motion.span
                initial={{ scale: 0, rotate: -90 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', delay: 0.4 }}
                className="col-start-2 row-start-1 grid size-12 place-items-center self-center rounded-full border border-gold/40 bg-ink text-xs font-black text-gold md:size-14"
              >
                VS
              </motion.span>
            </div>
            <div className="mt-8">
              {keys.map((k, i) => (
                <motion.div
                  key={k}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                  className="group grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-t border-white/10 py-4 transition-colors hover:bg-white/[0.03] md:gap-6"
                >
                  <span className="text-center font-semibold md:text-lg">{t(`standard.${k}`)}</span>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-center text-[11px] text-white/50 transition-colors group-hover:border-gold/40 group-hover:text-gold md:text-xs">{t(`labels.${k}`)}</span>
                  <span className="text-center font-semibold md:text-lg">{t(`ecn.${k}`)}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button size="lg" variant="gold" as="a" href="#register">
                {t('open')} · {t('standard.name')}
              </Button>
              <Button size="lg" variant="outlineLight" as="a" href="#register">
                {t('open')} · {t('ecn.name')}
              </Button>
            </div>
          </SpotlightCard>
        </Reveal>
        <Reveal className="mt-8 text-center">
          <a href="#" className="inline-flex items-center gap-2 text-sm font-semibold text-gold-200 hover:text-gold">
            {t('compare')} <ArrowRight className="size-4 rtl:-scale-x-100" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------- LEADERS (editorial) */
function Leaders() {
  const t = useTranslations('leaders');
  const people = [
    { k: 'ceo', initials: 'CEO', tone: 'brand' },
    { k: 'gm', initials: 'GM', tone: 'gold' }
  ];
  return (
    <section className="relative overflow-hidden bg-[#0a0c18] py-28 md:py-36">
      <div className="container-x">
        <SectionHeading dark index={5} eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
        <div className="mt-20 space-y-24">
          {people.map((p, i) => (
            <div key={p.k} className={cn('grid items-center gap-10 lg:grid-cols-2 lg:gap-20', i % 2 && 'lg:[&>*:first-child]:order-2')}>
              <div className="relative">
                <div className={cn('absolute -inset-4 rounded-[2.5rem] blur-2xl', p.tone === 'gold' ? 'bg-gold/20' : 'bg-brand/40')} />
                <Parallax offset={30}>
                  <MaskReveal className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10" from="circle">
                    <Portrait initials={p.initials} tone={p.tone} />
                  </MaskReveal>
                </Parallax>
                <motion.div initial={{ opacity: 0, scale: 0.6 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', delay: 0.6 }} className="absolute -bottom-6 end-6 grid size-24 place-items-center rounded-full bg-gold text-ink shadow-2xl">
                  <Quote className="size-10 rtl:-scale-x-100" />
                </motion.div>
              </div>
              <div>
                <Reveal y={16}>
                  <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">{t(`${p.k}.role`)}</span>
                </Reveal>
                <h3 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                  <WordReveal text={t(`${p.k}.name`)} />
                </h3>
                <TextGenerate text={`“${t(`${p.k}.quote`)}”`} className="mt-6 text-lg font-light leading-relaxed text-white/80 md:text-2xl" />
                <Reveal delay={0.4} className="mt-10 flex items-center gap-4">
                  <span className="h-px w-16 bg-gold" />
                  <a href="#" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold transition hover:border-gold hover:bg-gold hover:text-ink">
                    <LinkedInIcon className="size-4" /> {t(`${p.k}.linkedin`)}
                  </a>
                </Reveal>
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
  return (
    <section className="relative py-28 md:py-36">
      <div className="container-x mx-auto max-w-4xl">
        <SectionHeading dark index={6} title={t('title')} subtitle={t('subtitle')} />
        <Stagger className="mt-14" stagger={0.08}>
          <Accordion type="single" collapsible defaultValue="q0" className="space-y-3">
            {items.map((it, i) => (
              <StaggerItem key={it.q}>
                <AccordionItem value={`q${i}`} className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 transition-colors data-[state=open]:border-gold/40 data-[state=open]:bg-gold/[0.06]">
                  <AccordionTrigger className="text-white" iconClassName="border-white/15 text-gold group-data-[state=open]:bg-gold group-data-[state=open]:text-ink">
                    {it.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/60">{it.a}</AccordionContent>
                </AccordionItem>
              </StaggerItem>
            ))}
          </Accordion>
        </Stagger>
        <Reveal className="mt-10 text-center">
          <Button variant="outlineLight" size="lg" as="a" href="#">
            {t('contact')} <ArrowRight className="rtl:-scale-x-100" />
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- REGISTER */
function Register() {
  const t = useTranslations('register');
  return (
    <section id="register" className="relative overflow-hidden py-28 md:py-36">
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
