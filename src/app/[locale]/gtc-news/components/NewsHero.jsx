'use client';
/** Dark hero of the GTC News pages: breadcrumb, optional back link + kicker, title ([accent]), copy, `aside` card. */
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import NavLink from '@/components/shared/nav/NavLink';
import Breadcrumb from '@/components/shared/Breadcrumb';
import HeroBackdrop from '@/components/shared/HeroBackdrop';
import { AccentTitle } from '@/components/shared/SectionIntro';
import { EASE } from '@/components/motion';
import { cn } from '@/lib/utils';

export default function NewsHero({ crumbs, back, kicker, title, description, aside, children, titleClassName }) {
  return (
    <section className="is-dark relative overflow-hidden bg-ink pb-16 pt-36 text-white md:pb-20 md:pt-44">
      <HeroBackdrop />
      <div className="container-x relative">
        <Breadcrumb className="lg:justify-start" items={crumbs} />
        <div className={cn('mt-10', aside && 'grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]')}>
          <div className="text-center lg:text-start">
            {back && (
              <NavLink href={back.href} className="inline-flex items-center gap-1.5 text-sm font-medium text-white/55 transition-colors hover:text-gold-200">
                <ArrowLeft className="size-4 rtl:-scale-x-100" />
                {back.label}
              </NavLink>
            )}
            {kicker}
            <motion.h1 className={cn('heading-page mt-5 text-balance', titleClassName)} initial={{ y: 20 }} animate={{ y: 0 }} transition={{ duration: 0.75, ease: EASE }}>
              <AccentTitle text={title} />
            </motion.h1>
            {description && (
              <motion.p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/65 md:text-lg lg:mx-0" initial={{ y: 10 }} animate={{ y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}>
                {description}
              </motion.p>
            )}
            {children}
          </div>
          {aside}
        </div>
      </div>
    </section>
  );
}
