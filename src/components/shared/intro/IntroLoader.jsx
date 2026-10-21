'use client';
/**
 * Opening intro: the GTCFX logo over a Three.js globe of particles, then it lifts away to reveal the page.
 *
 *  - plays once per browser session, never for visitors who turn off animations (decided before paint by
 *    the inline script in src/app/[locale]/layout.js → <html data-intro="play|skip">)
 *  - the page loads underneath the whole time; the intro lasts ~1.6 s (longer only while the page is still
 *    loading, never more than 2.8 s) and a CSS fallback removes it even if scripts fail
 *  - the light version (CSS rings, sparkles, logo, progress line) always draws; the Three.js globe is added
 *    only on desktops with a mouse and 4+ CPU cores, without data saver, after the first paint — phones
 *    never download Three.js, so Core Web Vitals stay unaffected
 *  - when it ends it fires `gtc:intro-done` so the region popups can open (geo/geoClient.js → whenIntroDone)
 */
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'motion/react';
import Logo from '@/components/shared/Logo';

const MIN_MS = 1600;
const MAX_MS = 2800;
const EASE = [0.22, 1, 0.36, 1];

function finish() {
  try {
    sessionStorage.setItem('gtc_intro', '1');
  } catch {}
  document.documentElement.dataset.intro = 'done';
  window.__gtcIntroDone = true;
  window.dispatchEvent(new Event('gtc:intro-done'));
}

/** Light visuals (no WebGL): soft glow, two orbit rings drawing in, drifting gold sparkles. */
const SPARKS = Array.from({ length: 18 }, (_, i) => ({ x: (i * 37) % 100, y: (i * 61) % 100, d: (i % 5) * 0.25, s: 2 + (i % 3) }));
function LiteBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <motion.div className="absolute left-1/2 top-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/40 blur-[90px]" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.2, ease: EASE }} />
      {[300, 420].map((d, i) => (
        <motion.span
          key={d}
          className="absolute left-1/2 top-1/2 rounded-full border border-gold/30"
          style={{ width: d, height: d, marginLeft: -d / 2, marginTop: -d / 2 }}
          initial={{ scale: 0.4, opacity: 0, rotate: 0 }}
          animate={{ scale: 1, opacity: [0, 1, 0.6], rotate: i ? -90 : 90 }}
          transition={{ duration: 1.6, delay: 0.1 + i * 0.15, ease: EASE }}
        />
      ))}
      {SPARKS.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-gold-200"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.9, 0], scale: [0, 1, 0.6], y: -24 }}
          transition={{ duration: 1.8, delay: p.d, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

export default function IntroLoader() {
  const t = useTranslations('geo.intro');
  const canvas = useRef(null);
  const [phase, setPhase] = useState('show'); // show → leave → gone

  useEffect(() => {
    if (document.documentElement.dataset.intro !== 'play') {
      setPhase('gone');
      return;
    }
    let scene;
    let cancelled = false;
    const rich =
      matchMedia('(min-width: 1024px) and (pointer: fine)').matches && (navigator.hardwareConcurrency || 2) >= 4 && !navigator.connection?.saveData;
    if (rich)
      requestAnimationFrame(() =>
        setTimeout(() => {
          import('./introScene')
            .then(({ startIntroScene }) => {
              if (!cancelled && canvas.current) scene = startIntroScene(canvas.current);
            })
            .catch(() => {});
        }, 0)
      );
    const loaded = new Promise((r) => (document.readyState === 'complete' ? r() : window.addEventListener('load', r, { once: true })));
    const minWait = new Promise((r) => setTimeout(r, MIN_MS));
    const maxWait = new Promise((r) => setTimeout(r, MAX_MS));
    Promise.race([Promise.all([loaded, minWait]), maxWait]).then(() => !cancelled && setPhase('leave'));
    return () => {
      cancelled = true;
      scene?.stop();
    };
  }, []);

  if (phase === 'gone') return null;
  return (
    <AnimatePresence
      onExitComplete={() => {
        finish();
        setPhase('gone');
      }}
    >
      {phase === 'show' && (
        <motion.div
          id="gtc-intro"
          key="intro"
          role="status"
          aria-label={t('loading')}
          className="fixed inset-0 z-[200] place-items-center overflow-hidden bg-[radial-gradient(ellipse_at_center,#1b2a7a_0%,#0b1033_55%,#05071a_100%)]"
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(6px)' }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <LiteBackdrop />
          <canvas ref={canvas} className="absolute inset-0 size-full" aria-hidden />
          <div className="relative flex flex-col items-center">
            <motion.div initial={{ opacity: 0, scale: 0.85, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.35, ease: EASE }} className="drop-shadow-[0_8px_40px_rgba(41,59,147,0.9)]">
              <Logo onDark className="[&_img]:h-14 md:[&_img]:h-16" />
            </motion.div>
            <div className="mt-8 h-0.5 w-40 overflow-hidden rounded-full bg-white/10">
              <motion.div className="h-full origin-left bg-gradient-to-r from-gold to-gold-200 rtl:origin-right" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: MIN_MS / 1000, ease: [0.4, 0, 0.2, 1] }} />
            </div>
            <span className="sr-only">{t('loading')}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
