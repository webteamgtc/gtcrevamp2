'use client';
/**
 * /gtc-news/<category>/<slug> — one news article from Strapi.
 * Dark hero (category, title, author, date, reading time) beside a framed cover → body (GTC lesson blocks + quick
 * guide, or cleaned HTML `.learn-article`) with a sticky side panel (share, more from the category) → related carousel
 * → navy swap-free band.
 */
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useSpring } from 'motion/react';
import { CalendarDays, Check, Clock, Link2 } from 'lucide-react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import Breadcrumb from '@/components/shared/Breadcrumb';
import HeroBackdrop from '@/components/shared/HeroBackdrop';
import NavLink from '@/components/shared/nav/NavLink';
import { AccentTitle } from '@/components/shared/SectionIntro';
import { SOCIALS } from '@/components/shared/icons';
import NewsCard from '@/components/shared/news/NewsCard';
import NewsCarousel from '@/components/shared/news/NewsCarousel';
import { Block, HeroPills, MobileQuickGuide, QuickGuide, SHARE, ShareRow, useActiveId } from '@/components/shared/lesson/LessonParts';
import { Reveal, ScrollProgress, TiltCard, EASE } from '@/components/motion';
import { NEWS_PATH, newsCategoryHref } from '@/lib/news-path';
import { cn } from '@/lib/utils';
import { iconFor } from './newsUi';
import ActivationBand from './ActivationBand';

/** ~200 words a minute, from the article HTML. */
function readMinutes(html) {
  const words = String(html ?? '')
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return words ? Math.max(1, Math.round(words / 200)) : 0;
}

/** Share icons + copy link (same links as the shared ShareRow). */
function ShareIcons({ title, vertical, dark, t }) {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);
  useEffect(() => setUrl(window.location.href.split('#')[0]), []);
  const u = encodeURIComponent(url);
  const txt = encodeURIComponent(title);
  const btn = cn('grid size-10 place-items-center rounded-full transition-all hover:-translate-y-0.5', dark ? 'bg-white/10 text-white ring-1 ring-white/15 hover:bg-gold' : 'bg-brand-50 text-brand hover:bg-brand hover:text-white');
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  return (
    <div className={cn('flex items-center gap-2', vertical && 'flex-col')} aria-label={t('article.share')} role="group">
      {SOCIALS.filter((s) => SHARE[s.name]).map((s) => (
        <a key={s.name} href={url ? SHARE[s.name](u, txt) : undefined} target="_blank" rel="noopener noreferrer" aria-label={s.name} className={btn}>
          {s.icon('size-4')}
        </a>
      ))}
      <button type="button" onClick={copy} aria-label={copied ? t('article.copied') : t('article.copyLink')} title={copied ? t('article.copied') : t('article.copyLink')} className={cn(btn, copied && 'bg-up text-white hover:bg-up')}>
        {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
      </button>
    </div>
  );
}

function MetaLine({ article, minutes, t, dark, center }) {
  const muted = dark ? 'text-white/60' : 'text-ink/55';
  return (
    <div className={cn('flex flex-wrap items-center gap-x-5 gap-y-2 text-sm', muted, center && 'justify-center')}>
      {article.author && (
        <span className="inline-flex items-center gap-2.5">
          <span className={cn('grid size-9 place-items-center rounded-full text-sm font-bold', dark ? 'bg-gold text-white' : 'bg-brand text-white')} aria-hidden>
            {article.author.trim().charAt(0).toUpperCase()}
          </span>
          <span className={cn('font-semibold', dark ? 'text-white' : 'text-ink')}>{t('article.by', { author: article.author })}</span>
        </span>
      )}
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays className="size-4 text-gold" aria-hidden />
        <time dateTime={article.publishedAt}>{article.dateLabel}</time>
      </span>
      {minutes > 0 && (
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-4 text-gold" aria-hidden />
          {t('article.readTime', { minutes })}
        </span>
      )}
    </div>
  );
}

function CategoryChip({ article, href, dark }) {
  const Icon = iconFor(article.categorySlug);
  return (
    <NavLink
      href={href}
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] transition-colors',
        dark ? 'bg-white/10 text-gold-200 ring-1 ring-white/20 hover:bg-white/15' : 'text-gold-700 ring-1 ring-gold/40 hover:bg-gold/10'
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {article.category}
    </NavLink>
  );
}

/** Article body: lesson blocks or the cleaned Strapi HTML. */
function Body({ article, className }) {
  const lesson = article.lesson;
  let n = 0;
  return lesson ? (
    <div className={cn('space-y-14 md:space-y-16', className)}>
      {lesson.blocks.map((b, k) => (
        <Block key={`${b.type}-${b.id || k}`} block={b} index={b.type === 'section' || b.type === 'faq' ? ++n : n} />
      ))}
    </div>
  ) : (
    // amount={0}: long designed posts are taller than the viewport, so a % threshold would keep them hidden
    <Reveal y={16} amount={0} className={className}>
      <div className="learn-article news-article-body" dangerouslySetInnerHTML={{ __html: article.html }} />
    </Reveal>
  );
}

/** Strapi titles are plain text: only accent words the editor put in [brackets]. */
const ArticleTitle = ({ text }) => (/\[[^\]]+\]/.test(text) ? <AccentTitle text={text} /> : text);

