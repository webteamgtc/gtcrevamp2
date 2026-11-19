'use client';
/**
 * When the edge missed UAE (no geo header / timeout) but the browser resolves AE, send the visitor to /en-ae.
 */
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLocationDetail } from '@/config/useLocationDetails';
import { CAT5_LOCALE, REGION_LOCALES } from '@/config/regions';

export default function GeoRegionRedirect() {
  const pathname = usePathname();
  const { countryCode, locationReady } = useLocationDetail();

  useEffect(() => {
    if (!locationReady || countryCode !== 'AE') return;
    const seg = pathname.split('/').filter(Boolean)[0];
    if (!seg || seg === CAT5_LOCALE || seg === 'ar' || !REGION_LOCALES.includes(seg)) return;
    const rest = pathname.replace(/^\/[^/]+/, '') || '';
    const target = `/${CAT5_LOCALE}${rest}${window.location.search}`;
    if (`${pathname}${window.location.search}` === target) return;
    window.location.replace(target);
  }, [locationReady, countryCode, pathname]);

  return null;
}