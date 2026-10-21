'use client';
/**
 * UAE CAT 5 marketing page — information only: no menu, no account opening, no links into the site.
 * Rhythm: dark hero (stats) → white "who we are" → gray markets + platforms → navy contact → dark legal footer.
 */
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { ArrowRight, ChartCandlestick, Coins, Flame, Gem, Globe, Landmark, Bitcoin, Mail, MessagesSquare, Phone, ShieldCheck, Smartphone, Monitor, MonitorSmartphone, Info } from 'lucide-react';
import Logo from '@/components/shared/Logo';
import HeroTradingBackdrop from '@/components/shared/HeroBackdrop';
import { SectionIntro, AccentTitle } from '@/components/shared/SectionIntro';
import { Reveal, Stagger, StaggerItem, EASE } from '@/components/motion';
import { CAT5_CONTACT } from '@/config/regions';
import { resetUaeCategory } from '@/components/shared/geo/geoClient';

const ABOUT_ICON = { shield: ShieldCheck, globe: Globe, chat: MessagesSquare };
const MARKET_ICON = [Coins, Gem, Flame, ChartCandlestick, Landmark, Bitcoin];
const PLATFORM_ICON = [Monitor, MonitorSmartphone, Smartphone];
const mail = `mailto:${CAT5_CONTACT.email}`;
const tel = `tel:${CAT5_CONTACT.phone.replace(/[^+\d]/g, '')}`;

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
      <div className="container-x flex items-center justify-between py-5">
        <Logo onDark />
        <button type="button" onClick={resetUaeCategory} className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition-colors hover:bg-white hover:text-brand-900 sm:text-sm">
          {t('changeCategory')}
        </button>
      </div>
    </header>
  );
}

