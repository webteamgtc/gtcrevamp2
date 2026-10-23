'use client';
/**
 * UAE CAT 5 page — GTC Financial Consultancy L.L.C, licensed by the UAE CMA under Category 5:
 * financial consultations, introduction to licensed providers and promotion (only where the licence permits).
 * Not a marketing agency; no trading terms anywhere on the page. Standalone: no site menu or footer links.
 * Rhythm: dark hero → white trust + services → gray process → dark band (why) → white FAQ → navy enquiry → dark legal footer.
 * Copy: messages/en/marketingPage.json (final, approved by compliance — change only with their approval).
 */
import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  ArrowLeftRight,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  CircleCheck,
  FileCheck,
  Globe,
  GraduationCap,
  Handshake,
  Headset,
  Info,
  Languages,
  Mail,
  MapPin,
  Megaphone,
  MessageCircle,
  MessageSquareText,
  Phone,
  ShieldCheck
} from 'lucide-react';
import Logo from '@/components/shared/Logo';
import FaqAccordion from '@/components/shared/FaqAccordion';
import { SectionIntro, AccentTitle } from '@/components/shared/SectionIntro';
import { Reveal, Stagger, StaggerItem, HeroIn, EASE } from '@/components/motion';
import { CAT5_CONTACT, CAT5_LEGAL_LINKS, CAT5_PATH } from '@/config/regions';
import { localeHref, resetUaeCategory } from '@/components/shared/geo/geoClient';
import EnquiryForm from './EnquiryForm';
import { cn } from '@/lib/utils';

/** Icon names used in marketingPage.json → components. */
export const ICONS = {
  consult: MessageSquareText,
  introduce: Handshake,
  promote: Megaphone,
  education: GraduationCap,
  event: CalendarDays,
  shield: ShieldCheck,
  globe: Globe,
  report: FileCheck
};
const Icon = ({ name, className }) => {
  const I = ICONS[name] ?? ShieldCheck;
  return <I className={className} aria-hidden />;
};
const TRUST_ICONS = [Building2, ShieldCheck, MapPin, Languages];
const STEP_ICONS = [MessageCircle, BookOpen, Handshake, Headset];
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

/* ------------------------------------------------------------------ top bar */

