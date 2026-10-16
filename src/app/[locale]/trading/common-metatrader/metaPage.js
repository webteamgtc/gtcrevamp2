/**
 * Shared server helpers for the MetaTrader routes: metadata + breadcrumb JSON-LD from a message namespace.
 */
import { getTranslations } from 'next-intl/server';
import { pageMetadata, breadcrumbLd } from '@/lib/seo';

export async function mtMetadata(locale, ns, path) {
  const t = await getTranslations({ locale, namespace: `${ns}.meta` });
  return pageMetadata({ locale, path, title: t('title'), description: t('description') });
}

export async function mtBreadcrumbLd(locale, ns, path) {
  const t = await getTranslations({ locale, namespace: `${ns}.breadcrumb` });
  return breadcrumbLd(locale, [
    { name: t('home'), path: '' },
    { name: t('trading'), path: '/trading' },
    { name: t('current'), path }
  ]);
}
