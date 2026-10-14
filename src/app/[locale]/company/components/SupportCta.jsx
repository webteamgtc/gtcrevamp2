'use client';
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { Headset, Mail, MessageCircle, Globe, ShieldCheck, Clock3 } from 'lucide-react';
import { PORTAL } from '@/config/menu';
import ArrowLink from '@/components/shared/ArrowLink';
import NavLink from '@/components/shared/nav/NavLink';
import { Reveal } from '@/components/motion';
import { AccentTitle } from './parts';

const ORBIT = [Mail, MessageCircle, Globe, ShieldCheck, Clock3];

/** Support CTA: split card — text and buttons on one side, an animated support hub on the other. */
export function SupportCta() {
  const t = useTranslations('companyPage.ctaSection');
  return (
    <section id="support" className="relative bg-white pb-16 pt-4 text-ink md:pb-24">
      <div className="container-x">
        <Reveal y={30}>
          <div className="relative grid overflow-hidden rounded-[2rem] border border-brand/10 bg-gradient-to-br from-[#f6f7fb] via-white to-[#eef0f7] md:rounded-[2.5rem] lg:grid-cols-[1.15fr_1fr]">
            <div className="relative p-8 md:p-14">
              <h2 className="heading-section">
                <AccentTitle text={t('title')} words={2} />
              </h2>
              <p className="mt-6 max-w-xl text-pretty text-[15px] leading-relaxed text-ink/60 md:text-base">{t('description')}</p>
              <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
                <ArrowLink href={PORTAL.register}>{t('live')}</ArrowLink>
                <NavLink href={PORTAL.demo} className="group relative text-base font-semibold text-brand">
                  {t('demo')}
                  <span className="absolute -bottom-1 start-0 h-0.5 w-full origin-left scale-x-50 rounded-full bg-gold transition-transform duration-500 group-hover:scale-x-100 rtl:origin-right" />
                </NavLink>
              </div>
            </div>

            {/* support hub */}
            <div className="is-dark relative grid min-h-[340px] place-items-center overflow-hidden bg-gradient-to-br from-brand-800 via-brand-950 to-ink" aria-hidden>
              <div className="bg-grid-dark absolute inset-0 opacity-60" />
              <div className="absolute size-72 rounded-full bg-gold/25 blur-[90px]" />
              <div dir="ltr" className="relative size-[280px]">
                {[280, 200, 120].map((s, i) => (
                  <motion.span key={s} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" style={{ width: s, height: s }} animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 4, delay: i * 0.5, repeat: Infinity }} />
                ))}
                <motion.div className="absolute inset-0" animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}>
                  {ORBIT.map((Icon, i) => {
                    const a = (i / ORBIT.length) * Math.PI * 2;
                    return (
                      <motion.span key={i} className="absolute grid size-11 place-items-center rounded-2xl bg-white/10 text-gold-200 ring-1 ring-white/15 backdrop-blur" style={{ left: `calc(50% + ${Math.cos(a) * 140}px - 22px)`, top: `calc(50% + ${Math.sin(a) * 140}px - 22px)` }} animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}>
                        <Icon className="size-5" />
                      </motion.span>
                    );
                  })}
                </motion.div>
                <span className="absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-3xl bg-gradient-to-br from-gold to-gold-600 text-white shadow-[0_0_50px_rgba(182,135,86,0.55)]">
                  <motion.span animate={{ rotate: [0, -8, 8, 0] }} transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1 }}>
                    <Headset className="size-9" />
                  </motion.span>
                </span>
                <span className="absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-3xl bg-gold/20" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
