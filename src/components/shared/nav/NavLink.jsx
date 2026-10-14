'use client';
import { Link, usePathname } from '@/i18n/navigation';

/** Internal routes use the locale-aware Link; '#…' and full URLs use a plain <a>. */
export default function NavLink({ href, children, ...rest }) {
  if (!href || href.startsWith('#') || /^https?:\/\//.test(href)) {
    const ext = /^https?:\/\//.test(href || '');
    return (
      <a href={href || '#'} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}

/** true when the current page is this link (or inside it) */
export function useIsActive() {
  const pathname = usePathname();
  return (href) => !!href && href.startsWith('/') && (pathname === href || pathname.startsWith(`${href}/`));
}
