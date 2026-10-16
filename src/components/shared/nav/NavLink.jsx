'use client';
import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';

// Review-link builds only: pages that exist in the static preview, so menu links between them work there
const PREVIEW = process.env.NEXT_PUBLIC_STATIC_EXPORT === '1';
const PREVIEW_PAGES = { '/': 'home', '/company': 'company', '/trading': 'trading', '/trading/open-live-account': 'open-live-account', '/company/about-us': 'about-us', '/company/why-gtc-group': 'why-gtc-group', '/company/global-presence': 'global-presence', '/company/events-and-exhibitions': 'events-and-exhibitions', '/company/regulations': 'regulations', '/company/contact-us': 'contact-us' };

/** Internal routes use the locale-aware Link; '#…' and full URLs use a plain <a>. */
export default function NavLink({ href, children, ...rest }) {
  const locale = useLocale();
  if (PREVIEW && href && PREVIEW_PAGES[href]) {
    return (
      <a href={`../../${locale}/${PREVIEW_PAGES[href]}/index.html`} {...rest}>
        {children}
      </a>
    );
  }
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
