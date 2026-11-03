'use client';
/**
 * UAE CAT 5 site: /en-ae/live-application-form (and /live-account-application alias; src/proxy.js, CAT5_PAGES).
 * Submissions are saved only to MongoDB (user_record) — saveTo="database" → /api/cat5/live-account.
 * /live-account-application[?account=<slug>][&code|ref|partner_id|…]
 * UI copy: messages/<locale>/liveApplicationPage.json → `liveAccountApplicationPage`;
 * form fields: tradingPage.liveForm (shared with the Trading page form, src/components/shared/LiveApplicationForm.jsx).
 * Rhythm: dark hero → form card lifted over the hero beside a sticky side column (account types, help) → dark footer.
 */
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { LiveAccountForm } from '@/components/shared/LiveApplicationForm';
import Toaster from '@/components/shared/Toaster';
import { useUkGate } from '@/components/shared/geo/UkGate';
import { Reveal } from '@/components/motion';
import { Cat5Frame } from '../../components/MarketingPage';
import LiveAccountApplicationHeroSection from './LiveAccountApplicationHeroSection';
import LiveAccountApplicationSidebar from './LiveAccountApplicationSidebar';

export default function LiveAccountApplicationPage({ accountKey, showAccount }) {
  const t = useTranslations('liveAccountApplicationPage.form');
  const { blocked } = useUkGate(); // UK visitor: the UK notice shows instead of the form
  return (
    <Cat5Frame page="liveApplicationForm">
      <div className="overflow-x-clip bg-[#f6f7fb] text-ink">
        <LiveAccountApplicationHeroSection accountKey={accountKey} showAccount={showAccount} />
        <section className="relative pt-8 pb-16 md:pt-12 md:pb-24">
          <div className="bg-grid-light mask-radial absolute inset-0 opacity-60" aria-hidden />
          <motion.span className="absolute -start-40 top-1/3 size-[460px] rounded-full bg-brand/[0.07] blur-[120px]" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 8, repeat: Infinity }} aria-hidden />
          <motion.span className="absolute -end-40 bottom-10 size-[420px] rounded-full bg-gold/[0.1] blur-[120px]" animate={{ opacity: [1, 0.6, 1] }} transition={{ duration: 8, repeat: Infinity }} aria-hidden />
          <div className="container-x relative">
            <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-start justify-items-center gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:justify-items-stretch lg:gap-10">
              <Reveal y={24} className="relative w-full max-w-2xl lg:max-w-none">
                <span className="absolute -inset-px -z-10 rounded-[1.85rem] bg-gradient-to-br from-gold/50 via-brand-300/30 to-brand/50 blur-sm" aria-hidden />
                {!blocked && <LiveAccountForm variant="page" saveTo="database" title={t('title')} subtitle={t('subtitle')} />}
              </Reveal>
              <LiveAccountApplicationSidebar />
            </div>
          </div>
        </section>
        <Toaster />
      </div>
    </Cat5Frame>
  );
}
