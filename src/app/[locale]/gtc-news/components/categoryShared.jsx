'use client';
import { ArrowRight, CalendarDays, Loader2, Plus } from 'lucide-react';
import NavLink from '@/components/shared/nav/NavLink';
import { newsCategoryHref } from '@/lib/news-path';
import { cn } from '@/lib/utils';
import { iconFor } from './newsUi';

export function When({ a, className }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs text-ink/50', className)}>
      <CalendarDays className="size-3.5" aria-hidden />
      <time dateTime={a.publishedAt}>{a.dateLabel}</time>
    </span>
  );
}

export function PostTitle({ a, className, as: H = 'h3' }) {
  return (
    <H className={cn(/heading-/.test(className ?? '') ? '' : 'heading-small', className)}>
      <NavLink href={a.href} className="after:absolute after:inset-0">
        {a.title}
      </NavLink>
    </H>
  );
}

/** Category links: 'underline' (light page), 'pills' (dark hero), 'list' (sidebar). */
export function CategoryLinks({ categories, current, style }) {
  if (style === 'list') {
    return (
      <nav className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:px-0">
        {categories.map((c) => {
          const on = c.slug === current;
          const Icon = iconFor(c.slug);
          return (
            <NavLink
              key={c.slug}
              href={newsCategoryHref(c.slug)}
              aria-current={on ? 'page' : undefined}
              className={cn(
                'group flex shrink-0 items-center gap-3 rounded-2xl p-2 pe-4 text-sm font-semibold transition-colors',
                on ? 'bg-gradient-to-br from-brand-600 to-brand-900 text-white shadow-xl shadow-brand/25' : 'bg-white text-ink/70 ring-1 ring-brand/10 hover:text-brand'
              )}
            >
              <span className={cn('grid size-10 shrink-0 place-items-center rounded-xl', on ? 'bg-white/10 text-gold-200' : 'bg-brand-50 text-brand')}>
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="flex-1 whitespace-nowrap">{c.name}</span>
              <ArrowRight className={cn('hidden size-4 transition-opacity lg:block rtl:-scale-x-100', on ? 'text-gold-200' : 'opacity-0 group-hover:opacity-100')} aria-hidden />
            </NavLink>
          );
        })}
      </nav>
    );
  }
  const dark = style === 'pills';
  return (
    <nav className={cn('no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0', dark ? 'lg:flex-wrap' : 'gap-7 border-b border-brand/10 lg:justify-center')}>
      {categories.map((c) => {
        const on = c.slug === current;
        return dark ? (
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
        ) : (
          <NavLink
            key={c.slug}
            href={newsCategoryHref(c.slug)}
            aria-current={on ? 'page' : undefined}
            className={cn('relative shrink-0 whitespace-nowrap pb-4 text-[15px] font-semibold transition-colors', on ? 'text-brand' : 'text-ink/50 hover:text-ink')}
          >
            {c.name}
            {on && <span className="absolute inset-x-0 -bottom-px h-[3px] rounded-full bg-gradient-to-r from-brand to-gold" />}
          </NavLink>
        );
      })}
    </nav>
  );
}

export function LoadMore({ more, loading, onClick, label, tone = 'solid' }) {
  if (!more) return null;
  return (
    <div className="mt-12 flex justify-center">
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className={cn(
          'group inline-flex h-13 items-center gap-2.5 rounded-full ps-7 pe-2 text-base font-semibold transition-colors disabled:opacity-70',
          tone === 'outline' ? 'text-brand ring-2 ring-brand/20 hover:ring-brand' : 'bg-brand text-white shadow-lg shadow-brand/25 hover:bg-brand-700'
        )}
      >
        {label}
        <span className={cn('grid size-9 place-items-center rounded-full', tone === 'outline' ? 'bg-brand text-white' : 'bg-white text-brand')}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4 transition-transform duration-300 group-hover:rotate-90" />}
        </span>
      </button>
    </div>
  );
}

export function Empty({ t }) {
  return <p className="rounded-[1.75rem] bg-[#f6f7fb] py-16 text-center text-ink/50">{t('trends.emptyState')}</p>;
}