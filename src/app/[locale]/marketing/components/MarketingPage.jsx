'use client';
/**
 * UAE CAT 5 page — marketing and lead-generation services only (no trading, no platforms, no account opening).
 * Standalone: no site menu or footer links. Built to turn visits into enquiries (form → /api/uae-enquiry).
 * Rhythm: dark hero → trust strip → white services → gray process → white why → navy enquiry form → white FAQ → dark legal footer.
 * Copy: messages/en/marketingPage.json (draft for compliance).
 */
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, BadgeCheck, CalendarDays, ChartPie, CircleCheck, Clapperboard, FileChartColumn, Globe, Handshake, Info, Mail, Megaphone, Phone, ShieldCheck, Target } from 'lucide-react';
import Logo from '@/components/shared/Logo';
import FaqAccordion from '@/components/shared/FaqAccordion';
import { SectionIntro, AccentTitle } from '@/components/shared/SectionIntro';
import { Reveal, Stagger, StaggerItem, HeroIn, EASE } from '@/components/motion';
import { CAT5_CONTACT } from '@/config/regions';
import { resetUaeCategory } from '@/components/shared/geo/geoClient';
import EnquiryForm from './EnquiryForm';
import { cn } from '@/lib/utils';

export const ICONS = { lead: Target, digital: Megaphone, event: CalendarDays, brand: Clapperboard, partner: Handshake, insight: ChartPie, shield: ShieldCheck, globe: Globe, report: FileChartColumn, check: BadgeCheck };
const Icon = ({ name, className }) => {
  const I = ICONS[name] ?? Target;
  return <I className={className} aria-hidden />;
};
const mail = `mailto:${CAT5_CONTACT.email}`;
const tel = `tel:${CAT5_CONTACT.phone.replace(/[^+\d]/g, '')}`;

function CtaButton({ children, className }) {
  return (
    <a href="#enquiry" className={cn('group inline-flex h-13 items-center gap-3 rounded-full bg-gold ps-7 pe-2 text-base font-semibold text-white shadow-lg shadow-gold/30 transition-colors hover:bg-gold-600', className)}>
      {children}
      <span className="grid size-9 place-items-center rounded-full bg-white text-gold-700 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100">
        <ArrowRight className="size-4" />
      </span>
    </a>
  );
}

function TopBar() {
  const t = useTranslations('marketingPage');
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="border-b border-white/10 bg-black/30 text-[11px] text-white/75 backdrop-blur md:text-xs">
        <p className="container-x flex items-center gap-2 py-2">
          <Info className="size-3.5 shrink-0 text-gold-200" aria-hidden />
          {t('notice')}
        </p>
      </div>
      <div className="container-x flex items-center justify-between gap-3 py-5">
        <Logo onDark />
        <div className="flex items-center gap-2">
          <button type="button" onClick={resetUaeCategory} className="hidden rounded-full px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white sm:block">
            {t('changeCategory')}
          </button>
          <a href="#enquiry" className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-brand-900 transition-colors hover:bg-gold hover:text-white sm:text-sm">
            {t('cta')}
          </a>
        </div>
      </div>
    </header>
  );
}