function Hero() {
  const t = useTranslations('marketingPage');
  const stats = t.raw('stats');
  return (
    <section className="is-dark relative overflow-hidden bg-brand-950 pb-16 pt-40 text-white md:pb-24 md:pt-48">
      <HeroTradingBackdrop />
      <div className="container-x relative text-center">
        <motion.h1 initial={{ y: 18 }} animate={{ y: 0 }} transition={{ duration: 0.7, ease: EASE }} className="heading-display mx-auto max-w-3xl">
          <AccentTitle text={t('hero.title')} />
        </motion.h1>
        <motion.p initial={{ y: 14 }} animate={{ y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: EASE }} className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-white/70 md:text-lg">
          {t('hero.text')}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: EASE }} className="mt-9 flex flex-wrap justify-center gap-3">
          <a href="#contact" className="group inline-flex h-13 items-center gap-3 rounded-full bg-gold ps-7 pe-2 text-base font-semibold text-white shadow-lg shadow-gold/30 transition-colors hover:bg-gold-600">
            {t('hero.primary')}
            <span className="grid size-9 place-items-center rounded-full bg-white text-gold-700 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100">
              <ArrowRight className="size-4" />
            </span>
          </a>
          <a href={mail} className="inline-flex h-13 items-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white hover:text-brand-900">
            <Mail className="size-4" /> {t('hero.secondary')}
          </a>
        </motion.div>
        <Stagger className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-4" stagger={0.08} delay={0.3}>
          {stats.map((s) => (
            <StaggerItem key={s.label} className="bg-brand-950/80 px-5 py-6 backdrop-blur">
              <p className="text-3xl font-bold tracking-tight text-gold-200 md:text-4xl" dir="ltr">{s.value}</p>
              <p className="mt-1.5 text-sm text-white/60">{s.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function About() {
  const t = useTranslations('marketingPage.about');
  return (
    <section className="bg-white py-16 text-ink md:py-24">
      <div className="container-x">
        <SectionIntro title={t('title')} description={t('text')} />
        <Stagger className="mt-12 grid gap-5 md:mt-16 md:grid-cols-3" stagger={0.1}>
          {t.raw('items').map((it) => {
            const I = ABOUT_ICON[it.icon] ?? ShieldCheck;
            return (
              <StaggerItem key={it.title} className="group rounded-3xl bg-[#f6f8fc] p-7 ring-1 ring-brand/10 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_24px_60px_-30px_rgba(41,59,147,0.5)]">
                <span className="grid size-12 place-items-center rounded-2xl bg-brand text-white transition-transform duration-500 group-hover:rotate-6">
                  <I className="size-5" />
                </span>
                <h3 className="heading-card mt-6">{it.title}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-ink/60">{it.text}</p>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

function MarketsPlatforms() {
  const tm = useTranslations('marketingPage.markets');
  const tp = useTranslations('marketingPage.platforms');
  return (
    <section className="bg-[#f6f8fc] py-16 text-ink md:py-24">
      <div className="container-x grid gap-14 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionIntro layout="split" className="lg:grid-cols-1 lg:gap-4" title={tm('title')} description={tm('text')} />
          <Stagger className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3" stagger={0.06}>
            {tm.raw('items').map((m, i) => {
              const I = MARKET_ICON[i] ?? Globe;
              return (
                <StaggerItem key={m} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-4 ring-1 ring-brand/10">
                  <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand">
                    <I className="size-5" />
                  </span>
                  <span className="font-semibold">{m}</span>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
        <div>
          <SectionIntro layout="split" className="lg:grid-cols-1 lg:gap-4" title={tp('title')} description={tp('text')} />
          <Stagger className="mt-8 space-y-3" stagger={0.08}>
            {tp.raw('items').map((p, i) => {
              const I = PLATFORM_ICON[i] ?? Monitor;
              return (
                <StaggerItem key={p.name} className="flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-brand/10">
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-gold to-gold-600 text-white">
                    <I className="size-5" />
                  </span>
                  <span>
                    <span className="block font-semibold">{p.name}</span>
                    <span className="block text-sm text-ink/60">{p.text}</span>
                  </span>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const t = useTranslations('marketingPage.contact');
  const cards = [
    { icon: Mail, label: t('email'), value: CAT5_CONTACT.email, href: mail, cta: t('emailCta') },
    { icon: Phone, label: t('phone'), value: CAT5_CONTACT.phone, href: tel, cta: t('phoneCta') }
  ];
  return (
    <section id="contact" className="is-dark relative scroll-mt-8 overflow-hidden bg-gradient-to-b from-brand-800 via-brand-900 to-brand-950 py-16 text-white md:py-24">
      <div className="bg-grid-dark mask-radial absolute inset-0 opacity-60" aria-hidden />
      <motion.span className="absolute -end-24 -top-24 size-96 rounded-full bg-gold/20 blur-[110px]" animate={{ opacity: [0.5, 0.9, 0.5] }} transition={{ duration: 6, repeat: Infinity }} aria-hidden />
      <div className="container-x relative">
        <Reveal y={16} className="mx-auto max-w-2xl text-center">
          <h2 className="heading-section">
            <AccentTitle text={t('title')} />
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-white/70">{t('text')}</p>
        </Reveal>
        <Stagger className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2" stagger={0.1}>
          {cards.map((c) => (
            <StaggerItem key={c.label}>
              <a href={c.href} className="group flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.05] p-7 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:bg-white/[0.08]">
                <span className="grid size-12 place-items-center rounded-2xl bg-gold text-white">
                  <c.icon className="size-5" />
                </span>
                <span className="mt-5 text-sm text-white/55">{c.label}</span>
                <span className="mt-1 text-lg font-semibold" dir="ltr">
                  {c.value}
                </span>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold-200">
                  {c.cta} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100" />
                </span>
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function LegalFooter() {
  const t = useTranslations('footer');
  const tm = useTranslations('marketingPage');
  return (
    <footer className="bg-ink py-12 text-white">
      <div className="container-x">
        <Logo onDark />
        <h2 className="heading-label is-dark mt-10">{t('riskTitle')}</h2>
        <div className="mt-4 space-y-3 text-[13px] leading-relaxed text-white/55">
          {t.raw('risk').map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
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

export default function MarketingPage() {
  return (
    <div className="overflow-x-clip bg-white text-ink">
      <TopBar />
      <main>
        <Hero />
        <About />
        <MarketsPlatforms />
        <Contact />
      </main>
      <LegalFooter />
    </div>
  );
}
