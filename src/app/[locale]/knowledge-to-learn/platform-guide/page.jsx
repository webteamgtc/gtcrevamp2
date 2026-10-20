import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMetadata, breadcrumbLd, JsonLd } from '@/lib/seo';
import PlatformGuidePage from './components/PlatformGuidePage';
import { HUB_PATH } from '../courses';
import { GUIDES_PATH } from './guides';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'platformGuidePage' });
  return pageMetadata({ locale, path: GUIDES_PATH, title: t.has('meta.title') ? t('meta.title') : t('hero.title'), description: t.has('meta.description') ? t('meta.description') : t('hero.description') });
}

export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tk = await getTranslations({ locale, namespace: 'knowledgePage.breadcrumb' });
  const t = await getTranslations({ locale, namespace: 'platformGuidePage.hero' });
  return (
    <>
      <JsonLd
        data={breadcrumbLd(locale, [
          { name: tk('home'), path: '' },
          { name: tk('current'), path: HUB_PATH },
          { name: t('title'), path: GUIDES_PATH }
        ])}
      />
      <PlatformGuidePage />
    </>
  );
}
