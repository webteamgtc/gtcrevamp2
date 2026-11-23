'use client';
/**
 * Cookie consent modal of the UAE CAT 5 website. Opens until the visitor chooses (accept all / reject non-essential /
 * per-category); the footer's "Cookie Settings" reopens it on the preferences view (openConsentSettings).
 * The choice (src/lib/consent.js) decides which tags src/components/shared/consent/ConsentScripts.jsx loads.
 */
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'motion/react';
import { BarChart3, ChevronLeft, Cookie, Lock, Megaphone, ShieldCheck, X } from 'lucide-react';
import { CAT5_DOCS } from '@/config/regions';
import { CONSENT_OPEN_EVENT, getConsent, setConsent } from '@/lib/consent';
import { EASE } from '@/components/motion';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { key: 'necessary', Icon: ShieldCheck, locked: true },
  { key: 'analytics', Icon: BarChart3 },
  { key: 'advertising', Icon: Megaphone }
];

function Switch({ on, locked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={locked}
      onClick={() => onChange(!on)}
      className={cn('relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300', on ? 'bg-brand' : 'bg-ink/15', locked && 'cursor-not-allowed opacity-70')}
    >
      <motion.span className="absolute top-1 grid size-5 place-items-center rounded-full bg-white shadow" animate={{ insetInlineStart: on ? 24 : 4 }} transition={{ type: 'spring', stiffness: 500, damping: 32 }}>
        {locked && <Lock className="size-2.5 text-brand" />}
      </motion.span>
    </button>
  );
}

export default function Cat5CookieConsent() {
  const t = useTranslations('marketingPage.cookies');
  const [open, setOpen] = useState(false);
  const [view, setView] = useState('main');
  const [choice, setChoice] = useState({ analytics: false, advertising: false });
  const [answered, setAnswered] = useState(true);
  const firstBtn = useRef(null);

  useEffect(() => {
    const saved = getConsent();
    setAnswered(Boolean(saved));
    if (saved) setChoice(saved);
    else {
      setView('main');
      setOpen(true);
    }
    const reopen = () => {
      const s = getConsent();
      if (s) setChoice(s);
      setView('manage');
      setOpen(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, []);

  // keyboard: focus the dialog on open; Esc closes only when the visitor has already chosen
  useEffect(() => {
    if (!open) return undefined;
    const id = setTimeout(() => firstBtn.current?.focus(), 350);
    const onKey = (e) => e.key === 'Escape' && answered && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(id);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, answered, view]);

  const save = (value) => {
    setConsent(value);
    setAnswered(true);
    setOpen(false);
  };

  const cookieDoc = CAT5_DOCS.find((d) => d.key === 'cookies');
  const policy = (chunks) =>
    cookieDoc ? (
      <a href={cookieDoc.file} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand underline underline-offset-4 hover:text-gold-600">
        {chunks}
      </a>
    ) : (
      <span className="font-semibold text-ink">{chunks}</span>
    );

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[90] flex items-end justify-center p-3 sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]" aria-hidden onClick={() => answered && setOpen(false)} />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cat5-cookie-title"
            className="relative w-full max-w-lg overflow-hidden rounded-[1.75rem] bg-white shadow-2xl ring-1 ring-brand/10"
            initial={{ y: 60, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {/* header */}
            <div className="is-dark relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-900 to-ink px-6 pb-5 pt-6 text-white">
              <div className="bg-grid-dark absolute inset-0 opacity-50" aria-hidden />
              <motion.span className="absolute -end-12 -top-12 size-40 rounded-full bg-gold/30 blur-3xl" animate={{ opacity: [0.45, 0.9, 0.45] }} transition={{ duration: 5, repeat: Infinity }} aria-hidden />
              <div className="relative flex items-center gap-3">
                {view === 'manage' ? (
                  <button type="button" onClick={() => setView('main')} aria-label={t('back')} className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 ring-1 ring-white/15 transition-colors hover:bg-white/20">
                    <ChevronLeft className="size-5 rtl:-scale-x-100" />
                  </button>
                ) : (
                  <motion.span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold text-white shadow-lg shadow-gold/30" initial={{ rotate: -20, scale: 0.6 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.15 }}>
                    <Cookie className="size-5" />
                  </motion.span>
                )}
                <h2 id="cat5-cookie-title" className="flex-1 text-lg font-bold">
                  {view === 'manage' ? t('manage') : t('title')}
                </h2>
                {answered && (
                  <button type="button" onClick={() => setOpen(false)} aria-label={t('close')} className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20">
                    <X className="size-4" />
                  </button>
                )}
              </div>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {view === 'main' ? (
                <motion.div key="main" className="p-6" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}>
                  <p className="text-[15px] leading-relaxed text-ink/70">{t.rich('text', { link: policy })}</p>
                  <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                    <button ref={firstBtn} type="button" onClick={() => save({ analytics: true, advertising: true })} className="h-12 rounded-full bg-brand text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand-700 sm:order-2">
                      {t('acceptAll')}
                    </button>
                    <button type="button" onClick={() => save({ analytics: false, advertising: false })} className="h-12 rounded-full bg-white text-sm font-semibold text-brand ring-1 ring-brand/25 transition-colors hover:bg-brand-50 sm:order-1">
                      {t('rejectAll')}
                    </button>
                  </div>
                  <button type="button" onClick={() => setView('manage')} className="mx-auto mt-4 block text-sm font-semibold text-ink/60 underline-offset-4 transition-colors hover:text-brand hover:underline">
                    {t('manage')}
                  </button>
                </motion.div>
              ) : (
                <motion.div key="manage" className="p-6" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.25 }}>
                  <ul className="space-y-2.5">
                    {CATEGORIES.map(({ key, Icon, locked }, i) => {
                      const on = locked || choice[key];
                      return (
                        <motion.li key={key} className={cn('flex items-start gap-3.5 rounded-2xl p-4 ring-1 transition-colors', on ? 'bg-brand-50/60 ring-brand/15' : 'bg-white ring-brand/10')} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                          <span className={cn('grid size-10 shrink-0 place-items-center rounded-xl', on ? 'bg-brand text-white' : 'bg-[#f6f7fb] text-brand')}>
                            <Icon className="size-5" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex flex-wrap items-center gap-2 font-semibold text-ink">
                              {t(`categories.${key}.title`)}
                              {locked && <span className="rounded-full bg-gold-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-700">{t('alwaysOn')}</span>}
                            </span>
                            <span className="mt-1 block text-[13px] leading-relaxed text-ink/60">{t(`categories.${key}.text`)}</span>
                          </span>
                          <Switch on={on} locked={locked} label={t(`categories.${key}.title`)} onChange={(v) => setChoice((c) => ({ ...c, [key]: v }))} />
                        </motion.li>
                      );
                    })}
                  </ul>
                  <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                    <button ref={firstBtn} type="button" onClick={() => save(choice)} className="h-12 rounded-full bg-brand text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand-700 sm:order-2">
                      {t('save')}
                    </button>
                    <button type="button" onClick={() => save({ analytics: true, advertising: true })} className="h-12 rounded-full bg-white text-sm font-semibold text-brand ring-1 ring-brand/25 transition-colors hover:bg-brand-50 sm:order-1">
                      {t('acceptAll')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
