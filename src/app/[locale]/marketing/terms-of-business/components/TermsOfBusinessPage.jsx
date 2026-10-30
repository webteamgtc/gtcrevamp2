'use client';

import { CAT5_PDF_PATHS } from '@/config/regions';
import Cat5PdfDocumentPage from '../../components/Cat5PdfDocumentPage';

export default function TermsOfBusinessPage() {
  return (
    <Cat5PdfDocumentPage
      namespace="marketingPage.termsOfBusinessPage"
      pdfPath={CAT5_PDF_PATHS.termsOfBusiness}
      backdropId="gtn-terms-business"
      showCmaFooter={false}
    />
  );
}
