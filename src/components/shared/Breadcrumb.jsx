import { ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

/**
 * Pill breadcrumb for dark page heroes.
 *   <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Trading', href: '/trading' }, { label: 'Open Live Account' }]} />
 * The last item (no href) is the current page.
 */
export default function Breadcrumb({ items, className }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex justify-center', className)}>
      <ol className="inline-flex flex-wrap items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/60 backdrop-blur">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${it.label}-${i}`} className="inline-flex items-center gap-1.5">
              {last || !it.href ? (
                <span aria-current={last ? 'page' : undefined} className={last ? 'text-gold-200' : undefined}>
                  {it.label}
                </span>
              ) : (
                <Link href={it.href} className="transition-colors hover:text-gold-200">
                  {it.label}
                </Link>
              )}
              {!last && <ChevronRight className="size-3.5 rtl:-scale-x-100" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
