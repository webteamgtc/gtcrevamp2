'use client';
import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';

// Review-link builds only: pages that exist in the static preview, so menu links between them work there
const PREVIEW = process.env.NEXT_PUBLIC_STATIC_EXPORT === '1';
const PREVIEW_PAGES = {
  '/': 'home',
  '/company': 'company',
  '/company/about-us': 'about-us',
  '/company/why-gtc-group': 'why-gtc-group',
  '/company/global-presence': 'global-presence',
  '/company/events-and-exhibitions': 'events-and-exhibitions',
  '/company/regulations': 'regulations',
  '/company/contact-us': 'contact-us',
  '/trading': 'trading',
  '/trading/open-live-account': 'open-live-account',
  '/trading/free-demo-account': 'free-demo-account',
  '/trading/deposit': 'deposit',
  '/trading/account-types': 'account-types',
  '/trading/compensation-fund': 'compensation-fund',
  '/trading/mt5-platform': 'mt5-platform',
  '/trading/mt4-platform': 'mt4-platform',
  '/trading/metatrader-for-android': 'metatrader-for-android',
  '/trading/metatrader-for-ipad': 'metatrader-for-ipad',
  '/trading/gtc-go-app': 'gtc-go-app',
  '/trading/gtc-go-app-ipad': 'gtc-go-app-ipad',
  '/trading/gtc-go-app-android': 'gtc-go-app-android',
  '/markets': 'markets'
};

/** Internal routes use the locale-aware Link; '#…' and full URLs use a plain <a>. */
export default function NavLink({ href, children, ...rest }) {
  const locale = useLocale();
  const [path, hash] = (href || '').split('#');
  if (PREVIEW && path && PREVIEW_PAGES[path]) {
    return (
      <a href={`../../${locale}/${PREVIEW_PAGES[path]}/index.html${hash ? `#${hash}` : ''}`} {...rest}>
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
