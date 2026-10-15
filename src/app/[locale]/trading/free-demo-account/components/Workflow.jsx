'use client';
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { Stagger, StaggerItem } from '@/components/motion';
import { SectionIntro } from '@/components/shared/SectionIntro';

/** Four numbered steps joined by a dashed line; a gold pulse travels along it and the tiles pop in. */
export function Workflow() {
  const t = useTranslations('freeDemoAccount.workflow');
  const steps = t.raw('steps');

  return (
    <section id="workflow" className="relative overflow-hidden bg-[#eef0f5] py-14 text-ink md:py-24">
      <div className="bg-dots-light mask-radial absolute inset-0 opacity-60" aria-hidden />
      <div className="absolute left-1/2 top-24 h-[360px] w-[760px] -translate-x-1/2 rounded-full bg-white/70 blur-[90px]" aria-hidden />
      <div className="container-x relative">
        <SectionIntro eyebrow={t('eyebrow')} title={t('title')} description={t('description')} />

        <div className="relative mt-14 md:mt-16">
          {/* dashed connector + travelling pulse (desktop) */}
          <div dir="ltr" className="pointer-events-none absolute inset-x-[12.5%] top-10 hidden lg:block" aria-hidden>
            <span className="block border-t-2 border-dashed border-brand/25" />
            <motion.span className="absolute -top-[5px] size-2.5 rounded-full bg-gold shadow-[0_0_14px_rgba(182,135,86,0.9)]" animate={{ left: ['0%', '100%'] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.6 }} />
          </div>

          <Stagger className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8" stagger={0.15}>
            {steps.map((s, i) => (
              <StaggerItem key={s.title} className="group flex flex-col items-center text-center">
                <motion.span
                  className="relative grid size-20 place-items-center rounded-[1.4rem] bg-gradient-to-br from-brand to-brand-900 text-2xl font-bold text-white shadow-xl shadow-brand/30"
                  initial={{ rotate: -12, scale: 0.6 }}
                  whileInView={{ rotate: -6, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.2 + i * 0.15 }}
                  whileHover={{ rotate: 0, scale: 1.08 }}
                >
                  <span className="absolute inset-0 rounded-[1.4rem] ring-4 ring-[#eef0f5]" aria-hidden />
                  {i + 1}
                </motion.span>
                <h3 className="heading-card mt-7 max-w-[15rem]">{s.title}</h3>
                <p className="mt-3 max-w-[17rem] text-[15px] leading-relaxed text-ink/60">{s.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
