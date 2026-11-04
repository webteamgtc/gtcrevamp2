import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CAT5_LOCALES } from '@/config/regions';
import LiveAccountApplicationPage from './components/LiveAccountApplicationPage';

/** UAE CAT 5 live application (public URL /register-now via src/proxy.js → CAT5_PAGES.liveApplicationForm). */
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'liveAccountApplicationPage.meta' });
  return { title: t('title'), description: t('description'), robots: { index: false, follow: false } };
}

export default async function Page({ params, searchParams }) {
  const { locale } = await params;
  if (!CAT5_LOCALES.includes(locale)) notFound();
  setRequestLocale(locale);
  const [{ account }, t] = await Promise.all([searchParams, getTranslations({ locale, namespace: 'liveAccountApplicationPage' })]);
  const requested = account === 'standard' ? 'standard-account' : account;
  const accountKey = requested && t.has(`accounts.${requested}.title`) ? requested : 'standard-account';
  return <LiveAccountApplicationPage accountKey={accountKey} showAccount={accountKey !== 'standard-account'} />;
}
