'use client';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { ChevronRight, Users, Layers, ChartNoAxesCombined, Languages } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { PORTAL } from '@/config/menu';
import ArrowLink from '@/components/shared/ArrowLink';
import { Stagger, StaggerItem, CountUp, EASE } from '@/components/motion';
import { AccentTitle } from './parts';

const STAT_ICONS = [Users, Layers, Languages, ChartNoAxesCombined];

/** Generic line-art skyline (deterministic, no image request). */
function Skyline() {
  const towers = useMemo(() => {
    let seed = 11;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const out = [];
    let x = 0;
    while (x < 1440) {
      const w = 34 + Math.round(rnd() * 60);
      const center = Math.abs(x + w / 2 - 720) / 720; // shorter in the middle, taller at the edges
      const h = 60 + Math.round(rnd() * 120 + center * 170);
      out.push({ x, w, h, spire: rnd() > 0.78 });
      x += w + 6;
    }
    return out;
  }, []);
  return (
    <svg dir="ltr" viewBox="0 0 1440 360" preserveAspectRatio="xMidYMax slice" className="pointer-events-none absolute inset-x-0 bottom-0 h-[260px] w-full md:h-[340px]" aria-hidden>
      <defs>
        <linearGradient id="sky-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.07" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {towers.map((t, i) => (
        <motion.g
          key={i}
          style={{ transformOrigin: `${t.x + t.w / 2}px 360px` }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.1, delay: 0.25 + (Math.abs(i - towers.length / 2) / towers.length) * 0.9, ease: EASE }}
        >
          <rect x={t.x} y={360 - t.h} width={t.w} height={t.h} fill="url(#sky-fade)" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
          {Array.from({ length: Math.floor(t.h / 22) }).map((_, r) => (
            <line key={r} x1={t.x + 6} x2={t.x + t.w - 6} y1={360 - t.h + 14 + r * 22} y2={360 - t.h + 14 + r * 22} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 5" />
          ))}
          {t.spire && <line x1={t.x + t.w / 2} x2={t.x + t.w / 2} y1={360 - t.h} y2={360 - t.h - 40} stroke="rgba(182,135,86,0.6)" />}
        </motion.g>
      ))}
    </svg>
  );
}

export function CompanyHero() {
  const t = useTranslations('companyPage');
  const tb = useTranslations('companyPage.breadcrumb');
  const stats = useTranslations('stats').raw('items');

  return (
    <section className="is-dark relative overflow-hidden pb-14 pt-36 md:pb-20 md:pt-44">
      {/* background: grid, glows, skyline */}
      <div className="bg-grid-dark mask-radial absolute inset-0 opacity-80" />
      <div className="absolute left-1/2 top-[-260px] h-[620px] w-[960px] -translate-x-1/2 rounded-full bg-brand/45 blur-[140px]" />
      <motion.div
        className="absolute end-[8%] top-40 size-[320px] rounded-full bg-gold/20 blur-[110px]"
        animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <Skyline />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />

      <div className="container-x relative text-center">
        <nav aria-label="Breadcrumb" className="flex justify-center">
          <ol className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/60 backdrop-blur">
            <li>
              <Link href="/" className="transition-colors hover:text-gold-200">
                {tb('home')}
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="size-3.5 rtl:-scale-x-100" />
            </li>
            <li aria-current="page" className="text-gold-200">
              {tb('company')}
            </li>
          </ol>
        </nav>

        {/* h1 + intro render visible straight away (good LCP); only a light slide-in */}
        <motion.h1 className="heading-page mx-auto mt-7 max-w-4xl" initial={{ y: 18 }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
          <AccentTitle text={t('hubSection.title')} />
        </motion.h1>
        <p className="mx-auto mt-6 max-w-3xl text-pretty text-base leading-relaxed text-white/65 md:text-lg">{t('hubSection.description')}</p>

        <motion.div className="mt-9 flex flex-wrap items-center justify-center gap-4" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6, ease: EASE }}>
          <ArrowLink href={PORTAL.register} variant="gold">
            {t('hubSection.ctaLive')}
          </ArrowLink>
          <a href="#legal" className="inline-flex h-13 items-center rounded-full border border-white/20 bg-white/5 px-7 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white hover:text-brand-900">
            {t('hubSection.ctaSecondary')}
          </a>
        </motion.div>

        {/* stats */}
        <Stagger className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-3 md:mt-20 md:gap-4 lg:grid-cols-4" stagger={0.1} delay={0.4}>
          {stats.map((s, i) => {
            const Icon = STAT_ICONS[i % STAT_ICONS.length];
            return (
              <StaggerItem key={s.label} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-start backdrop-blur-md transition-colors duration-500 hover:border-gold/40 md:p-6">
                <span className="absolute -end-10 -top-10 size-28 rounded-full bg-gold/10 blur-2xl transition-opacity duration-500 group-hover:opacity-100 md:opacity-0" aria-hidden />
                <span className="grid size-11 place-items-center rounded-2xl bg-white/10 text-gold-200 ring-1 ring-white/10 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                  <Icon className="size-5" />
                </span>
                <div dir="ltr" className="heading-accent mt-5 text-start text-2xl font-bold tracking-tight md:text-3xl rtl:text-end">
                  <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
                </div>
                <div className="mt-1.5 text-sm text-white/55">{s.label}</div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
