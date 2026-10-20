/** Shared metadata + JSON-LD (breadcrumb, DefinedTermSet) for the glossary routes. */
import { getTranslations } from 'next-intl/server';
import { pageMetadata, breadcrumbLd, JsonLd } from '@/lib/seo';

const PATH = '/knowledge-to-learn/trading-glossary';

export async function glossaryMetadata(locale, letter) {
  const t = await getTranslations({ locale, namespace: 'glossaryPage.meta' });
  return pageMetadata({ locale, path: letter ? `${PATH}/${letter.toLowerCase()}` : PATH, title: letter ? `${letter} · ${t('title')}` : t('title'), description: t('description') });
}

export async function GlossaryJsonLd({ locale, glossary, letter }) {
  const tk = await getTranslations({ locale, namespace: 'knowledgePage.breadcrumb' });
  const t = await getTranslations({ locale, namespace: 'glossaryPage' });
  const terms = letter ? glossary[letter] ?? [] : Object.values(glossary).flat();
  return (
    <>
      <JsonLd
        data={breadcrumbLd(locale, [
          { name: tk('home'), path: '' },
          { name: tk('current'), path: '/knowledge-to-learn' },
          { name: t('breadcrumb.current'), path: PATH }
        ])}
      />
      {terms.length > 0 && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'DefinedTermSet',
            name: t('title'),
            hasDefinedTerm: terms.map((x) => ({ '@type': 'DefinedTerm', name: x.term, description: x.definition }))
          }}
        />
      )}
    </>
  );
}
