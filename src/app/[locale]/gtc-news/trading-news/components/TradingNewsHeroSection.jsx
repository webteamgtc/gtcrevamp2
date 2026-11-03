'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import HeroBackdrop from '@/components/shared/HeroBackdrop';
import { AccentTitle } from '@/components/shared/SectionIntro';
import { EASE } from '@/components/motion';
import { NEWS_PATH } from '@/lib/news-path';

export default function TradingNewsHeroSection() {
  const t = useTranslations('tradingNewsPage');

  return (
    <section className="is-dark relative overflow-hidden bg-ink pb-16 pt-36 text-white md:pb-20 md:pt-44">
      <HeroBackdrop />
      <div className="container-x relative">
        <Breadcrumb
          tone="dark"
          className="lg:justify-start"
          items={[
            { label: t('breadcrumb.home'), href: '/' },
            { label: t('breadcrumb.news'), href: NEWS_PATH },
            { label: t('breadcrumb.current') }
          ]}
        />
        <div className="mt-10 max-w-3xl text-center lg:text-start">
          <motion.span
            className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-4 py-1.5 text-xs font-semibold tracking-wide text-gold-200 ring-1 ring-white/10 backdrop-blur"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span className="size-1.5 rounded-full bg-up" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />
            {t('hero.badge')}
          </motion.span>
          <motion.h1
            className="heading-page mt-6 text-balance"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.75, ease: EASE }}
          >
            <AccentTitle text={t('hero.title')} />
          </motion.h1>
          <motion.p
            className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-white/65 md:text-lg lg:mx-0"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            {t('hero.description')}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
