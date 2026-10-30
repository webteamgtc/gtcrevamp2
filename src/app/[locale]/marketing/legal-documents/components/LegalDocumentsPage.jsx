'use client';

import { CAT5_PDF_PATHS } from '@/config/regions';
import Cat5PdfDocumentPage from '../../components/Cat5PdfDocumentPage';

export default function LegalDocumentsPage() {
  return (
    <Cat5PdfDocumentPage
      namespace="marketingPage.legalDocumentsPage"
      pdfPath={CAT5_PDF_PATHS.legalDocuments}
      backdropId="gtn-legal-docs"
      showCmaFooter
    />
  );
}
