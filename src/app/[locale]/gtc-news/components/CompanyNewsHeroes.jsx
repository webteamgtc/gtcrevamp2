'use client';
/**
 * /gtc-news/company-news — HERO drafts (section by section review; the rest of the page is the live layout).
 * Switch with the draft bar or ?companyHero=h1|h2|h3 ("now" = the live hero).
 *  H1 · Story deck — title on the left; the three newest stories as a fanned deck of photo cards on the right.
 *       The front card moves to the back every few seconds (or on click); hover spreads the deck.
 *  H2 · Press wall — centred title over two rows of story photos gliding in opposite directions, with the
 *       newest headline as a pill link under the title.
 *  H3 · Front page — a newspaper-style masthead (newsroom name, today's date, rule lines), the newest headline
 *       large with its photo in an arched gold frame, and the next stories as a small numbered index.
 */
import { useEffect, useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, Building2 } from 'lucide-react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import HeroBackdrop from '@/components/shared/HeroBackdrop';
import NavLink from '@/components/shared/nav/NavLink';
import { NewsCover } from '@/components/shared/news/NewsCard';
import { Marquee, EASE } from '@/components/motion';
import { intlLocale } from '@/i18n/locales';
import { cn } from '@/lib/utils';
import { CategoryLinks, PostTitle, When } from './categoryShared';

function Shell({ children, className }) {
  return (
    <section className={cn('is-dark relative overflow-hidden bg-ink pb-16 pt-36 text-white md:pb-24 md:pt-44', className)}>
      <HeroBackdrop />
      {children}
    </section>
  );
}

function Title({ category, t, center = false }) {
  return (
    <>
      <motion.h1 className="heading-page text-balance" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.75, ease: EASE }}>
        {category.name}
      </motion.h1>
      <motion.p className={cn('mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/65 md:text-lg', center && 'mx-auto')} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.6 }}>
        {t('category.description', { category: category.name })}
      </motion.p>
    </>
  );
}

/* ------------------------------------------------------------ H1 · Story deck */

