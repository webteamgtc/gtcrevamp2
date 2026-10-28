import { setRequestLocale } from 'next-intl/server';
import ClientMessages from '@/i18n/ClientMessages';

/** Privacy on the CAT 5 site uses LegalDocumentPage (client) — needs legalPage.json in the browser. */
export default async function Layout({ children, params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ClientMessages files={['legalPage']}>{children}</ClientMessages>;
}
