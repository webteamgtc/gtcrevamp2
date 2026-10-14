import { setRequestLocale } from 'next-intl/server';
import Draft4Page from './components/Draft4Page';

export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Draft4Page />;
}
