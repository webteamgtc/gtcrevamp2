'use client';
/**
 * Loads the site-wide analytics / advertising tags (src/lib/ThirdPartyScripts.js), respecting cookie consent:
 *  - UAE CAT 5 website: nothing loads until the visitor chooses in the cookie modal; then only the accepted
 *    categories (analytics → GA4, Finteza, Trustpilot · advertising → Google Ads, Meta Pixel).
 *  - every other page: unchanged — all tags load.
 * Decided after mount (the tags load after the page is interactive anyway).
 */
import { useEffect, useState } from 'react';
import ThirdPartyScripts from '@/lib/ThirdPartyScripts';
import { CONSENT_EVENT, getConsent, isCat5Visitor } from '@/lib/consent';

export default function ConsentScripts() {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    const decide = () => setAllowed(isCat5Visitor() ? (getConsent() ?? { analytics: false, advertising: false }) : { analytics: true, advertising: true });
    decide();
    window.addEventListener(CONSENT_EVENT, decide);
    return () => window.removeEventListener(CONSENT_EVENT, decide);
  }, []);

  if (!allowed) return null;
  return <ThirdPartyScripts analytics={allowed.analytics} advertising={allowed.advertising} />;
}
