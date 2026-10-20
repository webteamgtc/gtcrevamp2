import { setRequestLocale } from 'next-intl/server';
import { getGlossary } from '@/lib/glossary';
import GlossaryPage from './components/GlossaryPage';
import { glossaryMetadata, GlossaryJsonLd } from './meta';

export const revalidate = 86400;

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return glossaryMetadata(locale);
}

export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const glossary = await getGlossary(locale);
  return (
    <>
      <GlossaryJsonLd locale={locale} glossary={glossary} />
      <GlossaryPage glossary={glossary} />
    </>
  );
}