function Deck({ category, categories, articles, t, crumbs }) {
  const [order, setOrder] = useState(() => articles.slice(0, 3).map((_, i) => i));
  const [hover, setHover] = useState(false);
  const stack = order.map((i) => articles[i]).filter(Boolean);

  useEffect(() => {
    if (hover || stack.length < 2) return;
    const id = setTimeout(() => setOrder((o) => [...o.slice(1), o[0]]), 5000);
    return () => clearTimeout(id);
  }, [order, hover, stack.length]);

  return (
    <Shell>
      <span className="absolute -end-20 top-1/4 size-[28rem] rounded-full bg-gold/15 blur-[130px]" aria-hidden />
      <div className="container-x relative">
        <Breadcrumb className="lg:justify-start" items={crumbs} />
        <div className="mt-10 grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="text-center lg:text-start">
            <Title category={category} t={t} />
            <div className="mt-8">
              <CategoryLinks categories={categories} current={category.slug} style="pills" />
            </div>
          </div>

          {stack.length > 0 && (
            <div className="relative mx-auto h-[360px] w-full max-w-[460px] sm:h-[420px]" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
              {stack.map((a, depth) => {
                const front = depth === 0;
                const spread = hover ? depth * 34 : depth * 16;
                return (
                  <motion.article
                    key={a.id}
                    className={cn('group absolute inset-x-0 top-0 mx-auto flex h-[320px] w-full flex-col overflow-hidden rounded-[2rem] bg-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/15 sm:h-[370px]', !front && 'cursor-pointer')}
                    style={{ zIndex: 10 - depth }}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1 - depth * 0.18, y: spread, x: depth * (hover ? 26 : 10), rotate: depth * (hover ? 5 : 3), scale: 1 - depth * 0.05 }}
                    transition={{ type: 'spring', stiffness: 170, damping: 22 }}
                    onClick={() => !front && setOrder((o) => [o[depth], ...o.filter((_, k) => k !== depth)])}
                  >
                    <div className="absolute inset-0">
                      <NewsCover article={a} showTitle={false} />
                    </div>
                    <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-transparent" aria-hidden />
                    <div className="relative mt-auto p-6 md:p-7">
                      {front && <span className="inline-flex rounded-full bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white">{t('hero.latest')}</span>}
                      {front ? <PostTitle a={a} as="h2" className="heading-card mt-3 line-clamp-3 text-white" /> : <p className="heading-card mt-3 line-clamp-3 text-white">{a.title}</p>}
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <When a={a} className="text-white/60" />
                        {front && <ArrowUpRight className="size-9 rounded-full bg-white/15 p-2 text-white backdrop-blur transition-transform group-hover:rotate-45 rtl:-scale-x-100" aria-hidden />}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
              {/* position dots */}
              <div className="absolute inset-x-0 -bottom-2 flex justify-center gap-2">
                {articles.slice(0, 3).map((a, i) => (
                  <span key={a.id} className={cn('h-1.5 rounded-full transition-all duration-500', order[0] === i ? 'w-8 bg-gold' : 'w-1.5 bg-white/30')} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}

/* ------------------------------------------------------------ H2 · Press wall */

function PressWall({ category, categories, articles, t, crumbs }) {
  const lead = articles[0];
  const tiles = articles.slice(0, 8);
  const rowA = tiles.filter((_, i) => i % 2 === 0);
  const rowB = tiles.filter((_, i) => i % 2 === 1);
  const Tile = ({ a }) => (
    <NavLink href={a.href} className="group relative block h-40 w-64 shrink-0 overflow-hidden rounded-3xl ring-1 ring-white/10 md:h-48 md:w-80">
      <NewsCover article={a} showTitle={false} />
      <span className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" aria-hidden />
      <span className="absolute inset-x-0 bottom-0 line-clamp-2 p-4 text-sm font-semibold text-white">{a.title}</span>
    </NavLink>
  );
  return (
    <Shell className="pb-10 md:pb-14">
      <div className="container-x relative">
        <Breadcrumb className="justify-center" items={crumbs} />
        <div className="mx-auto mt-10 max-w-3xl text-center">
          <motion.span className="mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-gold-200 to-gold text-white shadow-xl shadow-gold/30" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 15 }} aria-hidden>
            <Building2 className="size-6" />
          </motion.span>
          <div className="mt-6">
            <Title category={category} t={t} center />
          </div>
          {lead && (
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6, ease: EASE }}>
              <NavLink href={lead.href} className="group mx-auto mt-8 inline-flex max-w-full items-center gap-3 rounded-full bg-white/[0.07] py-1.5 pe-2 ps-1.5 text-start text-sm ring-1 ring-white/15 backdrop-blur transition-colors hover:bg-white/[0.12]">
                <span className="shrink-0 rounded-full bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white">{t('hero.latest')}</span>
                <span className="truncate font-semibold">{lead.title}</span>
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white text-brand-900">
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100" aria-hidden />
                </span>
              </NavLink>
            </motion.div>
          )}
          <div className="mt-8 flex justify-center">
            <CategoryLinks categories={categories} current={category.slug} style="pills" />
          </div>
        </div>
      </div>
      {tiles.length > 2 && (
        <motion.div className="relative mt-14 grid gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 1 }}>
          <Marquee duration={50} gap="1rem" className="mask-fade-x">
            {[...rowA, ...rowA].map((a, i) => (
              <Tile key={`${a.id}-${i}`} a={a} />
            ))}
          </Marquee>
          <Marquee duration={60} gap="1rem" reverse className="mask-fade-x">
            {[...rowB, ...rowB].map((a, i) => (
              <Tile key={`${a.id}-${i}`} a={a} />
            ))}
          </Marquee>
        </motion.div>
      )}
    </Shell>
  );
}

/* ------------------------------------------------------------ H3 · Front page */

function FrontPage({ category, categories, articles, t, crumbs }) {
  const locale = useLocale();
  const today = useMemo(() => new Intl.DateTimeFormat(intlLocale(locale), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()), [locale]);
  const [lead, ...next] = articles;
  const index = next.slice(0, 3);
  return (
    <Shell>
      <div className="container-x relative">
        <Breadcrumb className="lg:justify-start" items={crumbs} />

        {/* masthead */}
        <motion.div className="mt-10 border-y border-white/15 py-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          <div className="flex flex-col items-center justify-between gap-3 text-center md:flex-row md:text-start">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50" suppressHydrationWarning>
              {today}
            </span>
            <motion.h1 className="heading-page" initial={{ letterSpacing: '0.2em', opacity: 0 }} animate={{ letterSpacing: '-0.01em', opacity: 1 }} transition={{ duration: 1.1, ease: EASE }}>
              {category.name}
            </motion.h1>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-200">GTCFX</span>
          </div>
        </motion.div>
        <motion.span className="mt-1 block h-px origin-center bg-gold/60" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, ease: EASE, delay: 0.2 }} aria-hidden />

        {lead && (
          <div className="mt-10 grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
            <motion.article className="group relative order-2 lg:order-1" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}>
              <span className="heading-label">{t('hero.latest')}</span>
              <PostTitle a={lead} as="h2" className="heading-section mt-4 line-clamp-3 text-balance text-white transition-colors group-hover:text-gold-100" />
              {lead.excerpt && <p className="mt-4 line-clamp-3 max-w-xl text-white/65">{lead.excerpt}</p>}
              <div className="mt-6 flex flex-wrap items-center gap-5">
                <When a={lead} className="text-white/55" />
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-gold-200">
                  {t('hero.readArticle')}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100" aria-hidden />
                </span>
              </div>

              {index.length > 0 && (
                <ol className="mt-10 grid gap-1 border-t border-white/10 pt-4">
                  {index.map((a, i) => (
                    <motion.li key={a.id} className="group/i relative flex items-center gap-4 rounded-2xl px-2 py-3 transition-colors hover:bg-white/[0.05]" initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1, ease: EASE }}>
                      <span className="text-2xl font-extrabold tabular-nums text-white/20 transition-colors group-hover/i:text-gold-300">{String(i + 2).padStart(2, '0')}</span>
                      <span className="min-w-0 flex-1">
                        <NavLink href={a.href} className="line-clamp-1 font-semibold after:absolute after:inset-0">
                          {a.title}
                        </NavLink>
                        <When a={a} className="mt-0.5 text-white/45" />
                      </span>
                      <ArrowUpRight className="size-4 shrink-0 text-white/40 transition-colors group-hover/i:text-gold-200 rtl:-scale-x-100" aria-hidden />
                    </motion.li>
                  ))}
                </ol>
              )}
            </motion.article>

            <motion.div className="relative order-1 mx-auto w-full max-w-md lg:order-2" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}>
              <motion.span className="absolute -inset-3 rounded-t-full rounded-b-[2.5rem] border border-gold/40" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 4, repeat: Infinity }} aria-hidden />
              <NavLink href={lead.href} className="group relative block aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[2rem] ring-1 ring-white/15">
                <NewsCover article={lead} showTitle={false} />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" aria-hidden />
              </NavLink>
            </motion.div>
          </div>
        )}

        <div className="mt-12">
          <CategoryLinks categories={categories} current={category.slug} style="pills" />
        </div>
      </div>
    </Shell>
  );
}

export const COMPANY_HERO_LABELS = { now: 'Live hero', h1: 'H1 · Story deck', h2: 'H2 · Press wall', h3: 'H3 · Front page' };

export default function CompanyNewsHero({ variant, ...props }) {
  if (variant === 'h1') return <Deck {...props} />;
  if (variant === 'h2') return <PressWall {...props} />;
  return <FrontPage {...props} />;
}
