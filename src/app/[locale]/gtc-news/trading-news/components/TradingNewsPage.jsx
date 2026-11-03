'use client';
/**
 * /gtc-news/trading-news — dark hero (market-holidays style) → expiry notice + table → navy CTA.
 * Copy: messages/<locale>/gtcNewsPage.json → tradingNewsPage
 */
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { ScrollProgress } from '@/components/motion';
import TradingNewsHeroSection from './TradingNewsHeroSection';
import TradingNewsContentSection from './TradingNewsContentSection';
import TradingNewsCtaSection from './TradingNewsCtaSection';

export default function TradingNewsPage() {
  return (
    <div className="overflow-x-clip bg-white text-ink">
      <ScrollProgress />
      <Header theme="dark" />
      <main>
        <TradingNewsHeroSection />
        <TradingNewsContentSection />
        <TradingNewsCtaSection />
      </main>
      <Footer theme="dark" />
    </div>
  );
}
