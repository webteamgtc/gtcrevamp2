'use client';
/** Closing navy CTA band of the platform-guide pages. */
import { useTranslations } from 'next-intl';
import { PORTAL } from '@/config/menu';
import CtaBand from '@/components/shared/CtaBand';

export default function PlatformCtaSection() {
  const t = useTranslations('platformGuidePage.cta');
  return <CtaBand id="start" title={`${t('titleLine1')} [${t('titleAccent')}]`} description={t('description')} primary={{ label: t('primaryCta'), href: PORTAL.register }} />;
}
