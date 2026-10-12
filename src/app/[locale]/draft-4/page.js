import { setRequestLocale } from 'next-intl/server';
import Draft4 from '@/components/drafts/Draft4';

export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Draft4 />;
}
