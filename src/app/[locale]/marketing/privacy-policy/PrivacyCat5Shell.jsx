'use client';

import LegalDocumentPage from '@/app/[locale]/legal/components/LegalDocumentPage';
import { Cat5Frame } from '../components/MarketingPage';

/** Privacy policy on the UAE CAT 5 site — CAT5 chrome only (no main-site header/footer or policy links). */
export default function PrivacyCat5Shell({ slug, doc }) {
  return (
    <Cat5Frame page="home">
      <LegalDocumentPage slug={slug} doc={doc} shell="cat5" />
    </Cat5Frame>
  );
}
