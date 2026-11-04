'use client';
/** CAT 5 live application hero (matches inner-page rhythm in Cat5Pages.jsx). */
import { useLocale, useTranslations } from 'next-intl';
import { ShieldCheck } from 'lucide-react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import { AccentTitle } from '@/components/shared/SectionIntro';
import { HeroIn } from '@/components/motion';
import { NetworkBackdrop } from '../../components/MarketingPage';
import { cat5Href } from '../../components/cat5Links';

export default function LiveAccountApplicationHeroSection({ accountKey, showAccount }) {
  const t = useTranslations('cat5RegisterPage');
  const locale = useLocale();

  return (
    <section className="is-dark relative overflow-hidden bg-[#05081c] text-white">
      <NetworkBackdrop id="cat5-live-form" />
      <div className="container-x relative flex min-h-[360px] flex-col items-center justify-center px-4 py-14 text-center md:min-h-[400px] md:py-16 md:pb-20">
        <HeroIn className="flex w-full justify-center">
          <Breadcrumb
            tone="dark"
            className="justify-center"
            items={[
              { label: t('breadcrumb.home'), href: cat5Href(locale, 'home') },
              { label: t('breadcrumb.current') }
            ]}
          />
        </HeroIn>
        <HeroIn delay={0.04} className="mt-6 flex w-full justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-gold-200 ring-1 ring-white/10 backdrop-blur">
            <ShieldCheck className="size-3.5" />
            {t('hero.eyebrow')}
          </span>
        </HeroIn>
        <HeroIn as="h1" delay={0.06} className="heading-page mx-auto mt-6 w-full max-w-4xl text-balance text-center drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
          <AccentTitle text={t('hero.title')} />
        </HeroIn>
        {showAccount && (
          <HeroIn delay={0.08} className="mt-5 flex w-full justify-center">
            <span className="inline-flex rounded-full bg-gold px-4 py-1.5 text-sm font-bold text-white shadow-lg shadow-gold/30">
              {t(`accounts.${accountKey}.title`)}
            </span>
          </HeroIn>
        )}
        <HeroIn as="p" delay={0.1} className="mx-auto mt-5 max-w-2xl text-pretty text-center text-base leading-relaxed text-white/80 md:text-lg">
          {t(`accounts.${accountKey}.subtitle`)}
        </HeroIn>
      </div>
    </section>
  );
}
