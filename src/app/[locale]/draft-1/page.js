import { setRequestLocale } from 'next-intl/server';
import Draft1 from '@/components/drafts/Draft1';

export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Draft1 />;
}