/** Illustrative activity cards (no figures) floating next to the hero copy. */
function HeroVisual() {
  const t = useTranslations('marketingPage.hero');
  const cards = t.raw('cards');
  return (
    <div className="relative mx-auto hidden aspect-square w-full max-w-md sm:block" aria-hidden>
      <div className="absolute inset-[12%] rounded-full border border-white/10" />
      <div className="absolute inset-[26%] rounded-full border border-gold/30" />
      <motion.div className="absolute inset-[26%] rounded-full border-t-2 border-gold" animate={{ rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: 'linear' }} />
      <div className="absolute inset-[38%] grid place-items-center rounded-full bg-gradient-to-br from-gold to-gold-600 shadow-[0_20px_60px_-10px_rgba(182,135,86,0.7)]">
        <Target className="size-10 text-white" />
      </div>
      {cards.map((c, i) => (
        <motion.div
          key={c.title}
          className={cn('absolute flex w-56 items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3 text-start backdrop-blur-md', ['start-0 top-[4%]', 'end-0 top-[22%]', 'start-[4%] bottom-[6%]'][i])}
          initial={{ y: 12 }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, delay: i * 0.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-brand">
            <Icon name={c.icon} className="size-5" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-white">{c.title}</span>
            <span className="block text-xs text-white/60">{c.text}</span>
          </span>
          <span className="absolute -end-1 -top-1 size-3 rounded-full bg-green-400 ring-4 ring-brand-950" />
        </motion.div>
      ))}
    </div>
  );
}

function Hero() {
  const t = useTranslations('marketingPage.hero');
  return (
    <section className="is-dark relative overflow-hidden bg-[radial-gradient(ellipse_at_top_left,#2a3c9a_0%,#141d4d_45%,#080b22_100%)] pb-16 pt-40 text-white md:pb-24 md:pt-44">
      <div className="bg-grid-dark mask-radial absolute inset-0 opacity-50" aria-hidden />
      <motion.span className="absolute -end-32 top-24 size-[460px] rounded-full bg-gold/20 blur-[120px]" animate={{ opacity: [0.5, 0.9, 0.5] }} transition={{ duration: 7, repeat: Infinity }} aria-hidden />
      <div className="container-x relative grid items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
        <div className="text-center lg:text-start">
          <HeroIn as="p" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-gold-200 backdrop-blur">
            {t('badge')}
          </HeroIn>
          <HeroIn as="h1" delay={0.05} className="heading-display mt-6">
            <AccentTitle text={t('title')} />
          </HeroIn>
          <HeroIn as="p" delay={0.1} className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/70 md:text-lg lg:mx-0">
            {t('text')}
          </HeroIn>
          <HeroIn delay={0.15} className="mt-9 flex flex-wrap justify-center gap-3 lg:justify-start">
            <CtaButton>{t('primary')}</CtaButton>
            <a href="#services" className="inline-flex h-13 items-center rounded-full border border-white/25 bg-white/5 px-7 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white hover:text-brand-900">
              {t('secondary')}
            </a>
          </HeroIn>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}

function Trust() {
  const t = useTranslations('marketingPage');
  return (
    <section className="border-b border-brand/10 bg-white">
      <div className="container-x grid grid-cols-2 divide-brand/10 md:grid-cols-4 md:divide-x rtl:md:divide-x-reverse">
        {t.raw('trust').map((s) => (
          <div key={s.label} className="px-4 py-7 text-center">
            <p className="text-2xl font-bold tracking-tight text-brand md:text-3xl">{s.value}</p>
            <p className="mt-1 text-sm text-ink/55">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Services() {
  const t = useTranslations('marketingPage.services');
  const tm = useTranslations('marketingPage');
  return (
    <section id="services" className="scroll-mt-8 bg-white py-16 text-ink md:py-24">
      <div className="container-x">
        <SectionIntro title={t('title')} description={t('text')} />
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 md:mt-16 lg:grid-cols-3" stagger={0.08}>
          {t.raw('items').map((s, i) => (
            <StaggerItem key={s.title}>
              <div className="group relative h-full overflow-hidden rounded-3xl bg-[#f6f8fc] p-7 ring-1 ring-brand/10 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_30px_70px_-35px_rgba(41,59,147,0.55)]">
                <span className="absolute -end-10 -top-10 size-32 rounded-full bg-brand/5 transition-transform duration-500 group-hover:scale-150" aria-hidden />
                <span className={cn('relative grid size-13 place-items-center rounded-2xl text-white shadow-lg transition-transform duration-500 group-hover:rotate-6', i % 2 ? 'bg-gradient-to-br from-gold to-gold-600 shadow-gold/30' : 'bg-gradient-to-br from-brand to-brand-800 shadow-brand/30')}>
                  <Icon name={s.icon} className="size-6" />
                </span>
                <h3 className="heading-card relative mt-6">{s.title}</h3>
                <p className="relative mt-2.5 text-[15px] leading-relaxed text-ink/60">{s.text}</p>
                <a href="#enquiry" className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand opacity-80 transition-opacity group-hover:opacity-100">
                  {tm('cta')} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100" />
                </a>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function Process() {
  const t = useTranslations('marketingPage.process');
  const steps = t.raw('steps');
  return (
    <section className="bg-[#f6f8fc] py-16 text-ink md:py-24">
      <div className="container-x">
        <SectionIntro title={t('title')} description={t('text')} />
        <div className="relative mt-12 md:mt-16">
          <div className="absolute inset-x-[12%] top-8 hidden h-px bg-brand/15 md:block" aria-hidden>
            <motion.div className="h-full origin-left bg-gradient-to-r from-brand to-gold rtl:origin-right" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 1.4, ease: EASE }} />
          </div>
          <Stagger className="grid gap-6 sm:grid-cols-2 md:grid-cols-4" stagger={0.12}>
            {steps.map((s, i) => (
              <StaggerItem key={s.title} className="relative text-center">
                <span className="relative mx-auto grid size-16 place-items-center rounded-full bg-white text-xl font-bold text-brand shadow-[0_12px_30px_-12px_rgba(41,59,147,0.5)] ring-8 ring-[#f6f8fc]">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="heading-card mt-5">{s.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-ink/60">{s.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

function Why() {
  const t = useTranslations('marketingPage.why');
  const tm = useTranslations('marketingPage');
  return (
    <section className="bg-white py-16 text-ink md:py-24">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <Reveal y={16}>
          <h2 className="heading-section">
            <AccentTitle text={t('title')} />
          </h2>
          <CtaButton className="mt-8">{tm('cta')}</CtaButton>
        </Reveal>
        <Stagger className="grid gap-4 sm:grid-cols-2" stagger={0.08}>
          {t.raw('items').map((w) => (
            <StaggerItem key={w.title} className="rounded-3xl border border-brand/10 p-6 transition-colors hover:border-brand/30">
              <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand">
                <Icon name={w.icon} className="size-5" />
              </span>
              <h3 className="heading-card mt-4">{w.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{w.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function Enquiry() {
  const t = useTranslations('marketingPage.form');
  return (
    <section id="enquiry" className="is-dark relative scroll-mt-4 overflow-hidden bg-gradient-to-b from-brand-800 via-brand-900 to-brand-950 py-16 text-white md:py-24">
      <div className="bg-grid-dark mask-radial absolute inset-0 opacity-60" aria-hidden />
      <span className="absolute -start-24 bottom-0 size-96 rounded-full bg-gold/15 blur-[110px]" aria-hidden />
      <div className="container-x relative grid items-start gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <Reveal y={16}>
          <h2 className="heading-section">
            <AccentTitle text={t('title')} />
          </h2>
          <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-white/70">{t('text')}</p>
          <ul className="mt-8 space-y-3">
            {t.raw('points').map((p) => (
              <li key={p} className="flex items-center gap-3 text-[15px]">
                <CircleCheck className="size-5 shrink-0 text-gold-200" aria-hidden /> {p}
              </li>
            ))}
          </ul>
          <p className="mt-10 text-sm text-white/55">{t('orContact')}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <a href={mail} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-white hover:text-brand-900">
              <Mail className="size-4" /> {CAT5_CONTACT.email}
            </a>
            <a href={tel} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-white hover:text-brand-900" dir="ltr">
              <Phone className="size-4" /> {CAT5_CONTACT.phone}
            </a>
          </div>
        </Reveal>
        <Reveal y={20} delay={0.1}>
          <EnquiryForm />
        </Reveal>
      </div>
    </section>
  );
}

function Faq() {
  const t = useTranslations('marketingPage.faq');
  return (
    <section className="bg-white py-16 text-ink md:py-24">
      <div className="container-x">
        <SectionIntro title={t('title')} />
        <FaqAccordion items={t.raw('items')} numbered className="mx-auto mt-12 max-w-3xl" />
      </div>
    </section>
  );
}

function LegalFooter() {
  const t = useTranslations('footer');
  const tm = useTranslations('marketingPage');
  return (
    <footer className="bg-ink pb-28 pt-12 text-white md:pb-12">
      <div className="container-x">
        <Logo onDark />
        <h2 className="heading-label is-dark mt-10">{tm('footer.title')}</h2>
        <p className="mt-4 text-[13px] leading-relaxed text-white/60">{tm('footer.text')}</p>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} GTCFX. {t('rights')}
          </p>
          <button type="button" onClick={resetUaeCategory} className="underline underline-offset-4 hover:text-white">
            {tm('changeCategory')}
          </button>
        </div>
      </div>
    </footer>
  );
}

/** Phones: a "Book a consultation" bar appears once the hero is scrolled past, hidden again at the form. */
function StickyCta() {
  const t = useTranslations('marketingPage');
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const form = document.getElementById('enquiry')?.getBoundingClientRect();
      setShow(window.scrollY > 600 && !(form && form.top < window.innerHeight && form.bottom > 0));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} transition={{ duration: 0.35, ease: EASE }} className="fixed inset-x-3 bottom-3 z-40 md:hidden">
          <a href="#enquiry" className="flex h-13 items-center justify-center gap-2 rounded-full bg-gold text-base font-semibold text-white shadow-2xl">
            {t('cta')} <ArrowRight className="size-4 rtl:-scale-x-100" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function MarketingPage() {
  return (
    <div className="overflow-x-clip bg-white text-ink">
      <TopBar />
      <main>
        <Hero />
        <Trust />
        <Services />
        <Process />
        <Why />
        <Enquiry />
        <Faq />
      </main>
      <LegalFooter />
      <StickyCta />
    </div>
  );
}
