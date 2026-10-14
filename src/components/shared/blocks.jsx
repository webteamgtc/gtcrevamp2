'use client';
import { createContext, useContext, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { ArrowRight, Check, UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Reveal, WordReveal, EASE } from '../motion';

export const HeadingStyle = createContext('pill');

/**
 * Section heading. The visual style comes from <HeadingStyle.Provider value="pill|index|split">
 *  pill  – centered, eyebrow pill (Draft 1)
 *  index – left aligned, gold index number + drawn line (Draft 2)
 *  split – title left, subtitle right with a growing divider (Draft 3)
 */
export function SectionHeading({ eyebrow, title, titleB, subtitle, dark = false, align = 'center', index, className }) {
  const style = useContext(HeadingStyle);
  // size, weight, colour and gradient come from .heading-section / .heading-accent in globals.css
  const h2 = cn('heading-section', dark && 'is-dark');
  const sub = cn('text-pretty text-[15px] leading-relaxed md:text-base', dark ? 'text-white/60' : 'text-ink/60');
  const gradient = 'heading-accent';
  const Title = (
    <>
      <WordReveal text={title} />
      {titleB && (
        <>
          <br className="hidden md:block" />{' '}
          <WordReveal text={titleB} delay={0.15} wordClassName={gradient} />
        </>
      )}
    </>
  );

  if (style === 'index') {
    return (
      <div className={cn('max-w-3xl', className)}>
        {(index || eyebrow) && (
        <div className="flex items-center gap-4">
          {index && (
            <motion.span initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-mono text-sm font-semibold tabular-nums text-gold">
              {String(index).padStart(2, '0')}
            </motion.span>
          )}
          <motion.span className="h-px w-20 origin-left bg-gradient-to-r from-gold to-transparent rtl:origin-right" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: EASE }} />
          {eyebrow && (
            <Reveal y={0} x={-10} blur={0} delay={0.3}>
              <span className={cn('text-xs font-semibold uppercase tracking-[0.22em]', dark ? 'text-white/60' : 'text-ink/50')}>{eyebrow}</span>
            </Reveal>
          )}
        </div>
        )}
        <h2 className={cn(h2, (index || eyebrow) && 'mt-5')}>{Title}</h2>
        {subtitle && (
          <Reveal delay={0.2} y={16}>
            <p className={cn(sub, 'mt-4 max-w-xl')}>{subtitle}</p>
          </Reveal>
        )}
      </div>
    );
  }

  if (style === 'split') {
    return (
      <div className={cn('grid items-end gap-6', align !== 'start' && 'md:grid-cols-[1.2fr_1fr] md:gap-12', className)}>
        <div>
          {eyebrow && (
            <Reveal y={10} blur={0}>
              <span className={cn('inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]', dark ? 'text-gold-200' : 'text-gold-700')}>
                <motion.span className="size-2 rounded-sm bg-gold" animate={{ rotate: [0, 90, 180, 270, 360] }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} />
                {eyebrow}
              </span>
            </Reveal>
          )}
          <h2 className={cn(h2, eyebrow && 'mt-4')}>{Title}</h2>
        </div>
        {subtitle && (
          <div className="relative ps-6">
            <motion.span className={cn('absolute start-0 top-0 h-full w-px origin-top', dark ? 'bg-white/20' : 'bg-brand/20')} initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: EASE }} />
            <Reveal delay={0.25} y={12}>
              <p className={sub}>{subtitle}</p>
            </Reveal>
          </div>
        )}
      </div>
    );
  }

  // pill (default)
  return (
    <div className={cn(align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl', className)}>
      {eyebrow && (
        <Reveal y={12} blur={0}>
          <span
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.18em]',
              dark ? 'border-gold/30 bg-gold/10 text-gold-200' : 'border-gold/30 bg-gold-50 text-gold-700'
            )}
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-gold opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-gold" />
            </span>
            {eyebrow}
          </span>
        </Reveal>
      )}
      <h2 className={cn(h2, eyebrow && 'mt-5')}>{Title}</h2>
      {subtitle && (
        <Reveal delay={0.2} y={16}>
          <p className={cn(sub, 'mt-4', align === 'center' && 'mx-auto max-w-2xl')}>{subtitle}</p>
        </Reveal>
      )}
    </div>
  );
}

