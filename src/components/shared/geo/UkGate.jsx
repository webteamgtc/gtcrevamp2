'use client';
/**
 * UK visitors (IP in GB): no live or demo accounts.
 *  - Site load: browse notice (GeoGate, mode=browse)
 *  - Register / Open live account: account notice (mode=account), one screen, no follow-up step
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import { AnimatePresence } from 'motion/react';
import { usePathname } from '@/i18n/navigation';
import { UK_NOTICE } from '@/config/regions';
import { isDemoAccountHref, LIVE_ACCOUNT_HREF, pathWithoutLocale } from '@/config/menu';
import { useCountry } from './geoClient';
import UkNotice from './UkNotice';

const UkGateContext = createContext({ blocked: false, open: () => {} });

/** { blocked: visitor is in the UK, open(): show the account notice (Register / live account) } */
export const useUkGate = () => useContext(UkGateContext);

function isLiveAccountLink(href) {
  if (!href) return false;
  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    const p = pathWithoutLocale(url.pathname);
    return p === LIVE_ACCOUNT_HREF;
  } catch {
    return false;
  }
}

export default function UkGate({ children }) {
  const locale = useLocale();
  const pathname = usePathname();
  const blocked = useCountry() === UK_NOTICE.country;
  const [shown, setShown] = useState(false);
  const open = useCallback(() => {
    if (blocked) setShown(true);
  }, [blocked]);

  useEffect(() => {
    if (blocked && pathname === LIVE_ACCOUNT_HREF) setShown(true);
  }, [blocked, pathname]);

  useEffect(() => {
    if (!blocked) return;
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0) return;
      const a = e.target.closest?.('a[href]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (isDemoAccountHref(href)) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (!isLiveAccountLink(href)) return;
      e.preventDefault();
      e.stopPropagation();
      setShown(true);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [blocked]);

  const dismiss = () => {
    setShown(false);
    if (pathname === LIVE_ACCOUNT_HREF) window.location.assign(`/${locale}`);
  };

  const value = useMemo(() => ({ blocked, open }), [blocked, open]);
  return (
    <UkGateContext.Provider value={value}>
      {children}
      <AnimatePresence>{shown && blocked && <UkNotice key="uk-account" mode="account" onDismiss={dismiss} />}</AnimatePresence>
    </UkGateContext.Provider>
  );
}

export { isDemoAccountHref };
