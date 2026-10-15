'use client';
/**
 * /trading/free-demo-account — light hero → white (why) → gray (workflow)
 * → white (tips) → gray (FAQ) → navy CTA → footer.
 * For the dark hero instead: <DemoHero tone="dark" /> and <Header theme="dark" />.
 */
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { ScrollProgress } from '@/components/motion';
import { DemoHero } from './DemoHero';
import { WhyDemo } from './WhyDemo';
import { Workflow } from './Workflow';
import { Tips } from './Tips';
import { DemoFaq } from './DemoFaq';
import { DemoCta } from './DemoCta';

export default function FreeDemoAccountPage() {
  return (
    <div className="overflow-x-clip bg-white text-ink">
      <ScrollProgress />
      <Header theme="light" />
      <main>
        <DemoHero />
        <WhyDemo />
        <Workflow />
        <Tips />
        <DemoFaq />
        <DemoCta />
      </main>
      <Footer theme="dark" />
    </div>
  );
}
