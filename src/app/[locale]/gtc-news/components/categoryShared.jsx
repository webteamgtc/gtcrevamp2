'use client';
import { CalendarDays, Loader2, Plus } from 'lucide-react';
import NavLink from '@/components/shared/nav/NavLink';
import { newsCategoryHref } from '@/lib/news-path';
import { cn } from '@/lib/utils';
import { iconFor } from './newsUi';

/** Categories with their own wording (gtcNewsPage.<ns>); the others use gtcNewsPage.category. */
const TEXT_NS = { 'market-daily-updates': 'marketDaily', 'company-news': 'companyNews' };

/** Category text: the category's own key when it has one, else the shared one ({category} = its name). */
export function newsText(t, category) {
  const ns = TEXT_NS[category.slug];
  return (key) => (ns && t.has(`${ns}.${key}`) ? t(`${ns}.${key}`) : t(`category.${key}`, { category: category.name }));
}

/**
 * Cover shown whole (covers are mostly wide banners with text on them), centred over a blurred copy of itself so the
 * frame is always filled; a branded navy cover with the category icon when the post has no image. The frame
 * (className) sets the size.
 */
export function Photo({ a, className }) {
  if (!a.cover?.url) {
    const Icon = iconFor(a.categorySlug);
    return (
      <div className={cn('relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand to-brand-700 text-white', className)} aria-hidden>
        <div className="bg-grid-dark absolute inset-0 opacity-50" />
        <span className="absolute -end-10 -top-10 size-48 rounded-full bg-gold/30 blur-3xl" />
        <span className="absolute -bottom-16 start-1/4 size-56 rounded-full bg-[#5b6ed2]/40 blur-3xl" />
        <span className="absolute start-5 top-4 text-sm font-black tracking-tight text-white/80">GTCFX</span>
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid size-20 place-items-center rounded-3xl bg-white/10 text-gold-200 ring-1 ring-white/20 backdrop-blur transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6">
            <Icon className="size-9" />
          </span>
        </span>
      </div>
    );
  }
  return (
    <div className={cn('relative overflow-hidden bg-brand-950', className)}>
      <img src={a.cover.url} alt="" aria-hidden className="absolute inset-0 size-full scale-125 object-cover opacity-70 blur-2xl" />
      <img
        src={a.cover.url}
        alt={a.cover.alt || a.title}
        width={a.cover.width ?? undefined}
        height={a.cover.height ?? undefined}
        loading="lazy"
        decoding="async"
        className="relative size-full object-contain transition-transform duration-700 group-hover:scale-[1.04]"
      />
    </div>
  );
}

export function When({ a, className }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs', className)}>
      <CalendarDays className="size-3.5" aria-hidden />
      <time dateTime={a.publishedAt}>{a.dateLabel}</time>
    </span>
  );
}

/** Category pills (dark hero). */
export function CategoryLinks({ categories, current }) {
  return (
    <nav className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-wrap lg:px-0">
      {categories.map((c) => {
        const on = c.slug === current;
        return (
          <NavLink
            key={c.slug}
            href={newsCategoryHref(c.slug)}
            aria-current={on ? 'page' : undefined}
            className={cn(
              'inline-flex h-10 shrink-0 items-center rounded-full px-4 text-sm font-semibold ring-1 transition-colors',
              on ? 'bg-gold text-white ring-gold' : 'bg-white/[0.06] text-white/75 ring-white/15 hover:bg-white/[0.12] hover:text-white'
            )}
          >
            {c.name}
          </NavLink>
        );
      })}
    </nav>
  );
}

export function LoadMore({ more, loading, onClick, label }) {
  if (!more) return null;
  return (
    <div className="mt-12 flex justify-center">
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="group inline-flex h-13 items-center gap-2.5 rounded-full bg-brand pe-2 ps-7 text-base font-semibold text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand-700 disabled:opacity-70"
      >
        {label}
        <span className="grid size-9 place-items-center rounded-full bg-white text-brand">
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4 transition-transform duration-300 group-hover:rotate-90" />}
        </span>
      </button>
    </div>
  );
}

export function Empty({ t }) {
  return <p className="rounded-[1.75rem] bg-white py-16 text-center text-ink/50 ring-1 ring-brand/10">{t('trends.emptyState')}</p>;
}
