'use client';
/**
 * South African visitors: upfront disclosure (GTC Global SA (Pty) Ltd, FSP No. 51545) to acknowledge before using
 * the site (copy: common.json → geo.za).
 *  - remembered per tab: the acknowledgement is kept in sessionStorage, so it stays closed on reloads and while
 *    browsing in that tab, and shows again in every new tab / browser session
 *  - "I have read and acknowledge" or Escape acknowledges (and is saved); clicks outside do nothing
 *  - the Upfront Disclosure and the Customer Terms Agreement are not published on the website (they are given to
 *    clients on request), so they are not linked: the pop-up says how to get a copy (ZA_DOCUMENTS_EMAIL)
 */
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';
import { ZA_DOCUMENTS_EMAIL } from '@/config/regions';
import { Gate, EASE } from './Gate';

const KEY = 'gtc_za_notice';
let acknowledged = false; // when sessionStorage is blocked: remembered until the page is reloaded

export function zaAcknowledged() {
  try {
    return sessionStorage.getItem(KEY) === '1';
  } catch {
    return acknowledged;
  }
}

export function rememberZa() {
  acknowledged = true;
  try {
    sessionStorage.setItem(KEY, '1');
  } catch {}
}

const rise = (delay) => ({ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45, delay, ease: EASE } });

export default function ZaNotice({ onAccept }) {
  const t = useTranslations('geo.za');
  return (
    <Gate labelledBy="geo-za-title" bare onEscape={onAccept} className="max-w-2xl bg-white p-7 text-center sm:p-10">
      <motion.span {...rise(0.1)} className="mx-auto grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-brand to-brand-900 text-white shadow-[0_16px_40px_-12px_rgba(41,59,147,0.6)]">
        <ShieldCheck className="size-7" />
      </motion.span>
      <motion.p {...rise(0.15)} className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-gold-700">
        {t('eyebrow')}
      </motion.p>
      <motion.h2 {...rise(0.2)} id="geo-za-title" className="heading-title mt-3">
        {t('title')}
      </motion.h2>
      <motion.p {...rise(0.25)} className="mt-5 text-start text-[15px] leading-relaxed text-ink/65">
        {t('text')}
      </motion.p>
      <motion.p {...rise(0.3)} className="mt-6 rounded-2xl border border-gold/30 bg-gold-50/70 p-5 text-start text-sm leading-relaxed text-gold-700">
        {t('notice')}
      </motion.p>
      <motion.p {...rise(0.33)} className="mt-4 text-start text-[13px] leading-relaxed text-ink/55">
        {t.rich('documents', {
          email: ZA_DOCUMENTS_EMAIL,
          link: (chunks) => (
            <a href={`mailto:${ZA_DOCUMENTS_EMAIL}`} className="font-semibold text-brand underline decoration-brand/30 underline-offset-4 transition-colors hover:decoration-brand">
              {chunks}
            </a>
          )
        })}
      </motion.p>
      <motion.button {...rise(0.36)} type="button" onClick={onAccept} className="mt-8 inline-flex h-14 w-full items-center justify-center rounded-full bg-brand px-6 text-base font-semibold text-white shadow-lg shadow-brand/30 outline-none transition-colors hover:bg-brand-700 focus-visible:ring-4 focus-visible:ring-brand/25">
        {t('accept')}
      </motion.button>
    </Gate>
  );
}
