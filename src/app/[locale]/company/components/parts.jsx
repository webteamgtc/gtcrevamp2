'use client';
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
