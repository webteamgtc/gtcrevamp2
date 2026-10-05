import { setRequestLocale } from 'next-intl/server';
import Draft2 from '@/components/drafts/Draft2';

export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Draft2 />;
}
