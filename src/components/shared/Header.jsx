'use client';
import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { ChevronDown, Globe, LogIn, Menu, User, X, ArrowUpRight, Check } from 'lucide-react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { LOCALES, getDir } from '@/i18n/locales';
import { cn } from '@/lib/utils';
import Logo from './Logo';
import { MARKET_ICONS } from './icons';
import { EASE } from '../motion';

const GROUPS = ['company', 'trading', 'markets', 'learn', 'news'];

/**
 * theme: 'light' | 'dark' | 'overlay'
 *  overlay = transparent over a dark hero, turns white after scrolling.
 */
export default function Header({ theme = 'light', variant = 'bar' }) {
  const floating = variant === 'floating';
  const t = useTranslations('nav');
  const tr = useTranslations();
  const [open, setOpen] = useState(null);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const closeTimer = useRef();

  useMotionValueEvent(scrollY, 'change', (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(v > 30);
    setHidden(v > 500 && v > prev && !open);
  });

  const dark = theme === 'dark' || (theme === 'overlay' && !scrolled);
  const surface =
    theme === 'dark'
      ? scrolled
        ? 'bg-ink/80 border-white/10 shadow-2xl shadow-black/40'
        : 'bg-transparent border-transparent'
      : theme === 'overlay'
        ? scrolled
          ? 'bg-white/85 border-brand/10 shadow-xl shadow-brand/5'
          : 'bg-transparent border-transparent'
        : scrolled
          ? 'bg-white/85 border-brand/10 shadow-xl shadow-brand/5'
          : 'bg-white/40 border-transparent';

  const enter = (g) => {
    clearTimeout(closeTimer.current);
    setOpen(g);
  };
  const leave = () => {
    closeTimer.current = setTimeout(() => setOpen(null), 140);
  };

  return (
    <>
      <motion.header
        animate={{ y: hidden ? '-100%' : '0%' }}
        transition={{ duration: 0.45, ease: EASE }}
        className="fixed inset-x-0 top-0 z-50"
      >
        {/* Risk warning bar — always visible */}
        <div
          className={cn(
            'border-b text-[11px] leading-snug md:text-xs',
            dark ? 'border-white/10 bg-black/40 text-white/75' : 'border-brand/10 bg-brand-50/90 text-brand-800'
          )}
        >
          <div className="container-x py-2 backdrop-blur"><p className="line-clamp-2">{tr('riskBar')}</p></div>
        </div>

        <div className={cn(floating && 'container-x pt-3')}>
        <div
          className={cn(
            'backdrop-blur-xl transition-all duration-500',
            floating ? 'overflow-hidden rounded-[1.75rem] border border-brand/10 bg-white/85 shadow-xl shadow-brand/10' : cn('border-b', surface)
          )}
        >
          <nav className={cn('flex items-center justify-between gap-6 transition-all duration-500', floating ? 'px-4 md:px-6' : 'container-x', scrolled ? 'h-16' : floating ? 'h-[72px]' : 'h-20')}>
            <motion.a href="#" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: EASE }}>
              <Logo onDark={dark} />
            </motion.a>

            <ul className="hidden items-center gap-1 lg:flex" onMouseLeave={leave}>
              {GROUPS.map((g, i) => (
                <motion.li
                  key={g}
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.6, ease: EASE }}
                  onMouseEnter={() => enter(g)}
                  className="relative"
                >
                  <button
                    className={cn(
                      'group relative flex items-center gap-1 rounded-full px-4 py-2 text-[15px] font-medium transition-colors',
                      dark ? 'text-white/85 hover:text-white' : 'text-brand-900 hover:text-brand'
                    )}
                    aria-expanded={open === g}
                  >
                    {t(g)}
                    <ChevronDown className={cn('size-4 transition-transform duration-300', open === g && 'rotate-180')} />
                    <span className={cn('absolute inset-x-4 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-gold transition-transform duration-300 group-hover:scale-x-100', open === g && 'scale-x-100')} />
                  </button>
                </motion.li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <a
                href="#register"
                className={cn(
                  'hidden items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all md:inline-flex',
                  dark ? 'border-white/20 text-white hover:bg-white hover:text-brand-900' : 'border-brand/15 bg-white text-brand hover:border-brand'
                )}
              >
                <User className="size-4" /> {t('register')}
              </a>
              <a
                href="#"
                className={cn(
                  'hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all md:inline-flex',
                  dark ? 'text-white/80 hover:text-white' : 'text-brand-900/70 hover:text-brand'
                )}
              >
                <LogIn className="size-4" /> {t('login')}
              </a>
              <LanguageSwitcher dark={dark} />
              <button
                onClick={() => setMobile(true)}
                className={cn('grid size-10 place-items-center rounded-full lg:hidden', dark ? 'bg-white/10 text-white' : 'bg-brand-50 text-brand')}
                aria-label={t('menu')}
              >
                <Menu className="size-5" />
              </button>
            </div>
          </nav>

          {/* Mega menu */}
          <AnimatePresence>
            {open && (
              <motion.div
                key="mega"
                onMouseEnter={() => enter(open)}
                onMouseLeave={leave}
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className={cn('hidden overflow-hidden border-t lg:block', dark ? 'border-white/10 bg-ink/95' : floating ? 'border-brand/10' : 'border-brand/10 bg-white')}
              >
                <MegaPanel group={open} dark={dark} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </div>
      </motion.header>

      <MobileMenu open={mobile} onClose={() => setMobile(false)} />
    </>
  );
}

function MegaPanel({ group, dark }) {
  const t = useTranslations('nav');
  const items = t.raw(`groups.${group}`);
  const isMarkets = group === 'markets';
  return (
    <div className="container-x grid grid-cols-12 gap-8 py-8">
      <motion.div
        key={group}
        className="col-span-8 grid grid-cols-2 gap-2"
        initial="h"
        animate="s"
        variants={{ h: {}, s: { transition: { staggerChildren: 0.04 } } }}
      >
        {items.map((it, i) => {
          const Icon = isMarkets ? MARKET_ICONS[i] : null;
          return (
            <motion.a
              key={it.label}
              href="#"
              variants={{ h: { opacity: 0, y: 10 }, s: { opacity: 1, y: 0 } }}
              className={cn(
                'group flex items-start gap-4 rounded-2xl p-4 transition-all',
                dark ? 'hover:bg-white/5' : 'hover:bg-brand-50'
              )}
            >
              <span
                className={cn(
                  'grid size-10 shrink-0 place-items-center rounded-xl transition-all group-hover:scale-110 group-hover:rotate-6',
                  dark ? 'bg-white/5 text-gold' : 'bg-brand-50 text-brand group-hover:bg-brand group-hover:text-white'
                )}
              >
                {Icon ? <Icon className="size-5" /> : <ArrowUpRight className="size-5" />}
              </span>
              <span>
                <span className={cn('block font-semibold', dark ? 'text-white' : 'text-brand-900')}>{it.label}</span>
                <span className={cn('block text-sm', dark ? 'text-white/55' : 'text-brand-900/60')}>{it.desc}</span>
              </span>
            </motion.a>
          );
        })}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="relative col-span-4 overflow-hidden rounded-3xl bg-gradient-to-br from-brand via-brand-700 to-brand-950 p-6 text-white"
      >
        <div className="absolute -end-10 -top-10 size-40 rounded-full bg-gold/30 blur-3xl" />
        <div className="bg-grid-dark absolute inset-0 opacity-50" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-200">GTCFX</p>
          <p className="mt-3 text-2xl font-bold leading-tight">1:2000</p>
          <p className="text-sm text-white/70">Leverage · &lt;10ms execution · 24/5</p>
          <a href="#register" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-900">
            {t('register')} <ArrowUpRight className="size-4 rtl:-scale-x-100" />
          </a>
        </div>
      </motion.div>
    </div>
  );
}

export function LanguageSwitcher({ dark }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold uppercase transition-all',
          dark ? 'bg-white text-brand-900 hover:bg-gold-50' : 'bg-brand text-white hover:bg-brand-700'
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe className="size-4" />
        {locale}
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute end-0 top-full z-50 mt-2 max-h-80 w-56 overflow-auto rounded-2xl border border-brand/10 bg-white p-1.5 text-brand-900 shadow-2xl"
          >
            {LOCALES.map((l) => (
              <li key={l.code}>
                <button
                  onClick={() => {
                    setOpen(false);
                    if (process.env.NEXT_PUBLIC_STATIC_EXPORT === '1') {
                      // static preview build: swap the locale segment in the current URL
                      window.location.href = window.location.pathname.replace(`/${locale}/`, `/${l.code}/`);
                    } else {
                      router.replace(pathname, { locale: l.code, scroll: false });
                    }
                  }}
                  className={cn('flex w-full items-center justify-between rounded-xl px-3 py-2 text-start text-sm hover:bg-brand-50', l.code === locale && 'bg-brand-50 font-semibold')}
                >
                  <span>
                    {l.native} <span className="text-xs text-brand-900/50">· {l.label}</span>
                  </span>
                  {l.code === locale && <Check className="size-4 text-gold" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileMenu({ open, onClose }) {
  const t = useTranslations('nav');
  const rtl = getDir(useLocale()) === 'rtl';
  const off = rtl ? '-100%' : '100%';
  const [expanded, setExpanded] = useState(null);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[80] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />
          <motion.aside
            initial={{ x: off }}
            animate={{ x: 0 }}
            exit={{ x: off }}
            transition={{ duration: 0.5, ease: EASE }}
            className="absolute inset-y-0 end-0 flex w-[88%] max-w-sm flex-col overflow-y-auto bg-white p-6"
          >
            <div className="flex items-center justify-between">
              <Logo />
              <button onClick={onClose} className="grid size-10 place-items-center rounded-full bg-brand-50 text-brand" aria-label={t('close')}>
                <X className="size-5" />
              </button>
            </div>
            <ul className="mt-8 space-y-1">
              {GROUPS.map((g, i) => (
                <motion.li key={g} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.06 }}>
                  <button
                    onClick={() => setExpanded(expanded === g ? null : g)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-lg font-semibold text-brand-900"
                  >
                    {t(g)}
                    <ChevronDown className={cn('size-5 transition-transform', expanded === g && 'rotate-180')} />
                  </button>
                  <AnimatePresence>
                    {expanded === g && (
                      <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden ps-3">
                        {t.raw(`groups.${g}`).map((it) => (
                          <li key={it.label}>
                            <a href="#" className="block rounded-lg px-3 py-2 text-brand-900/70 hover:bg-brand-50">
                              {it.label}
                            </a>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </motion.li>
              ))}
            </ul>
            <div className="mt-auto grid gap-3 pt-8">
              <a href="#register" onClick={onClose} className="rounded-full bg-brand py-3 text-center font-semibold text-white">
                {t('register')}
              </a>
              <a href="#" className="rounded-full border border-brand/20 py-3 text-center font-semibold text-brand">
                {t('login')}
              </a>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
