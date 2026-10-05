import { setRequestLocale } from 'next-intl/server';
import Draft3 from '@/components/drafts/Draft3';

export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Draft3 />;
}