/** "CAT 5" pill: opens a small panel offering the Category 1 website (back to the UAE popup with CAT 1 pre-selected). */
function VersionSwitch() {
  const t = useTranslations('marketingPage.version');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={cn('inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-bold tracking-wide transition-colors sm:text-sm', open ? 'border-gold bg-gold text-white' : 'border-gold/50 bg-gold/10 text-gold-200 hover:border-gold hover:bg-gold/20')}
      >
        <ShieldCheck className="size-3.5" aria-hidden />
        {t('label')}
        <ChevronDown className={cn('size-3.5 transition-transform', open && 'rotate-180')} aria-hidden />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={t('label')}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="absolute end-0 top-full z-30 mt-2 w-72 origin-top-right rounded-2xl bg-white p-4 text-ink shadow-[0_24px_60px_-20px_rgba(0,0,0,0.5)] ring-1 ring-brand/10 rtl:origin-top-left"
          >
            <p className="flex items-center gap-2 text-sm font-semibold text-ink">
              <span className="grid size-7 place-items-center rounded-full bg-gold/15 text-gold-700">
                <ShieldCheck className="size-4" aria-hidden />
              </span>
              {t('current')}
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-ink/60">{t('question')}</p>
            <button type="button" onClick={() => resetUaeCategory('1')} className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-700">
              <ArrowLeftRight className="size-4" aria-hidden /> {t('action')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** English / Arabic switch for the CAT 5 page. */
function LanguageSwitch() {
  const t = useTranslations('marketingPage.version');
  const locale = useLocale();
  const langs = [
    { code: 'en-ae', label: 'EN', lang: 'en' },
    { code: 'ar', label: 'عربي', lang: 'ar' }
  ];
  const [hrefs, setHrefs] = useState({ 'en-ae': `/en-ae${CAT5_PATH}`, ar: `/ar${CAT5_PATH}` });
  useEffect(() => setHrefs({ 'en-ae': localeHref('en-ae', CAT5_PATH), ar: localeHref('ar', CAT5_PATH) }), []);
  return (
    <nav aria-label={t('language')} className="flex h-9 items-center rounded-full border border-white/15 bg-white/5 p-0.5 backdrop-blur" dir="ltr">
      {langs.map((l) => {
        const on = locale === l.code;
        return (
          <a
            key={l.code}
            href={hrefs[l.code]}
            lang={l.lang}
            hrefLang={l.lang}
            aria-current={on ? 'true' : undefined}
            className={cn('grid h-full min-w-10 place-items-center rounded-full px-3 text-xs font-semibold transition-colors sm:text-sm', on ? 'bg-white text-brand-900' : 'text-white/70 hover:text-white')}
          >
            {l.label}
          </a>
        );
      })}
    </nav>
  );
}

function TopBar() {
  const t = useTranslations('marketingPage');
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="border-b border-white/10 bg-black/30 text-[11px] text-white/75 backdrop-blur md:text-xs">
        <p className="container-x flex items-start gap-2 py-2 sm:items-center">
          <ShieldCheck className="mt-px size-3.5 shrink-0 text-gold-200 sm:mt-0" aria-hidden />
          {t('notice')}
        </p>
      </div>
      <div className="container-x flex items-center justify-between gap-3 py-5">
        <Logo onDark />
        <div className="flex items-center gap-2">
          <a href="#enquiry" className="hidden h-9 items-center rounded-full bg-white px-4 text-sm font-semibold text-brand-900 transition-colors hover:bg-gold hover:text-white md:inline-flex">
            {t('cta')}
          </a>
          <VersionSwitch />
          <LanguageSwitch />
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ hero */

/**
 * Licence card: the badge and the three licensed activities (titles from services.items), with the
 * seminar card (hero.cards) floating off its edge. Decorative copy of content shown below, so aria-hidden.
 */
function LicenceCard() {
  const t = useTranslations('marketingPage');
  const activities = t.raw('services.items').slice(0, 3);
  const chip = t.raw('hero.cards')[0];
  return (
    <div className="relative mx-auto hidden w-full max-w-md sm:block" aria-hidden>
      <motion.span className="absolute -inset-10 rounded-full border border-white/[0.07]" animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}>
        <span className="absolute start-1/2 top-0 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_14px_rgba(182,135,86,0.9)]" />
      </motion.span>
      <span className="absolute inset-6 rounded-full bg-gold/20 blur-[90px]" />

      <motion.div
        className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.07] p-7 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.7)] backdrop-blur-xl"
        initial={{ y: 24, rotate: -2 }}
        animate={{ y: 0, rotate: 0 }}
        transition={{ duration: 1, ease: EASE }}
      >
        <span className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        <div className="flex items-center gap-4">
          <span className="relative grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-gold to-gold-600 text-white shadow-lg shadow-gold/30">
            <ShieldCheck className="size-7" />
            <motion.span className="absolute inset-0 rounded-2xl ring-2 ring-gold/60" animate={{ scale: [1, 1.25], opacity: [0.8, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }} />
          </span>
          <span className="text-lg font-bold leading-snug text-white">{t('hero.badge')}</span>
        </div>
        <ul className="mt-6 space-y-2.5">
          {activities.map((a, i) => (
            <motion.li
              key={a.title}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3"
              initial={{ x: -12, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.15, duration: 0.6, ease: EASE }}
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-brand">
                <Icon name={a.icon} className="size-[18px]" />
              </span>
              <span className="flex-1 text-[15px] font-semibold text-white">{a.title}</span>
              <span className="grid size-6 place-items-center rounded-full bg-up/20 text-green-300">
                <Check className="size-3.5" strokeWidth={3} />
              </span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {chip && (
        <motion.div
          className="absolute -bottom-8 -end-6 flex items-center gap-3 rounded-2xl border border-white/15 bg-brand-950/80 py-3 pe-5 ps-3 backdrop-blur-md"
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: [0, -6, 0], opacity: 1 }}
          transition={{ y: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }, opacity: { delay: 1, duration: 0.5 } }}
        >
          <span className="grid size-10 place-items-center rounded-xl bg-gold/15 text-gold-200 ring-1 ring-gold/30">
            <Icon name={chip.icon} className="size-5" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-white">{chip.title}</span>
            <span className="block text-xs text-white/60">{chip.text}</span>
          </span>
        </motion.div>
      )}
    </div>
  );
}

