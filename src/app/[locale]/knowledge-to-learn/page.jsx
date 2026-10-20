import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMetadata, breadcrumbLd, JsonLd } from '@/lib/seo';
import KnowledgePage from './components/KnowledgePage';
import { HUB_PATH } from './courses';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'knowledgePage.meta' });
  return pageMetadata({ locale, path: HUB_PATH, title: t('title'), description: t('description') });
}

export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'knowledgePage' });
  const faq = t.raw('qanda.items');
  return (
    <>
      <JsonLd
        data={breadcrumbLd(locale, [
          { name: t('breadcrumb.home'), path: '' },
          { name: t('breadcrumb.current'), path: HUB_PATH }
        ])}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
        }}
      />
      <KnowledgePage />
    </>
  );
}
