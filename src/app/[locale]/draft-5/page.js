import { setRequestLocale } from 'next-intl/server';
import Draft5 from '@/components/drafts/Draft5';

export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Draft5 />;
}
