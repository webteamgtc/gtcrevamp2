/**
 * Scroll reveal — ONE place to control the section animation on every page.
 *
 * Every direct child of <main> except the first (the hero) fades in, rises and scales up slightly
 * the first time it scrolls into view. Nothing to add to pages: src/components/shared/ScrollReveal.jsx
 * (mounted once in Providers) finds the sections itself, also after client-side navigation.
 *
 *  - turn it off:            enabled: false
 *  - slower / faster:        duration (seconds)
 *  - more / less movement:   distance (px), scale (1 = no scaling)
 *  - skip one section:       add data-no-reveal to it
 *  - animate anything else:  add data-reveal to it (e.g. a block inside a long section)
 */
export const REVEAL = {
  enabled: true,
  duration: 1.4, // seconds
  distance: 64, // px the section rises
  scale: 0.96, // starting scale
  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
  selector: 'main > *:not(:first-child)', // sections that reveal automatically
  rootMargin: '0px 0px -12% 0px' // start when the section is 12% into the viewport
};
