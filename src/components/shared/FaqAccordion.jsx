'use client';
import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { Stagger, StaggerItem, EASE } from '@/components/motion';
import { cn } from '@/lib/utils';

/**
 * Single-open FAQ list: items = [{ q, a }]. The first item starts open.
 * `numbered` shows 01, 02… badges; the open item gets a gold accent bar and a soft lift.
 */
export default function FaqAccordion({ items, defaultOpen = 0, numbered = false, className }) {
  const [open, setOpen] = useState(defaultOpen);
  const uid = useId();

  return (
    <Stagger className={cn('space-y-3', className)} stagger={0.07}>
      {items.map((it, i) => {
        const on = open === i;
        const panel = `${uid}-p${i}`;
        return (
          <StaggerItem key={it.q}>
            <motion.div layout transition={{ duration: 0.4, ease: EASE }} className={cn('relative overflow-hidden rounded-2xl border bg-white transition-[border-color,box-shadow] duration-500', on ? 'border-brand/20 shadow-xl shadow-brand/10' : 'border-brand/10 hover:border-brand/25 hover:shadow-md')}>
              {on && <motion.span layoutId={`${uid}-bar`} className="absolute inset-y-0 start-0 w-1 bg-gradient-to-b from-gold to-brand" aria-hidden />}
              <h3>
                <button type="button" aria-expanded={on} aria-controls={panel} onClick={() => setOpen(on ? -1 : i)} className="group flex w-full items-center gap-4 px-5 py-5 text-start md:px-7">
                  {numbered && (
                    <span className={cn('grid size-10 shrink-0 place-items-center rounded-xl text-xs font-bold tabular-nums transition-all duration-500', on ? 'bg-brand text-white shadow-lg shadow-brand/25' : 'bg-brand-50 text-brand ring-1 ring-brand/10 group-hover:bg-brand/10')}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  )}
                  <span className={cn('flex-1 text-[15px] font-semibold transition-colors md:text-base', on ? 'text-brand' : 'text-ink group-hover:text-brand')}>{it.q}</span>
                  <span className={cn('grid size-9 shrink-0 place-items-center rounded-full transition-all duration-500', on ? 'rotate-45 bg-gold text-white shadow-lg shadow-gold/30' : 'bg-white text-brand ring-1 ring-brand/15 group-hover:ring-brand/30')}>
                    <Plus className="size-4" />
                  </span>
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {on && (
                  <motion.div id={panel} role="region" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}>
                    <motion.p initial={{ y: -6 }} animate={{ y: 0 }} transition={{ duration: 0.4, ease: EASE }} className={cn('pb-6 pe-5 text-[15px] leading-relaxed text-ink/60 md:pe-7', numbered ? 'ps-[4.75rem] md:ps-[5.25rem]' : 'ps-5 md:ps-7')}>
                      {it.a}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
