import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMetadata, breadcrumbLd, JsonLd } from '@/lib/seo';
import { faqText, getFaqGroups } from '@/lib/faqs';
import FaqsPage from './components/FaqsPage';

const PATH = '/company/faqs';

export const revalidate = 300; // FAQs come from Strapi

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'faqsPage.meta' });
  return pageMetadata({ locale, path: PATH, title: t('title'), description: t('description') });
}

export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [groups, t] = await Promise.all([getFaqGroups(locale), getTranslations({ locale, namespace: 'faqsPage.breadcrumb' })]);
  const questions = groups.flatMap((g) => g.questions);
  return (
    <>
      <JsonLd
        data={breadcrumbLd(locale, [
          { name: t('home'), path: '' },
          { name: t('company'), path: '/company' },
          { name: t('current'), path: PATH }
        ])}
      />
      {questions.length > 0 && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: questions.map((it) => ({ '@type': 'Question', name: it.q, acceptedAnswer: { '@type': 'Answer', text: faqText(it.a) } }))
          }}
        />
      )}
      <FaqsPage groups={groups} />
    </>
  );
}
