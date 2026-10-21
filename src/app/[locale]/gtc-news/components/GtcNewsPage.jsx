'use client';
/**
 * /gtc-news — GTC News hub (posts from Strapi `blogs`, src/lib/news.js).
 * Rhythm: dark GTC Go hero → gray (market trends: category tabs + 3×2 grid) → white (knowledge hub: latest event)
 * → navy swap-free activation band.
 */
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { ScrollProgress } from '@/components/motion';
import AppHero from './AppHero';
import TrendsSection from './TrendsSection';
import KnowledgeHubSection from './KnowledgeHubSection';
import ActivationBand from './ActivationBand';

export default function GtcNewsPage({ categories, trends, featured }) {
  return (
    <div className="overflow-x-clip bg-white text-ink">
      <ScrollProgress />
      <Header theme="dark" />
      <main>
        <AppHero />
        <TrendsSection categories={categories} initial={trends} />
        <KnowledgeHubSection featured={featured} />
        <ActivationBand />
      </main>
      <Footer theme="dark" />
    </div>
  );
}
