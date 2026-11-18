// Review-link build only: scripts/preview-export.sh copies this to src/app/[locale]/gtc-news/sample-company/page.jsx
// for the export and removes it afterwards, so the company-news layouts can be reviewed without Strapi. Never deployed.
import { setRequestLocale } from 'next-intl/server';
import CategoryPage from '../components/CategoryPage';
import { PREVIEW_CATEGORIES, previewArticles } from '@/data/news.preview';

export const metadata = { robots: { index: false } };

export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const initial = previewArticles('company-news', 10);
  return <CategoryPage category={PREVIEW_CATEGORIES[2]} categories={PREVIEW_CATEGORIES} initial={initial} total={initial.length + 6} />;
}
