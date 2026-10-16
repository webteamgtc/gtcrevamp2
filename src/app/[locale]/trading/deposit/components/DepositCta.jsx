'use client';
import { useTranslations } from 'next-intl';
import { PORTAL } from '@/config/menu';
import CtaBand from '@/components/shared/CtaBand';

export function DepositCta() {
  const t = useTranslations('depositPage.cta');
  return (
    <CtaBand
      id="fund"
      title={t('title')}
      description={t('description')}
      primary={{ label: t('live'), href: PORTAL.register }}
      secondary={{ label: t('login'), href: PORTAL.clientPortal }}
      risk={t('risk')}
    />
  );
}
