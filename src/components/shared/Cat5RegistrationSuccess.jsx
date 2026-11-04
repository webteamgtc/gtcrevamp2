'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Mail, Sparkles } from 'lucide-react';
import { AccentTitle } from '@/components/shared/SectionIntro';
import { CAT5_CONTACT } from '@/config/regions';
import { buildCat5PortalRedirectUrl } from '@/lib/cat5Portal';
import { cn } from '@/lib/utils';

export default function Cat5RegistrationSuccess({ email, firstName, portalUrl, page = false, className }) {
  const t = useTranslations('cat5RegisterPage.success');
  const loginHref = portalUrl || buildCat5PortalRedirectUrl({ email });
  const steps = t.raw('steps');

  return (
    <div id="cat5-registration-success" className={cn('overflow-hidden rounded-[1.75rem] border border-white/10 bg-white text-ink shadow-[0_40px_100px_-30px_rgba(41,59,147,0.45)]', className)}>
      <div className="is-dark relative overflow-hidden bg-gradient-to-br from-brand via-brand-800 to-brand-950 px-6 py-10 text-center text-white md:px-10 md:py-12">
        <span className="bg-grid-dark absolute inset-0 opacity-40" aria-hidden />
        <motion.span
          className="absolute -end-16 -top-20 size-56 rounded-full bg-gold/30 blur-3xl"
          animate={{ opacity: [0.35, 0.75, 0.35] }}
          transition={{ duration: 5, repeat: Infinity }}
          aria-hidden
        />
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          className="relative mx-auto grid size-16 place-items-center rounded-full bg-white/10 ring-2 ring-gold/40 backdrop-blur md:size-[4.5rem]"
        >
          <CheckCircle2 className="size-9 text-gold-200 md:size-10" strokeWidth={1.75} />
        </motion.div>
        <motion.h2
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.08, duration: 0.5 }}
          className="relative heading-title mt-6 text-balance text-white"
        >
          <AccentTitle text={t('title')} accentClassName="text-gold-200" />
        </motion.h2>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.14, duration: 0.5 }}
          className="relative mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/80 md:text-base"
        >
          {firstName ? t('leadNamed', { name: firstName }) : t('lead')}
        </motion.p>
      </div>

      <div className={cn('relative', page ? 'space-y-8 p-6 md:p-10' : 'space-y-6 p-5 md:p-7')}>
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.45 }}
          className="rounded-2xl border border-brand/10 bg-gradient-to-br from-[#f6f8fc] to-white p-5 ring-1 ring-brand/[0.06] md:p-6"
        >
          <p className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-brand/70">
            <Mail className="size-4 text-gold-700" aria-hidden />
            {t('emailLabel')}
          </p>
          <p dir="ltr" className="mt-3 break-all text-center text-base font-semibold text-ink md:text-lg">
            {email}
          </p>
          <p className="mt-3 text-center text-[13px] leading-relaxed text-ink/55">{t('emailTip')}</p>
        </motion.div>

        <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.28, duration: 0.45 }}>
          <p className="flex items-center gap-2 text-sm font-bold text-ink">
            <Sparkles className="size-4 text-gold-700" aria-hidden />
            {t('stepsTitle')}
          </p>
          <ol className="mt-4 space-y-3">
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-3 rounded-xl bg-white p-4 ring-1 ring-brand/[0.08]">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand text-xs font-bold text-white shadow-md shadow-brand/25">{i + 1}</span>
                <span className="min-w-0 pt-0.5">
                  <span className="block text-sm font-semibold text-ink">{step.title}</span>
                  <span className="mt-1 block text-[13px] leading-relaxed text-ink/60">{step.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </motion.div>

        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.36, duration: 0.45 }}
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <a
            href={loginHref}
            target="_blank"
            rel="noopener noreferrer"
            className="shine inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-brand-900 px-6 text-sm font-bold text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand sm:text-base"
          >
            {t('portalCta')}
            <ArrowRight className="size-4 rtl:-scale-x-100" />
          </a>
          <a
            href={`mailto:${CAT5_CONTACT.email}`}
            className="inline-flex h-12 items-center justify-center rounded-full border border-brand/20 bg-white px-6 text-sm font-semibold text-brand transition-colors hover:bg-brand-50"
          >
            {t('supportCta')}
          </a>
        </motion.div>
        <p className="text-center text-xs leading-relaxed text-ink/45">{t('footerNote')}</p>
      </div>
    </div>
  );
}
