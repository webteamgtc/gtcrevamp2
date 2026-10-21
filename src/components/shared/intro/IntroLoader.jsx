'use client';
/**
 * Opening intro: an outlined "GTCFX" wordmark fills with colour from left to right, then fades away.
 *
 *  - plays once per browser session, never for visitors who turn off animations (decided before paint by
 *    the inline script in introScript.js → <html data-intro="play|skip">)
 *  - the page loads underneath the whole time; ~1.3 s (longer only while the page is still loading,
 *    never more than 2.4 s); a CSS fallback removes it even if scripts fail (globals.css → #gtc-intro)
 *  - fires `gtc:intro-leave` as it starts fading (the region popups open then, underneath it, so the intro
 *    dissolves straight into the popup) and `gtc:intro-done` once it is gone (geo/geoClient.js)
 */
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';

const MIN_MS = 1300;
const MAX_MS = 2400;
const EASE = [0.22, 1, 0.36, 1];

function leaving() {
  window.__gtcIntroLeaving = true;
  window.dispatchEvent(new Event('gtc:intro-leave'));
}

function finish() {
  try {
    sessionStorage.setItem('gtc_intro', '1');
  } catch {}
  document.documentElement.dataset.intro = 'done';
  window.__gtcIntroDone = true;
  window.dispatchEvent(new Event('gtc:intro-done'));
}

export default function IntroLoader() {
  const t = useTranslations('geo.intro');
  const [phase, setPhase] = useState('show'); // show → leave → gone

  useEffect(() => {
    if (document.documentElement.dataset.intro !== 'play') {
      setPhase('gone');
      return;
    }
    let cancelled = false;
    const loaded = new Promise((r) => (document.readyState === 'complete' ? r() : window.addEventListener('load', r, { once: true })));
    const minWait = new Promise((r) => setTimeout(r, MIN_MS));
    const maxWait = new Promise((r) => setTimeout(r, MAX_MS));
    Promise.race([Promise.all([loaded, minWait]), maxWait]).then(() => {
      if (cancelled) return;
      leaving();
      setPhase('leave');
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (phase === 'gone') return null;
  const out = phase === 'leave';
  return (
    <motion.div
      id="gtc-intro"
      role="status"
      aria-label={t('loading')}
      className="fixed inset-0 z-[200] place-items-center bg-brand-950"
      animate={{ opacity: out ? 0 : 1 }}
      transition={{ duration: 0.5, ease: EASE }}
      onAnimationComplete={() => {
        if (!out) return;
        finish();
        setPhase('gone');
      }}
    >
      <motion.p className="relative text-5xl font-bold tracking-[0.08em] md:text-7xl" dir="ltr" aria-hidden animate={{ scale: out ? 1.06 : 1 }} transition={{ duration: 0.5, ease: EASE }}>
        <span className="text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.3)]">GTCFX</span>
        <motion.span className="absolute inset-0 text-white" initial={{ clipPath: 'inset(0 100% 0 0)' }} animate={{ clipPath: 'inset(0 0% 0 0)' }} transition={{ duration: 1, delay: 0.15, ease: [0.65, 0, 0.35, 1] }}>
          GTC<span className="text-gold">FX</span>
        </motion.span>
      </motion.p>
    </motion.div>
  );
}
