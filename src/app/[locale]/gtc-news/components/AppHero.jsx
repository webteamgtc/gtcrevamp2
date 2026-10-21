'use client';
/**
 * GTC News hero (dark): "Trade Anytime, Anywhere with GTC Go" — title, copy, glass download card
 * (app tile + store buttons + QR) beside the live GTC Go phone with animated market chips.
 */
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { BarChart3, Bell, ShieldCheck, Zap } from 'lucide-react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import HeroBackdrop from '@/components/shared/HeroBackdrop';
import GtcGoPhone from '@/components/shared/GtcGoPhone';
import { GoQr } from '@/components/shared/GoAppPromo';
import { AccentTitle } from '@/components/shared/SectionIntro';
import { Reveal, EASE } from '@/components/motion';
import StoreButtons from '@/app/[locale]/trading/common-gtc-components/components/StoreButtons';

/** Decorative candles drifting behind the phone (shapes only). */
function Candles() {
  const bars = [38, 52, 30, 64, 46, 72, 40, 58, 34, 66, 50, 78, 44, 60];
  return (
    <div className="absolute inset-x-0 bottom-[12%] flex h-40 items-end justify-center gap-2.5 opacity-40" aria-hidden>
      {bars.map((h, i) => (
        <motion.span
          key={i}
          className={i % 3 === 1 ? 'w-2.5 rounded-sm bg-down/70' : 'w-2.5 rounded-sm bg-up/70'}
          style={{ height: `${h}%` }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: [1, 0.75 + ((i * 7) % 5) * 0.05, 1] }}
          transition={{ duration: 3 + (i % 4) * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.08 }}
        />
      ))}
    </div>
  );
}

const CHIPS = [
  { Icon: Zap, className: 'start-0 top-[18%]', float: 5 },
  { Icon: BarChart3, className: 'end-0 top-[30%]', float: 6 },
  { Icon: ShieldCheck, className: 'start-[4%] bottom-[24%]', float: 5.5 },
  { Icon: Bell, className: 'end-[6%] bottom-[14%]', float: 6.5 }
];

export default function AppHero() {
  const t = useTranslations('gtcNewsPage.app');
  const tb = useTranslations('gtcNewsPage.breadcrumb');
  return (
    <section className="is-dark relative overflow-hidden bg-ink pb-16 pt-36 text-white md:pb-20 md:pt-44">
      <HeroBackdrop />
      <div className="container-x relative">
        <Breadcrumb className="lg:justify-start" items={[{ label: tb('home'), href: '/' }, { label: tb('current') }]} />
        <div className="mt-10 grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div className="text-center lg:text-start">
            <motion.h1 className="heading-page text-balance" initial={{ y: 24 }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
              <AccentTitle text={t('title')} />
            </motion.h1>
            <motion.p className="mx-auto mt-5 max-w-lg text-pretty text-base leading-relaxed text-white/65 md:text-lg lg:mx-0" initial={{ y: 10 }} animate={{ y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}>
              {t('description')}
            </motion.p>

            {/* download card */}
            {/* plain container: StoreButtons runs its own entrance animation (a parent animation would stall it) */}
            <div className="mx-auto mt-10 max-w-xl rounded-[1.75rem] bg-white/[0.06] p-5 ring-1 ring-white/10 backdrop-blur-xl lg:mx-0">
              <motion.div className="flex flex-wrap items-center justify-center gap-4 sm:justify-between" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6, ease: EASE }}>
                <span className="flex items-center gap-3">
                  <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-900 text-lg font-black text-white shadow-lg shadow-brand/40 ring-1 ring-white/15">G</span>
                  <span className="text-start">
                    <span className="block text-xs text-white/55">{t('downloadLabel')}</span>
                    <span className="block whitespace-nowrap text-lg font-bold tracking-wide text-gold-200">{t('appName')}</span>
                  </span>
                </span>
                <GoQr label={t('qrLabel')} />
              </motion.div>
              <Reveal y={12} delay={0.3} className="mt-5 border-t border-white/10 pt-5">
                <StoreButtons tone="white" className="justify-center sm:justify-start" />
              </Reveal>
            </div>
          </div>

          <div className="relative mx-auto aspect-[4/5] w-full max-w-[420px]" aria-hidden>
            <div className="absolute inset-[10%] rounded-full bg-brand/45 blur-3xl" />
            <motion.div className="absolute inset-[2%] rounded-full border border-dashed border-white/15" animate={{ rotate: 360 }} transition={{ duration: 70, repeat: Infinity, ease: 'linear' }} />
            <Candles />
            <motion.div className="absolute inset-x-[20%] top-[4%]" initial={{ y: 80, rotate: 10 }} animate={{ y: 0, rotate: -6 }} transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}>
              <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
                <GtcGoPhone className="w-full drop-shadow-[0_40px_60px_rgba(0,0,0,0.5)]" />
              </motion.div>
            </motion.div>
            {CHIPS.map(({ Icon, className, float }, i) => (
              <motion.span key={i} className={`absolute ${className}`} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 + i * 0.12, type: 'spring', stiffness: 200, damping: 15 }}>
                <motion.span className="grid size-12 place-items-center rounded-2xl bg-white/10 text-gold-200 shadow-2xl ring-1 ring-white/15 backdrop-blur-xl" animate={{ y: [0, -8, 0] }} transition={{ duration: float, repeat: Infinity, ease: 'easeInOut' }}>
                  <Icon className="size-5" />
                </motion.span>
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
