'use client';
/**
 * UK visitors (IP in GB, see UK_NOTICE in src/config/regions.js) can't open a live account. For them:
 *  - any click on a link to the live account application (LiveAccountButton, CTAs, menus…) opens the UK notice
 *    instead of navigating — caught once here, so no button has to know about it
 *  - opening /live-account-application directly shows the notice (the page hides its form, see useUkGate)
 *  - the registration forms call open() instead of submitting
 * The notice ends on "I Agree – Continue Browsing", which takes the visitor to the home page.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import { AnimatePresence } from 'motion/react';
import { usePathname } from '@/i18n/navigation';
import { LIVE_ACCOUNT_HREF } from '@/config/menu';
import { UK_NOTICE } from '@/config/regions';
import { useCountry } from './geoClient';
import UkNotice from './UkNotice';

const UkGateContext = createContext({ blocked: false, open: () => {} });

/** { blocked: visitor is in the UK, open(): show the UK notice } */
export const useUkGate = () => useContext(UkGateContext);

/** Is this link (href attribute) the live account application, with or without a locale prefix? */
function isLiveAccountLink(href) {
  if (!href) return false;
  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    return url.pathname.replace(/^\/[^/]+(?=\/)/, '') === LIVE_ACCOUNT_HREF || url.pathname === LIVE_ACCOUNT_HREF;
  } catch {
    return false;
  }
}

export default function UkGate({ children }) {
  const locale = useLocale();
  const pathname = usePathname(); // without the locale
  const blocked = useCountry() === UK_NOTICE.country;
  const [shown, setShown] = useState(false);
  const open = useCallback(() => setShown(true), []);

  // links anywhere on the page (capture phase: before Next's <Link> navigates)
  useEffect(() => {
    if (!blocked) return;
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0) return;
      const a = e.target.closest?.('a[href]');
      if (!a || !isLiveAccountLink(a.getAttribute('href'))) return;
      e.preventDefault();
      e.stopPropagation();
      setShown(true);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [blocked]);

  // the application page itself
  useEffect(() => {
    if (blocked && pathname === LIVE_ACCOUNT_HREF) setShown(true);
  }, [blocked, pathname]);

  const done = () => {
    setShown(false);
    if (pathname !== '/') window.location.assign(`/${locale}`);
  };

  const value = useMemo(() => ({ blocked, open }), [blocked, open]);
  return (
    <UkGateContext.Provider value={value}>
      {children}
      <AnimatePresence>{shown && blocked && <UkNotice key="uk" onDone={done} />}</AnimatePresence>
    </UkGateContext.Provider>
  );
}
