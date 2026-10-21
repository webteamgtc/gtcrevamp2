import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMetadata, breadcrumbLd, JsonLd } from '@/lib/seo';
import { getEconomicCalendar } from '@/lib/economicCalendar';
import { NEWS_PATH } from '@/lib/news-path';
import EconomicCalendarPage from './components/EconomicCalendarPage';

const PATH = `${NEWS_PATH}/economic-calendar`;

export const revalidate = 300; // hero card events are refreshed every 5 minutes

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'economicCalendarPage.meta' });
  return pageMetadata({ locale, path: PATH, title: t('title'), description: t('description') });
}

export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [events, t, tf] = await Promise.all([
    getEconomicCalendar(),
    getTranslations({ locale, namespace: 'economicCalendarPage.breadcrumb' }),
    getTranslations({ locale, namespace: 'economicCalendarPage.faq' })
  ]);
  return (
    <>
      <JsonLd
        data={breadcrumbLd(locale, [
          { name: t('home'), path: '' },
          { name: t('news'), path: NEWS_PATH },
          { name: t('current'), path: PATH }
        ])}
      />
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: tf.raw('items').map((it) => ({ '@type': 'Question', name: it.question, acceptedAnswer: { '@type': 'Answer', text: it.answer } })) }} />
      <EconomicCalendarPage events={events} generatedAt={Date.now()} />
    </>
  );
}
