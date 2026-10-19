'use client';
/**
 * Section reveal on scroll for the whole site — settings in src/config/reveal.js.
 * Mounted once (src/components/Providers.jsx); re-scans on every page change.
 *
 * Sections already on screen when the page loads are left alone (no flash, no LCP delay);
 * only sections below the fold are hidden and revealed by one IntersectionObserver.
 * The animation itself is a CSS transition (globals.css → [data-reveal]). State lives in the attribute
 * (wait → in), not in className, so React re-renders can't undo it.
 */
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { REVEAL } from '@/config/reveal';

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (!REVEAL.enabled || !('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const root = document.documentElement.style;
    root.setProperty('--reveal-d', `${REVEAL.duration}s`);
    root.setProperty('--reveal-y', `${REVEAL.distance}px`);
    root.setProperty('--reveal-s', String(REVEAL.scale));
    root.setProperty('--reveal-ease', REVEAL.easing);

    const auto = [...document.querySelectorAll(REVEAL.selector)].filter((el) => !el.hasAttribute('data-no-reveal'));
    const manual = [...document.querySelectorAll('[data-reveal]')];
    const els = [...new Set([...auto, ...manual])].filter((el) => el.getAttribute('data-reveal') !== 'in');

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) show(e.target);
        });
      },
      { rootMargin: REVEAL.rootMargin, threshold: 0.01 }
    );

    const pending = new Set();
    const show = (el) => {
      el.setAttribute('data-reveal', 'in');
      io.unobserve(el);
      pending.delete(el);
    };
    // safety net for fast jumps (anchor links, "back to top", scroll restoration): anything at or above
    // the viewport bottom is shown, so no section can stay hidden
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        pending.forEach((el) => el.getBoundingClientRect().top < window.innerHeight && show(el));
        if (!pending.size) window.removeEventListener('scroll', onScroll);
      });
    };

    els.forEach((el) => {
      // already on screen (or scrolled past) → show it as is
      if (el.getBoundingClientRect().top < window.innerHeight) {
        if (el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', 'in');
        return;
      }
      el.setAttribute('data-reveal', 'wait');
      pending.add(el);
      io.observe(el);
    });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return null;
}
