'use client';
import { motion } from 'motion/react';
import { Reveal } from '@/components/motion';
import { cn } from '@/lib/utils';

/** Renders a title with its last word in the accent gradient ("About <GTCFX>"). */
export function AccentTitle({ text, words = 1 }) {
  const parts = String(text).trim().split(/\s+/);
  if (parts.length <= words) return <span className="heading-accent">{text}</span>;
  const head = parts.slice(0, -words).join(' ');
  const tail = parts.slice(-words).join(' ');
  return (
    <>
      {head} <span className="heading-accent">{tail}</span>
    </>
  );
}

/**
 * Section intro used across inner pages.
 * layout 'center' (title + text centred) or 'split' (title start, text end)
 */
export function SectionIntro({ title, sub, description, layout = 'center', dark = false, className, children }) {
  const muted = dark ? 'text-white/60' : 'text-ink/60';
  if (layout === 'split') {
    return (
      <div className={cn('grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-16', dark && 'is-dark', className)}>
        <Reveal y={16}>
          <h2 className="heading-section">
            <AccentTitle text={title} />
          </h2>
          {sub && <p className="mt-3 text-base font-semibold text-brand md:text-lg">{sub}</p>}
        </Reveal>
        <Reveal y={12} delay={0.1}>
          <p className={cn('text-pretty text-[15px] leading-relaxed md:text-base', muted)}>{description}</p>
          {children}
        </Reveal>
      </div>
    );
  }
  return (
    <div className={cn('mx-auto max-w-3xl text-center', dark && 'is-dark', className)}>
      <Reveal y={16}>
        <h2 className="heading-section">
          <AccentTitle text={title} />
        </h2>
      </Reveal>
      {description && (
        <Reveal y={12} delay={0.1}>
          <p className={cn('mx-auto mt-5 max-w-2xl text-pretty text-[15px] leading-relaxed md:text-base', muted)}>{description}</p>
        </Reveal>
      )}
      {children}
    </div>
  );
}

/** Little "keep scrolling" cue for pinned sections; dots show which step you are on. */
export function ScrollHint({ text, count, index, onPick, labels = [] }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center">
      <div className="pointer-events-auto flex items-center gap-4 rounded-full border border-brand/10 bg-white/90 py-2 pe-2 ps-4 text-xs font-semibold text-ink/55 shadow-lg shadow-brand/10 backdrop-blur">
        <span className="flex items-center gap-2">
          <span className="relative flex h-6 w-4 justify-center rounded-full border-2 border-ink/25" aria-hidden>
            <motion.span className="mt-1 h-1.5 w-1 rounded-full bg-gold" animate={{ y: [0, 7, 0], opacity: [1, 0.2, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />
          </span>
          {text}
        </span>
        <span className="flex gap-1.5">
          {Array.from({ length: count }).map((_, k) => (
            <button key={k} type="button" onClick={() => onPick(k)} aria-label={labels[k]} className={cn('h-1.5 rounded-full transition-all duration-500', k === index ? 'w-6 bg-brand' : 'w-1.5 bg-brand/25 hover:bg-brand/50')} />
          ))}
        </span>
      </div>
    </div>
  );
}
