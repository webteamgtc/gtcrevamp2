'use client';
import { useTranslations } from 'next-intl';
import { PORTAL } from '@/config/menu';
import CtaBand from '@/components/shared/CtaBand';

export function OlaCta() {
  const t = useTranslations('openLiveAccountPage.cta');
  return (
    <CtaBand
      id="open-account"
      eyebrow={t('eyebrow')}
      title={t('title')}
      description={t('description')}
      primary={{ label: t('live'), href: PORTAL.register }}
      secondary={{ label: t('demo'), href: PORTAL.demo }}
      riskTitle={t('riskTitle')}
      risk={t('risk')}
    />
  );
}