const hasCover = (a) => a.cover?.url && !/<img\b/i.test(a.html ?? '');

function CoverFrame({ cover, title }) {
  return (
    <div className="relative flex w-full items-center justify-center overflow-hidden rounded-[1.75rem] bg-white/[0.06] shadow-2xl shadow-black/40 ring-1 ring-white/10">
      <img
        src={cover.url}
        alt={cover.alt || title}
        width={cover.width ?? undefined}
        height={cover.height ?? undefined}
        decoding="async"
        className="max-h-[min(26rem,52vh)] w-full object-contain object-center"
      />
    </div>
  );
}

function Split({ article, related, t, crumbs, catHref, minutes, title, toc, active, progress, bodyRef }) {
  const side = related.slice(0, 4);
  return (
    <>
      <section className="is-dark relative overflow-hidden bg-ink pb-16 pt-36 text-white md:pb-20 md:pt-44">
        <HeroBackdrop />
        <div className="container-x relative">
          <Breadcrumb className="lg:justify-start" items={crumbs} />
          <div className={cn('mt-10 grid items-center gap-12', hasCover(article) && 'lg:grid-cols-[1.05fr_1fr]')}>
            <div className="text-center lg:text-start">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <CategoryChip article={article} href={catHref} dark />
              </motion.div>
              <motion.h1 className="heading-page mt-6 text-balance" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.75, ease: EASE }}>
                <ArticleTitle text={title} />
              </motion.h1>
              {(article.excerpt || article.lesson?.hero?.description) && (
                <p className="mx-auto mt-5 max-w-xl line-clamp-3 text-pretty text-base leading-relaxed text-white/65 md:text-lg lg:mx-0">
                  {article.excerpt || article.lesson?.hero?.description}
                </p>
              )}
              {article.lesson?.hero && <HeroPills pills={article.lesson.hero.pills} />}
              <div className="mt-8 border-t border-white/10 pt-6 [&>div]:justify-center lg:[&>div]:justify-start">
                <MetaLine article={article} minutes={minutes} t={t} dark />
              </div>
            </div>
            {hasCover(article) && (
              <motion.div className="min-w-0 p-2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}>
                <TiltCard max={4} glare={false} className="relative">
                  <span className="pointer-events-none absolute -inset-3 rounded-[2.25rem] border border-gold/40" aria-hidden />
                  <span className="pointer-events-none absolute -end-5 -top-5 size-24 rounded-full bg-gold/40 blur-2xl" aria-hidden />
                  <CoverFrame cover={article.cover} title={article.title} />
                </TiltCard>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <section className="relative bg-white py-12 md:py-16">
        <div className="container-x grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
          <div ref={bodyRef} className="min-w-0">
            {toc && <MobileQuickGuide toc={toc} active={active} />}
            <Body article={article} />
            <ShareRow title={article.title} ns="gtcNewsPage.article" />
          </div>
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-5">
              {toc && <QuickGuide toc={toc} active={active} progress={progress} />}
              <div className="is-dark relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-brand-600 via-brand-800 to-brand-950 p-5 text-white">
                <span className="bg-grid-dark absolute inset-0 opacity-40" aria-hidden />
                <p className="heading-label relative">{t('article.share')}</p>
                <div className="relative mt-4">
                  <ShareIcons title={article.title} dark t={t} />
                </div>
              </div>
              {!toc && side.length > 0 && (
                <div className="rounded-[1.75rem] bg-[#f6f7fb] p-2 ring-1 ring-brand/10">
                  <p className="heading-label px-3 pb-1 pt-3">{article.category}</p>
                  <div className="rounded-[1.5rem] bg-white p-1.5">
                    {side.map((a) => (
                      <NewsCard key={a.id} article={a} variant="row" showCategory={false} compact />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      <NewsCarousel
        articles={related}
        title={t('article.related', { category: article.category || t('breadcrumb.current') })}
        description=""
        viewAllHref={catHref}
        viewAllLabel={t('article.allNews')}
        prevLabel={t('article.prev')}
        nextLabel={t('article.next')}
      />
    </>
  );
}

export default function NewsArticlePage({ article, related }) {
  const t = useTranslations('gtcNewsPage');
  const toc = article.lesson?.toc;
  const bodyRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: bodyRef, offset: ['start 30%', 'end 70%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const active = useActiveId(toc?.items.map((it) => it.id) ?? []);
  const catHref = newsCategoryHref(article.categorySlug);
  const crumbs = [{ label: t('breadcrumb.home'), href: '/' }, { label: t('breadcrumb.current'), href: NEWS_PATH }, ...(article.category ? [{ label: article.category, href: catHref }] : []), { label: article.title }];

  return (
    <div className="overflow-x-clip bg-white text-ink">
      <ScrollProgress />
      <Header theme="dark" />
      <main>
        <Split
          article={article}
          related={related}
          t={t}
          crumbs={crumbs}
          catHref={catHref}
          minutes={readMinutes(article.html)}
          title={article.lesson?.hero?.title || article.title}
          toc={toc}
          active={active}
          progress={progress}
          bodyRef={bodyRef}
        />
        <ActivationBand />
      </main>
      <Footer theme="dark" />
    </div>
  );
}