/** Slow drifting blurred blobs for section backgrounds */
export function Ambient({ tone = 'light', className }) {
  const a = tone === 'dark' ? 'bg-brand/35' : 'bg-brand-200/45';
  const b = tone === 'dark' ? 'bg-gold/20' : 'bg-gold-200/45';
  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <motion.div className={cn('absolute -start-32 top-10 size-[420px] rounded-full blur-[110px]', a)} animate={{ x: [0, 80, 0], y: [0, 50, 0] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className={cn('absolute -end-24 bottom-0 size-[360px] rounded-full blur-[110px]', b)} animate={{ x: [0, -70, 0], y: [0, -40, 0] }} transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut' }} />
    </div>
  );
}

/** Placeholder portrait until real CEO / GM photos are supplied */
export function Portrait({ initials, className, dark = false, tone = 'brand' }) {
  const t = useTranslations('leaders');
  return (
    <div
      className={cn(
        'relative flex h-full w-full items-end justify-center overflow-hidden',
        tone === 'gold' ? 'bg-gradient-to-b from-gold-200 via-gold to-gold-700' : 'bg-gradient-to-b from-brand-400 via-brand to-brand-950',
        className
      )}
    >
      <div className="bg-dots-dark absolute inset-0 opacity-40" />
      <motion.div
        className="absolute inset-x-0 top-1/2 mx-auto size-56 -translate-y-1/2 rounded-full bg-white/20 blur-3xl"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <UserRound className="relative size-[78%] translate-y-[12%] text-white/25" strokeWidth={1} />
      <span className="absolute start-5 top-5 rounded-full bg-black/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/80 backdrop-blur">
        {t('placeholder')} · {initials}
      </span>
    </div>
  );
}

/** Lead-capture registration form */
export function RegisterForm({ dark = false, className, wide = false }) {
  const t = useTranslations('register');
  const [done, setDone] = useState(false);
  const field = cn(
    'peer h-14 w-full rounded-2xl border px-4 pt-4 text-[15px] outline-none transition-all placeholder-transparent focus:ring-4',
    dark
      ? 'border-white/15 bg-white/5 text-white focus:border-gold focus:ring-gold/15'
      : 'border-brand/15 bg-white text-ink focus:border-brand focus:ring-brand/10'
  );
  const label = cn(
    'pointer-events-none absolute start-4 top-1.5 text-[11px] font-medium transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-[15px] peer-focus:top-1.5 peer-focus:text-[11px]',
    dark ? 'text-white/50 peer-focus:text-gold' : 'text-ink/50 peer-focus:text-brand'
  );
  const inputs = wide
    ? [
        ['firstName', 'text', 'col-span-1'],
        ['lastName', 'text', 'col-span-1'],
        ['email', 'email', 'col-span-2 md:col-span-1'],
        ['phone', 'tel', 'col-span-1'],
        ['country', 'text', 'col-span-1']
      ]
    : [
        ['firstName', 'text', 'col-span-1'],
        ['lastName', 'text', 'col-span-1'],
        ['email', 'email', 'col-span-2'],
        ['phone', 'tel', 'col-span-2 sm:col-span-1'],
        ['country', 'text', 'col-span-2 sm:col-span-1']
      ];
  return (
    <form
      id="register-form"
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
      className={cn('grid grid-cols-2 gap-3', wide && 'md:grid-cols-3', className)}
    >
      {inputs.map(([name, type, span], i) => (
        <motion.div
          key={name}
          className={cn('relative', span)}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 + i * 0.07, duration: 0.6, ease: EASE }}
        >
          <input id={`rf-${name}`} name={name} type={type} placeholder={t(name)} className={field} required />
          <label htmlFor={`rf-${name}`} className={label}>
            {t(name)}
          </label>
        </motion.div>
      ))}
      <motion.button
        type="submit"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'shine group col-span-2 mt-2 inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r bg-[length:200%_auto] font-semibold text-white shadow-xl transition-[background-position] duration-700 hover:bg-right',
          dark ? 'from-gold-600 via-gold to-gold-600 shadow-gold/25' : 'from-brand via-brand-500 to-brand shadow-brand/30',
          wide && 'md:col-span-1 md:mt-0'
        )}
      >
        {done ? <Check className="size-5" /> : null}
        {t('submit')}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
      </motion.button>
      <p className={cn('col-span-2 text-center text-xs', wide && 'md:col-span-3', dark ? 'text-white/45' : 'text-ink/45')}>{t('consent')}</p>
    </form>
  );
}

/** 4-step onboarding line that draws itself */
export function Steps({ dark = false }) {
  const t = useTranslations('register');
  const steps = t.raw('steps');
  return (
    <div className="relative mt-10 grid grid-cols-4 gap-2">
      <div className={cn('absolute inset-x-[12%] top-5 h-px', dark ? 'bg-white/10' : 'bg-brand/10')} />
      <motion.div
        className="absolute start-[12%] top-5 h-px bg-gradient-to-r from-gold to-brand-300"
        initial={{ width: 0 }}
        whileInView={{ width: '76%' }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.3 }}
      />
      {steps.map((s, i) => (
        <motion.div
          key={s}
          className="relative flex flex-col items-center gap-3 text-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + i * 0.4 }}
        >
          <span className={cn('grid size-10 place-items-center rounded-full border text-sm font-bold', dark ? 'border-gold/40 bg-ink text-gold' : 'border-brand/20 bg-white text-brand')}>
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className={cn('text-sm font-medium', dark ? 'text-white/70' : 'text-ink/70')}>{s}</span>
        </motion.div>
      ))}
    </div>
  );
}
