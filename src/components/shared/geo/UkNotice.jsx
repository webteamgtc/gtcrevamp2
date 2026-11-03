'use client';
/**
 * UK visitors (GB IP), two single-screen modals (no step 2):
 *  - browse — on site load (GeoGate): agree to continue browsing
 *  - account — Register / Open live account (UkGate): GMG link or dismiss
 * Copy: common.json → geo.uk
 */
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { ArrowRight, ExternalLink, FileText, Gavel, Info, Laptop, Users } from 'lucide-react';
import { AccentTitle } from '@/components/shared/SectionIntro';
import { UK_NOTICE } from '@/config/regions';
import { cn } from '@/lib/utils';
import { Gate, EASE } from './Gate';

const swap = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.28, ease: EASE } };
const btnPrimary =
  'inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-brand px-6 text-base font-semibold text-white shadow-lg shadow-brand/30 outline-none transition-colors hover:bg-brand-700 focus-visible:ring-4 focus-visible:ring-brand/25';
const btnOutline =
  'inline-flex h-14 w-full items-center justify-center gap-2 rounded-full border-2 border-brand px-6 text-base font-semibold text-brand outline-none transition-colors hover:bg-brand hover:text-white focus-visible:ring-4 focus-visible:ring-brand/25';

function Points({ items, icons }) {
  return (
    <ul className="mt-6 grid gap-2.5">
      {items.map((p, i) => {
        const Icon = icons[i] ?? Info;
        return (
          <motion.li
            key={p}
            className="flex items-center gap-3 rounded-2xl bg-[#f6f8fc] px-4 py-3.5 text-sm leading-relaxed text-ink/80"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12 + i * 0.08, duration: 0.4, ease: EASE }}
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-brand shadow-sm">
              <Icon className="size-4" />
            </span>
            {p}
          </motion.li>
        );
      })}
    </ul>
  );
}

function FullNotice({ label, text }) {
  return (
    <div className="mt-5 rounded-2xl border border-brand/10 border-s-4 border-s-gold p-4">
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-ink/50">
        <FileText className="size-3.5" /> {label}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-ink/70">{text}</p>
    </div>
  );
}

/** @param {'browse' | 'account'} mode */
export default function UkNotice({ mode = 'browse', onAccept, onDismiss }) {
  const t = useTranslations('geo.uk');
  const browse = mode === 'browse';

  return (
    <Gate labelledBy="geo-uk-title" bare className="max-w-xl bg-white p-7 sm:p-10">
      <motion.div {...swap}>
        <h2 id="geo-uk-title" className="heading-section !text-[2rem]">
          <AccentTitle text={t('title')} />
        </h2>
        {browse ? (
          <>
            <Points items={t.raw('confirmPoints')} icons={[Users, Laptop]} />
            <FullNotice label={t('fullNotice')} text={t('confirmText')} />
            <button type="button" onClick={onAccept} className={cn(btnPrimary, 'mt-7')}>
              {t('agree')} <ArrowRight className="size-4 rtl:-scale-x-100" />
            </button>
          </>
        ) : (
          <>
            <Points items={t.raw('points')} icons={[Gavel, Info, Users]} />
            <FullNotice label={t('fullNotice')} text={t('text')} />
            <div className="mt-7 grid gap-3">
              <a href={UK_NOTICE.gmgUrl} target="_blank" rel="noopener noreferrer" className={btnPrimary}>
                {t('visit')} <ExternalLink className="size-4" />
              </a>
              <button type="button" onClick={onDismiss} className={btnOutline}>
                {t('outside')} <ArrowRight className="size-4 rtl:-scale-x-100" />
              </button>
            </div>
          </>
        )}
      </motion.div>
    </Gate>
  );
}
