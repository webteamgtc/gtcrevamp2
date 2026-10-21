'use client';
/**
 * /gtc-news/<category>/<slug> — one news article from Strapi.
 * Body: the GTC lesson template rendered with the shared lesson blocks + sticky quick guide, or cleaned HTML
 * (`.learn-article`) with a sticky "more from this category" list.
 * Rhythm: dark hero (category, date, author, title) → white (cover + body + share) → gray (related carousel) → navy band.
 */
import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useSpring } from 'motion/react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import NewsCard, { NewsMeta } from '@/components/shared/news/NewsCard';
import NewsCarousel from '@/components/shared/news/NewsCarousel';
import { Block, HeroKicker, HeroPills, MobileQuickGuide, QuickGuide, ShareRow, useActiveId } from '@/components/shared/lesson/LessonParts';
import { Reveal, ScrollProgress, EASE } from '@/components/motion';
import { NEWS_PATH, newsCategoryHref } from '@/lib/news-path';
import { cn } from '@/lib/utils';
import NewsHero from './NewsHero';
import ActivationBand from './ActivationBand';

export default function NewsArticlePage({ article, related }) {
  const t = useTranslations('gtcNewsPage');
  const lesson = article.lesson;
  const toc = lesson?.toc;
  const bodyRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: bodyRef, offset: ['start 30%', 'end 70%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const active = useActiveId(toc?.items.map((it) => it.id) ?? []);
  const catHref = newsCategoryHref(article.categorySlug);
  const side = related.slice(0, 4);
  let n = 0;

  return (
    <div className="overflow-x-clip bg-white text-ink">
      <ScrollProgress />
      <Header theme="dark" />
      <main>
        <NewsHero
          crumbs={[{ label: t('breadcrumb.home'), href: '/' }, { label: t('breadcrumb.current'), href: NEWS_PATH }, ...(article.category ? [{ label: article.category, href: catHref }] : []), { label: article.title }]}
          back={{ href: catHref, label: t('article.backToCategory', { category: article.category || t('breadcrumb.current') }) }}
          kicker={
            lesson?.hero ? (
              <HeroKicker hero={lesson.hero} />
            ) : (
              <motion.div className="mt-6 flex justify-center lg:justify-start" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <NewsMeta article={article} dark />
              </motion.div>
            )
          }
          title={lesson?.hero?.title || article.title}
          description={lesson?.hero?.description || article.excerpt}
          titleClassName="max-w-4xl"
        >
          {lesson?.hero && <HeroPills pills={lesson.hero.pills} />}
        </NewsHero>

        <section className="relative bg-white py-12 md:py-16">
          <div className={cn('container-x grid gap-12 lg:gap-16', 'lg:grid-cols-[minmax(0,1fr)_300px]')}>
            <div ref={bodyRef} className="min-w-0">
              {toc && <MobileQuickGuide toc={toc} active={active} />}
              {article.cover?.url && !/<img\b/i.test(article.html) && (
                <Reveal y={20}>
                  <img src={article.cover.url} alt={article.cover.alt || article.title} className="mb-12 w-full rounded-[1.75rem] object-cover shadow-2xl shadow-brand/10 ring-1 ring-brand/10" />
                </Reveal>
              )}
              {lesson ? (
                <div className="space-y-14 md:space-y-16">
                  {lesson.blocks.map((b, k) => (
                    <Block key={`${b.type}-${b.id || k}`} block={b} index={b.type === 'section' || b.type === 'faq' ? ++n : n} />
                  ))}
                </div>
              ) : (
                // amount={0}: long designed posts are taller than the viewport, so a % threshold would keep them hidden
                <Reveal y={16} amount={0}>
                  <div className="learn-article" dangerouslySetInnerHTML={{ __html: article.html }} />
                </Reveal>
              )}
              <ShareRow title={article.title} ns="gtcNewsPage.article" />
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-5">
                {toc && <QuickGuide toc={toc} active={active} progress={progress} />}
                {!toc && side.length > 0 && (
                  <motion.div className="rounded-[1.75rem] bg-[#f6f7fb] p-2 ring-1 ring-brand/10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE }}>
                    <div className="rounded-[1.5rem] bg-white p-1.5">
                      {side.map((a) => (
                        <NewsCard key={a.id} article={a} variant="row" showCategory={false} compact />
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </aside>
          </div>
        </section>

        <NewsCarousel articles={related} title={t('article.related', { category: article.category || t('breadcrumb.current') })} description="" viewAllHref={catHref} viewAllLabel={t('article.allNews')} prevLabel={t('article.prev')} nextLabel={t('article.next')} />
        <ActivationBand />
      </main>
      <Footer theme="dark" />
    </div>
  );
}
