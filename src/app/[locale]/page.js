import { setRequestLocale } from 'next-intl/server';
import DraftsIndex from '@/components/drafts/DraftsIndex';

export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <DraftsIndex />;
}