function Hero() {
  const t = useTranslations('marketingPage.hero');
  return (
    <section className="is-dark relative overflow-hidden bg-[radial-gradient(ellipse_at_top_left,#2a3c9a_0%,#141d4d_45%,#080b22_100%)] pb-20 pt-44 text-white md:pb-28 md:pt-48">
      <div className="bg-grid-dark mask-radial absolute inset-0 opacity-50" aria-hidden />
      <motion.span className="absolute -end-32 top-24 size-[460px] rounded-full bg-gold/15 blur-[120px]" animate={{ opacity: [0.5, 0.9, 0.5] }} transition={{ duration: 7, repeat: Infinity }} aria-hidden />
      <div className="container-x relative grid items-center gap-16 lg:grid-cols-[1.1fr_1fr]">
        <div className="text-center lg:text-start">
          <HeroIn as="p" className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold-200 backdrop-blur">
            <ShieldCheck className="size-3.5" aria-hidden /> {t('badge')}
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
        <LicenceCard />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ trust */

function Trust() {
  const t = useTranslations('marketingPage');
  return (
    <section className="relative z-10 -mt-10 md:-mt-12">
      <div className="container-x">
        <Stagger className="grid grid-cols-2 gap-px overflow-hidden rounded-[1.75rem] bg-brand/10 shadow-[0_30px_70px_-35px_rgba(41,59,147,0.45)] ring-1 ring-brand/10 md:grid-cols-4" stagger={0.06}>
          {t.raw('trust').map((s, i) => {
            const I = TRUST_ICONS[i] ?? ShieldCheck;
            return (
              <StaggerItem key={s.label} className="flex items-center gap-3 bg-white px-4 py-5 md:gap-4 md:px-6 md:py-6">
                <span className="hidden size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand sm:grid md:size-11">
                  <I className="size-5" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-lg font-bold tracking-tight text-ink md:text-xl">{s.value}</span>
                  <span className="block text-xs text-ink/55 md:text-sm">{s.label}</span>
                </span>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ services */

function Services() {
  const t = useTranslations('marketingPage.services');
  const tm = useTranslations('marketingPage');
  return (
    <section id="services" className="scroll-mt-8 bg-white pb-16 pt-16 text-ink md:pb-24 md:pt-24">
      <div className="container-x">
        <SectionIntro title={t('title')} description={t('text')} />
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 md:mt-16 lg:grid-cols-4" stagger={0.08}>
          {t.raw('items').map((s, i) => (
            <StaggerItem key={s.title}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-[#f6f8fc] p-7 ring-1 ring-brand/10 transition-all duration-500 hover:-translate-y-1.5 hover:bg-white hover:shadow-[0_30px_70px_-35px_rgba(41,59,147,0.55)]">
                <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-brand via-gold to-brand transition-transform duration-500 group-hover:scale-x-100 rtl:origin-right" aria-hidden />
                <span className="flex items-start justify-between">
                  <span className={cn('grid size-14 place-items-center rounded-2xl text-white shadow-lg transition-transform duration-500 group-hover:-rotate-6', i % 2 ? 'bg-gradient-to-br from-gold to-gold-600 shadow-gold/30' : 'bg-gradient-to-br from-brand to-brand-800 shadow-brand/30')}>
                    <Icon name={s.icon} className="size-6" />
                  </span>
                  <span className="text-3xl font-bold tracking-tight text-brand/10 transition-colors duration-500 group-hover:text-gold/40" aria-hidden>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </span>
                <h3 className="heading-card mt-6">{s.title}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-ink/60">{s.text}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal y={12} className="mt-12 flex justify-center">
          <CtaButton>{tm('cta')}</CtaButton>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ process */

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
            {steps.map((s, i) => {
              const I = STEP_ICONS[i] ?? Check;
              return (
                <StaggerItem key={s.title} className="relative text-center">
                  <span className="relative mx-auto grid size-16 place-items-center rounded-full bg-white text-brand shadow-[0_12px_30px_-12px_rgba(41,59,147,0.5)] ring-8 ring-[#f6f8fc]">
                    <I className="size-6" aria-hidden />
                    <span className="absolute -end-1 -top-1 grid size-6 place-items-center rounded-full bg-gold text-[11px] font-bold text-white">{i + 1}</span>
                  </span>
                  <h3 className="heading-card mt-5">{s.title}</h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-ink/60">{s.text}</p>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ why (dark band) */

function Why() {
  const t = useTranslations('marketingPage.why');
  const tm = useTranslations('marketingPage');
  return (
    <section className="is-dark relative overflow-hidden bg-ink py-16 text-white md:py-24">
      <div className="bg-grid-dark mask-radial absolute inset-0 opacity-50" aria-hidden />
      <span className="absolute -start-32 top-1/3 size-96 rounded-full bg-brand/40 blur-[120px]" aria-hidden />
      <div className="container-x relative grid items-center gap-12 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
        <Reveal y={16} className="text-center lg:text-start">
          <h2 className="heading-section">
            <AccentTitle text={t('title')} />
          </h2>
          <CtaButton className="mt-8">{tm('cta')}</CtaButton>
        </Reveal>
        <Stagger className="grid gap-4" stagger={0.1}>
          {t.raw('items').map((w) => (
            <StaggerItem key={w.title} className="group flex gap-5 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition-colors hover:border-gold/40 hover:bg-white/[0.07]">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gold/15 text-gold-200 ring-1 ring-gold/30 transition-colors group-hover:bg-gold group-hover:text-white">
                <Icon name={w.icon} className="size-6" />
              </span>
              <div>
                <h3 className="heading-card">{w.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-white/60">{w.text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ FAQ */

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

/* ------------------------------------------------------------------ enquiry (navy) */

function Enquiry() {
  const t = useTranslations('marketingPage.form');
  return (
    <section id="enquiry" className="relative scroll-mt-4 bg-white pb-16 md:pb-24">
      <div className="container-x">
        <div className="is-dark relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950 p-6 text-white shadow-2xl shadow-brand/25 md:p-12">
          <span className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" aria-hidden />
          <div className="bg-grid-dark absolute inset-0 opacity-40" aria-hidden />
          <span className="absolute -start-24 bottom-0 size-96 rounded-full bg-gold/15 blur-[110px]" aria-hidden />
          <div className="relative grid items-start gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
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
              <div className="mt-10 rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-5">
                <p className="text-sm font-semibold text-white/80">{t('orContact')}</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <a href={mail} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-white hover:text-brand-900">
                    <Mail className="size-4" /> {CAT5_CONTACT.email}
                  </a>
                  <a href={tel} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-white hover:text-brand-900" dir="ltr">
                    <Phone className="size-4" /> {CAT5_CONTACT.phone}
                  </a>
                </div>
              </div>
            </Reveal>
            <Reveal y={20} delay={0.1}>
              <EnquiryForm />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ legal footer */

function LegalFooter() {
  const t = useTranslations('marketingPage');
  const links = Object.keys(CAT5_LEGAL_LINKS);
  return (
    <footer className="is-dark bg-ink pb-28 pt-14 text-white md:pb-12">
      <div className="container-x">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <Logo onDark />
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm" aria-label={t('footer.title')}>
            {links.map((k) =>
              CAT5_LEGAL_LINKS[k] ? (
                <a key={k} href={CAT5_LEGAL_LINKS[k]} className="text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline">
                  {t(`footer.links.${k}`)}
                </a>
              ) : (
                <span key={k} className="text-white/70">
                  {t(`footer.links.${k}`)}
                </span>
              )
            )}
          </nav>
        </div>
        <h2 className="heading-label mt-10 flex items-center gap-2">
          <Info className="size-4" aria-hidden /> {t('footer.title')}
        </h2>
        <p className="mt-4 max-w-5xl text-[13px] leading-relaxed text-white/60">{t('footer.text')}</p>
        <p className="mt-5 max-w-5xl rounded-2xl border border-gold/25 bg-gold/[0.06] px-5 py-4 text-[13px] leading-relaxed text-white/70">{t('footer.risk')}</p>
        <p className="mt-10 border-t border-white/10 pt-6 text-sm text-white/50">{t('footer.copyright')}</p>
      </div>
    </footer>
  );
}

/** Phones: a "Speak to the Team" bar appears once the hero is scrolled past, hidden again at the form. */
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
        <Faq />
        <Enquiry />
      </main>
      <LegalFooter />
      <StickyCta />
    </div>
  );
}
