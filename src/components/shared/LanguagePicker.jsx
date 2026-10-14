'use client';
/**
 * Language picker for the header.
 * Desktop: a full-width band under the header (like the mega menu). Phone: a bottom sheet.
 * Light or dark, following the header.
 * Search, region tabs, round flags, keyboard support (Esc, arrow keys).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronDown, Globe, Search, X } from 'lucide-react';
// import only the flags we use (keeps the bundle small)
import { AE, PK, AF, IN, TR, UZ, CN, TW, VN, TH, MY, ID, PH, ES, FR, IT, PT, RU } from 'country-flag-icons/react/1x1';
const Flags = { AE, PK, AF, IN, TR, UZ, CN, TW, VN, TH, MY, ID, PH, ES, FR, IT, PT, RU };
import { usePathname, useRouter } from '@/i18n/navigation';
import { LOCALES, REGIONS, getLocale } from '@/i18n/locales';
import { cn } from '@/lib/utils';
import { EASE } from '../motion';

export function LocaleFlag({ code, className }) {
  const l = getLocale(code);
  const Flag = l.flag ? Flags[l.flag] : null;
  return (
    <span className={cn('relative grid shrink-0 place-items-center overflow-hidden rounded-full ring-1 ring-black/10', !Flag && 'bg-brand-50 text-brand', className)} aria-hidden>
      {Flag ? <Flag className="size-full" /> : <Globe className="size-[62%]" strokeWidth={1.75} />}
    </span>
  );
}

function useIsPhone() {
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(max-width: 639px)');
    const on = () => setPhone(m.matches);
    on();
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return phone;
}

export default function LanguagePicker({ dark = false, className, onOpenChange, forceClose = false }) {
  const t = useTranslations('lang');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const phone = useIsPhone();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [region, setRegion] = useState('all');
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState(null);
  const wrapRef = useRef(null);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const searchRef = useRef(null);
  const current = getLocale(locale);

  useEffect(() => setMounted(true), []);
  useEffect(() => onOpenChange?.(open), [open, onOpenChange]);
  // the header closes the picker when a mega menu opens
  useEffect(() => {
    if (forceClose) setOpen(false);
  }, [forceClose]);

  // desktop panel is portalled to <body> and spans the full width right under the header bar,
  // like the mega menu
  useEffect(() => {
    if (!open || phone) return;
    const place = () => {
      const bar = triggerRef.current?.closest('header') ?? triggerRef.current;
      const r = bar?.getBoundingClientRect();
      if (r) setPos({ top: Math.max(0, r.bottom) });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, { passive: true });
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place);
    };
  }, [open, phone]);

  // close on outside click / Esc, restore focus
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (!wrapRef.current?.contains(e.target) && !panelRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    const id = setTimeout(() => !phone && searchRef.current?.focus({ preventScroll: true }), 120);
    if (phone) document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
      clearTimeout(id);
      document.body.style.overflow = '';
    };
  }, [open, phone]);

  useEffect(() => {
    if (!open) {
      setQ('');
      setRegion('all');
    }
  }, [open]);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return LOCALES.filter((l) => (region === 'all' || l.region === region) && (!s || `${l.native} ${l.label} ${l.code}`.toLowerCase().includes(s)));
  }, [q, region]);

  const choose = (code) => {
    setOpen(false);
    if (code === locale) return;
    if (process.env.NEXT_PUBLIC_STATIC_EXPORT === '1') {
      window.location.href = window.location.pathname.replace(`/${locale}/`, `/${code}/`);
    } else {
      router.replace(pathname, { locale: code, scroll: false });
    }
  };

  // arrow-key navigation between language tiles
  const onGridKey = (e) => {
    const tiles = [...(panelRef.current?.querySelectorAll('[data-lang-tile]') ?? [])];
    const i = tiles.indexOf(document.activeElement);
    if (i < 0) return;
    const cols = phone ? 1 : window.innerWidth >= 1280 ? 5 : window.innerWidth >= 1024 ? 4 : 2;
    const step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: cols, ArrowUp: -cols }[e.key];
    if (!step) return;
    e.preventDefault();
    const rtl = document.documentElement.dir === 'rtl';
    const s = rtl && (e.key === 'ArrowRight' || e.key === 'ArrowLeft') ? -step : step;
    tiles[Math.max(0, Math.min(tiles.length - 1, i + s))]?.focus();
  };

  // colour set: dark follows the header (dark hero), light otherwise
  const c = dark
    ? {
        line: 'border-white/10',
        title: 'text-white',
        muted: 'text-white/55',
        faint: 'text-white/40',
        chip: 'border-white/10 bg-white/5 text-white/70',
        chipAccent: 'text-gold-300',
        close: 'text-white/55 hover:bg-white/10 hover:text-white',
        input: 'border-white/10 bg-white/[0.06] text-white placeholder:text-white/40 focus:border-gold/50 focus:bg-white/10 focus:ring-gold/15',
        tab: 'text-white/60 hover:bg-white/10 hover:text-white',
        tabOn: 'text-ink',
        tabPill: 'bg-gold',
        tileOn: 'border-gold/40 bg-white/[0.07] shadow-lg shadow-black/30',
        tile: 'border-transparent hover:-translate-y-0.5 hover:border-white/10 hover:bg-white/[0.06]',
        name: 'text-white',
        nameOn: 'text-gold-300',
        sub: 'text-white/45',
        code: 'text-white/25 group-hover:text-gold-300/70',
        check: 'bg-gold text-ink',
        rtl: 'bg-gold/15 text-gold-200',
        foot: 'text-white/40'
      }
    : {
        line: 'border-brand/10',
        title: 'text-ink',
        muted: 'text-ink/55',
        faint: 'text-ink/40',
        chip: 'border-brand/10 bg-[#f6f7fb] text-ink/70',
        chipAccent: 'text-brand',
        close: 'text-ink/50 hover:bg-brand-50 hover:text-brand',
        input: 'border-brand/10 bg-[#f6f7fb] text-ink placeholder:text-ink/40 focus:border-brand/40 focus:bg-white focus:ring-brand/10',
        tab: 'text-ink/55 hover:bg-brand-50 hover:text-brand',
        tabOn: 'text-white',
        tabPill: 'bg-brand',
        tileOn: 'border-brand/30 bg-gradient-to-br from-brand-50 to-white shadow-md shadow-brand/10',
        tile: 'border-transparent hover:-translate-y-0.5 hover:border-brand/10 hover:bg-white hover:shadow-lg hover:shadow-brand/10',
        name: 'text-ink',
        nameOn: 'text-brand',
        sub: 'text-ink/50',
        code: 'text-ink/25 group-hover:text-brand/50',
        check: 'bg-brand text-white',
        rtl: 'bg-gold-50 text-gold-700',
        foot: 'text-ink/45'
      };

  const head = (
    <div className="flex min-w-0 items-start gap-3">
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand to-brand-500 text-white shadow-lg shadow-brand/25 ring-1 ring-white/10">
        <Globe className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <h2 id="lang-title" className={cn('heading-card', dark && 'is-dark')}>
          {t('title')}
        </h2>
        <p className={cn('text-sm', c.muted)}>{t('subtitle', { count: LOCALES.length })}</p>
      </div>
    </div>
  );

  const currentChip = (
    <span className={cn('hidden shrink-0 items-center gap-2 rounded-full border py-1 pe-3 ps-1 text-xs font-semibold md:inline-flex', c.chip)}>
      <LocaleFlag code={locale} className="size-6" />
      {t('current')}: <span className={c.chipAccent}>{current.native}</span>
    </span>
  );

  const closeBtn = (
    <button type="button" onClick={() => setOpen(false)} aria-label={t('close')} className={cn('grid size-9 shrink-0 place-items-center rounded-full transition', c.close)}>
      <X className="size-5" />
    </button>
  );

  const search = (
    <label className="relative block min-w-0 flex-1">
      <span className="sr-only">{t('search')}</span>
      <Search className={cn('pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2', c.faint)} />
      <input
        ref={searchRef}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t('search')}
        type="search"
        className={cn('h-11 w-full rounded-xl border pe-4 ps-11 text-[15px] outline-none transition focus:ring-4', c.input)}
      />
    </label>
  );

  const tabs = (
    <div className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1 pb-1" role="tablist" aria-label={t('title')}>
      {['all', ...REGIONS].map((r) => (
        <button
          key={r}
          type="button"
          role="tab"
          aria-selected={region === r}
          onClick={() => setRegion(r)}
          className={cn('relative shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors', region === r ? c.tabOn : c.tab)}
        >
          {region === r && <motion.span layoutId={`lang-region-${phone ? 'p' : 'd'}`} className={cn('absolute inset-0 rounded-full', c.tabPill)} transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
          <span className="relative">{r === 'all' ? t('all') : t(`regions.${r}`)}</span>
        </button>
      ))}
    </div>
  );

  const grid =
    list.length === 0 ? (
      <p className={cn('py-10 text-center text-sm', c.muted)}>{t('noResults', { q })}</p>
    ) : (
      <motion.ul
        key={region + q}
        role="listbox"
        aria-labelledby="lang-title"
        className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5"
        initial="h"
        animate="s"
        variants={{ h: {}, s: { transition: { staggerChildren: 0.018 } } }}
      >
        {list.map((l) => {
          const on = l.code === locale;
          return (
            <motion.li key={l.code} role="option" aria-selected={on} variants={{ h: { opacity: 0, y: 8 }, s: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } } }}>
              <button
                type="button"
                data-lang-tile
                lang={l.code}
                onClick={() => choose(l.code)}
                className={cn(
                  'group relative flex w-full items-center gap-3 rounded-2xl border p-2.5 pe-3 text-start transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
                  on ? c.tileOn : c.tile
                )}
              >
                <LocaleFlag code={l.code} className="size-10 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" />
                <span className="min-w-0 flex-1">
                  <span className={cn('block truncate text-[15px] font-semibold leading-tight', on ? c.nameOn : c.name)}>
                    <bdi>{l.native}</bdi>
                  </span>
                  <span className={cn('block truncate text-xs', c.sub)}>{l.code === 'en' ? t('regions.global') : l.label}</span>
                </span>
                {l.dir === 'rtl' && <span className={cn('rounded-md px-1.5 py-0.5 text-[10px] font-bold', c.rtl)}>{t('rtl')}</span>}
                {on ? (
                  <span className={cn('grid size-6 place-items-center rounded-full', c.check)}>
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                ) : (
                  <span dir="ltr" className={cn('text-[10px] font-semibold uppercase tracking-wider transition-colors', c.code)}>
                    {l.code}
                  </span>
                )}
              </button>
            </motion.li>
          );
        })}
      </motion.ul>
    );

  // desktop: full-width band, same rhythm as the mega menu
  const wide = (
    <div className="container-x flex max-h-full min-h-0 flex-col py-7">
      <div className="flex items-center gap-6">
        {head}
        <div className="ms-auto flex w-full max-w-md items-center gap-3">{search}</div>
        {currentChip}
        {closeBtn}
      </div>
      <div className="mt-5">{tabs}</div>
      <div className="-mx-1 mt-3 min-h-0 flex-1 overflow-y-auto overscroll-contain px-1 py-1" onKeyDown={onGridKey}>
        {grid}
      </div>
      <p className={cn('mt-4 border-t pt-4 text-xs', c.line, c.foot)}>{t('remember')}</p>
    </div>
  );

  // phone: stacked bottom sheet
  const stacked = (
    <div className="flex max-h-full min-h-0 flex-col">
      <div className={cn('flex items-start gap-3 border-b px-5 pb-4 pt-4', c.line)}>
        <div className="min-w-0 flex-1">{head}</div>
        {closeBtn}
      </div>
      <div className="space-y-3 px-5 pt-4">
        {search}
        {tabs}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4" onKeyDown={onGridKey}>
        {grid}
      </div>
      <div className={cn('border-t px-5 py-3 text-xs', c.line, c.foot)}>{t('remember')}</div>
    </div>
  );

  return (
    <div ref={wrapRef} className={cn('relative', className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`${t('open')}: ${current.native}`}
        className={cn(
          'group inline-flex h-10 items-center gap-2 rounded-full py-1 pe-3 ps-1 text-sm font-semibold transition-all',
          dark ? 'bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15' : 'bg-brand text-white shadow-md shadow-brand/20 hover:bg-brand-700',
          open && (dark ? 'bg-white/20' : 'bg-brand-700')
        )}
      >
        <LocaleFlag code={locale} className={cn('size-8', !current.flag && 'bg-white text-brand ring-0')} />
        <span dir="ltr" className="uppercase">{locale.split('-')[0]}</span>
        <ChevronDown className={cn('size-4 opacity-70 transition-transform duration-300', open && 'rotate-180')} />
      </button>

      {/* desktop dropdown */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && !phone && pos && (
              <motion.div
                key="lang-dim"
                className="fixed inset-0 z-40 bg-ink/25"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                aria-hidden
              />
            )}
            {open && !phone && pos && (
              <motion.div
                key="lang-band"
                ref={panelRef}
                role="dialog"
                aria-modal="false"
                aria-labelledby="lang-title"
                dir={document.documentElement.dir}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0, transition: { duration: 0.25, ease: EASE } }}
                transition={{ duration: 0.4, ease: EASE }}
                style={{ top: pos.top, maxHeight: `calc(100vh - ${Math.round(pos.top)}px)` }}
                className={cn(
                  'beam-drop fixed inset-x-0 z-[45] flex flex-col overflow-hidden border-t shadow-[0_30px_80px_-20px_rgba(10,14,38,0.45)] backdrop-blur-xl',
                  dark ? 'border-white/10 bg-ink/95 text-white' : 'border-brand/10 bg-white text-ink'
                )}
              >
                {wide}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* phone bottom sheet */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && phone && (
              <motion.div className="fixed inset-0 z-[90]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
                <motion.div
                  ref={panelRef}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="lang-title"
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ duration: 0.45, ease: EASE }}
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={{ top: 0, bottom: 0.6 }}
                  onDragEnd={(_, info) => info.offset.y > 120 && setOpen(false)}
                  className={cn('absolute inset-x-0 bottom-0 flex max-h-[88svh] flex-col overflow-hidden rounded-t-[1.75rem] pb-[env(safe-area-inset-bottom)]', dark ? 'bg-[#10132a] text-white' : 'bg-white text-ink')}
                >
                  <span className={cn('mx-auto mt-2.5 h-1.5 w-12 shrink-0 rounded-full', dark ? 'bg-white/20' : 'bg-ink/15')} aria-hidden />
                  {stacked}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
