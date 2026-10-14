'use client';
/**
 * Scroll-driven steps for a pinned section.
 * Desktop (≥1024px wide, ≥760px tall): the section is pinned and each step of
 * scrolling moves to the next item. Smaller screens fall back to auto-advance.
 *
 *   const s = useScrollSteps(count, { autoMs: 7000 });
 *   <section ref={s.outerRef} style={s.outerStyle}>
 *     <div className={s.pinned ? 'sticky top-0 flex h-screen items-center' : ''}>…</div>
 *   </section>
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, useMotionValueEvent, useScroll, animate } from 'motion/react';

const STEP_VH = 70; // scroll distance per item

export function useScrollSteps(count, { autoMs = 7000, start = 0 } = {}) {
  const outerRef = useRef(null);
  const [pinned, setPinned] = useState(false);
  const [index, setIndex] = useState(start);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const inView = useInView(outerRef, { amount: 0.3 });
  const progress = useMotionValue(0); // 0..1 within the current step (drives the progress line)

  useEffect(() => {
    const m = window.matchMedia('(min-width: 1024px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)');
    const on = () => setPinned(m.matches);
    on();
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);

  const set = useCallback((k) => {
    setIndex((cur) => {
      if (k !== cur) setDir(k > cur ? 1 : -1);
      return k;
    });
  }, []);

  // pinned: index follows the scroll position
  const { scrollYProgress } = useScroll({ target: outerRef, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!pinned) return;
    const pos = Math.min(0.9999, Math.max(0, v)) * count;
    const k = Math.floor(pos);
    progress.set(pos - k);
    set(k);
  });

  // not pinned: auto-advance while visible, pause on hover
  useEffect(() => {
    if (pinned || paused || !inView || count < 2) return;
    progress.set(0);
    const a = animate(progress, 1, { duration: autoMs / 1000, ease: 'linear' });
    const tm = setTimeout(() => set((index + 1) % count), autoMs);
    return () => {
      a.stop();
      clearTimeout(tm);
    };
  }, [pinned, paused, inView, index, count, autoMs, set, progress]);

  /** jump to an item: scrolls when pinned, switches directly otherwise */
  const goTo = useCallback(
    (k) => {
      const n = (k + count) % count;
      if (pinned && outerRef.current) {
        const el = outerRef.current;
        const top = el.getBoundingClientRect().top + window.scrollY;
        const travel = el.offsetHeight - window.innerHeight;
        window.scrollTo({ top: top + ((n + 0.5) / count) * travel, behavior: 'smooth' });
      } else {
        set(n);
      }
    },
    [pinned, count, set]
  );

  const outerStyle = pinned ? { height: `calc(100vh + ${(count - 1) * STEP_VH}vh)` } : undefined;
  const hover = { onMouseEnter: () => setPaused(true), onMouseLeave: () => setPaused(false) };

  return { outerRef, outerStyle, pinned, index, dir, progress, goTo, hover };
}
