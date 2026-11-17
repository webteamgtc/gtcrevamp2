'use client';
/**
 * /gtc-news/company-news — DRAFTS for review (switch with the draft bar or ?company=n1|n2|n3; "now" is the live layout).
 *  N1 · Newsroom bento — light hero, the newest stories in a bento grid (big photo story + photo tiles + navy text
 *       tiles), then a card grid.
 *  N2 · Timeline — dark hero with the newest story as a large slow-zooming photo, then every story on a timeline
 *       grouped by month; the line draws itself as you scroll.
 *  N3 · Spotlight — full-height carousel of the three newest stories (cross-fading photos, progress thumbnails),
 *       then the rest as tilt cards.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import { ArrowRight, ArrowUpRight, Building2, Pause, Play } from 'lucide-react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import HeroBackdrop from '@/components/shared/HeroBackdrop';
import NavLink from '@/components/shared/nav/NavLink';
import NewsCard, { NewsCover } from '@/components/shared/news/NewsCard';
import { Reveal, TiltCard, EASE } from '@/components/motion';
import { intlLocale } from '@/i18n/locales';
import { cn } from '@/lib/utils';
import { CategoryLinks, Empty, LoadMore, PostTitle, When } from './categoryShared';

const inView = (i = 0) => ({ initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.15 }, transition: { duration: 0.55, ease: EASE, delay: (i % 3) * 0.08 } });

function ReadMore({ t, className }) {
  return (
    <span className={cn('inline-flex items-center gap-2 text-sm font-semibold', className)}>
      {t('trends.readMore')}
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" aria-hidden />
    </span>
  );
}

/* ------------------------------------------------------------ N1 · Newsroom bento */

function Bento({ category, categories, articles, total, t, crumbs, loadMore }) {
  const [lead, b, c, d, e, ...rest] = articles;
  return (
    <>
      <section className="relative overflow-hidden bg-white pb-12 pt-36 md:pt-44">
        <div className="bg-grid-light mask-radial absolute inset-0 opacity-50" aria-hidden />
        <span className="absolute -end-32 top-10 size-[420px] rounded-full bg-gold/15 blur-[120px]" aria-hidden />
        <div className="container-x relative">
          <Breadcrumb tone="light" className="lg:justify-start" items={crumbs} />
          <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <motion.span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-xs font-semibold text-brand ring-1 ring-brand/10" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Building2 className="size-3.5" aria-hidden /> {t('drafts.newsroom')}
              </motion.span>
              <motion.h1 className="heading-page mt-5" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.75, ease: EASE }}>
                {category.name}
              </motion.h1>
              <motion.p className="mt-4 max-w-xl text-pretty text-lg leading-relaxed text-ink/60" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.6 }}>
                {t('category.description', { category: category.name })}
              </motion.p>
            </div>
            <motion.div className="flex items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-xl shadow-brand/10 ring-1 ring-brand/10" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25, type: 'spring', stiffness: 220, damping: 18 }}>
              <span className="text-gradient-gold text-4xl font-extrabold tracking-tight">{total}</span>
              <span className="text-sm font-semibold leading-tight text-ink/60">{t('drafts.stories', { count: total })}</span>
            </motion.div>
          </div>
          <div className="mt-10">
            <CategoryLinks categories={categories} current={category.slug} style="underline" />
          </div>
        </div>
      </section>

      <section className="relative bg-white pb-16 md:pb-24">
        <div className="container-x">
          {!lead ? (
            <Empty t={t} />
          ) : (
            <>
              <div className="grid auto-rows-[minmax(220px,auto)] gap-5 md:grid-cols-2 lg:grid-cols-4">
                {/* big photo story */}
                <motion.article {...inView(0)} className="is-dark group relative min-h-[420px] overflow-hidden rounded-[2rem] md:col-span-2 lg:row-span-2">
                  <div className="absolute inset-0">
                    <NewsCover article={lead} showTitle={false} />
                  </div>
                  <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" aria-hidden />
                  <div className="absolute inset-x-0 bottom-0 p-7 text-white md:p-9">
                    <span className="inline-flex items-center gap-2 rounded-full bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em]">{t('hero.latest')}</span>
                    <PostTitle a={lead} as="h2" className="heading-card mt-4 line-clamp-3 text-white" />
                    {lead.excerpt && <p className="mt-3 line-clamp-2 max-w-xl text-sm leading-relaxed text-white/70">{lead.excerpt}</p>}
                    <When a={lead} className="mt-4 text-white/60" />
                  </div>
                </motion.article>
                {/* photo tiles */}
                {[b, c].filter(Boolean).map((a, i) => (
                  <motion.article key={a.id} {...inView(i + 1)} className="is-dark group relative overflow-hidden rounded-[2rem] bg-ink">
                    <div className="absolute inset-0 opacity-90">
                      <NewsCover article={a} showTitle={false} />
                    </div>
                    <span className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/30 to-transparent" aria-hidden />
                    <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                      <When a={a} className="text-white/60" />
                      <PostTitle a={a} className="mt-2 line-clamp-2 font-semibold text-white" />
                    </div>
                    <ArrowUpRight className="absolute end-5 top-5 size-9 rounded-full bg-white/15 p-2 text-white backdrop-blur transition-transform group-hover:rotate-45 rtl:-scale-x-100" aria-hidden />
                  </motion.article>
                ))}
                {/* navy text tiles */}
                {[d, e].filter(Boolean).map((a, i) => (
                  <motion.article key={a.id} {...inView(i + 3)} className={cn('group relative flex flex-col justify-between overflow-hidden rounded-[2rem] p-6', i === 0 ? 'is-dark bg-gradient-to-br from-brand-700 to-brand-950 text-white' : 'bg-[#f6f7fb] text-ink ring-1 ring-brand/10')}>
                    <span className={cn('absolute -end-10 -top-10 size-36 rounded-full blur-2xl', i === 0 ? 'bg-gold/30' : 'bg-brand/10')} aria-hidden />
                    <When a={a} className={cn('relative', i === 0 && 'text-white/60')} />
                    <div className="relative">
                      <PostTitle a={a} className={cn('line-clamp-3 font-semibold', i === 0 ? 'text-white' : 'transition-colors group-hover:text-brand')} />
                      <ReadMore t={t} className={cn('mt-4', i === 0 ? 'text-gold-200' : 'text-brand')} />
                    </div>
                  </motion.article>
                ))}
              </div>
              {rest.length > 0 && (
                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((a, i) => (
                    <motion.div key={a.id} className="h-full" {...inView(i)}>
                      <NewsCard article={a} showCategory={false} />
                    </motion.div>
                  ))}
                </div>
              )}
              <LoadMore {...loadMore} label={t('category.loadMore')} />
            </>
          )}
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------ N2 · Timeline */

function useMonths(articles) {
  const locale = useLocale();
  return useMemo(() => {
    const fmt = new Intl.DateTimeFormat(intlLocale(locale), { month: 'long', year: 'numeric', timeZone: 'UTC' });
    const groups = [];
    for (const a of articles) {
      const d = a.publishedAt ? new Date(a.publishedAt) : null;
      const key = d ? `${d.getUTCFullYear()}-${d.getUTCMonth()}` : 'other';
      let g = groups.find((x) => x.key === key);
      if (!g) groups.push((g = { key, label: d ? fmt.format(d) : '', items: [] }));
      g.items.push(a);
    }
    return groups;
  }, [articles, locale]);
}

function Timeline({ category, categories, articles, t, crumbs, loadMore }) {
  const [lead, ...rest] = articles;
  const months = useMonths(rest);
  const lineRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: lineRef, offset: ['start 70%', 'end 60%'] });
  const grow = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  let n = 0;

  return (
    <>
      <section className="is-dark relative overflow-hidden bg-ink pb-16 pt-36 text-white md:pb-24 md:pt-44">
        <HeroBackdrop />
        <div className="container-x relative">
          <Breadcrumb className="lg:justify-start" items={crumbs} />
          <div className="mt-10 grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <div className="text-center lg:text-start">
              <motion.h1 className="heading-page" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.75, ease: EASE }}>
                {category.name}
              </motion.h1>
              <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-white/65 md:text-lg lg:mx-0">{t('category.description', { category: category.name })}</p>
            </div>
            <div className="lg:max-w-md">
              <CategoryLinks categories={categories} current={category.slug} style="pills" />
            </div>
          </div>

          {lead && (
            <motion.article className="group relative mt-12 overflow-hidden rounded-[2.25rem] ring-1 ring-white/15" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}>
              <div className="relative aspect-[16/10] md:aspect-[21/9]">
                <motion.div className="absolute inset-0" animate={{ scale: [1, 1.08] }} transition={{ duration: 18, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}>
                  <NewsCover article={lead} showTitle={false} />
                </motion.div>
                <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent md:bg-gradient-to-r rtl:md:bg-gradient-to-l" aria-hidden />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6 md:inset-y-0 md:end-auto md:flex md:max-w-xl md:flex-col md:justify-end md:p-12">
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-900">
                  <span className="size-1.5 animate-pulse rounded-full bg-down" aria-hidden /> {t('hero.latest')}
                </span>
                <PostTitle a={lead} as="h2" className="heading-section mt-4 line-clamp-3 text-white" />
                {lead.excerpt && <p className="mt-3 line-clamp-2 text-white/70 max-md:hidden">{lead.excerpt}</p>}
                <div className="mt-5 flex items-center gap-5">
                  <When a={lead} className="text-white/60" />
                  <ReadMore t={t} className="text-gold-200" />
                </div>
              </div>
            </motion.article>
          )}
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#f6f7fb] py-16 md:py-24">
        <div className="bg-grid-light mask-radial absolute inset-0 opacity-60" aria-hidden />
        <div className="container-x relative">
          {!articles.length ? (
            <Empty t={t} />
          ) : (
            <div ref={lineRef} className="relative">
              {/* the line: at the start on phones, in the middle on desktop */}
              <span className="absolute inset-y-0 start-4 w-px bg-brand/15 md:start-1/2" aria-hidden />
              <motion.span className="absolute inset-y-0 start-4 w-px origin-top bg-gradient-to-b from-brand via-gold to-gold md:start-1/2" style={{ scaleY: grow }} aria-hidden />
              {months.map((g) => (
                <div key={g.key} className="relative pb-6">
                  <Reveal y={10} className="relative z-10 mb-8 flex md:justify-center">
                    <span className="ms-0 rounded-full bg-ink px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-gold-200 shadow-lg md:ms-0">{g.label}</span>
                  </Reveal>
                  <div className="grid gap-8 md:gap-y-12">
                    {g.items.map((a) => {
                      const right = n++ % 2 === 1;
                      return (
                        <motion.div
                          key={a.id}
                          className={cn('relative ps-12 md:w-1/2 md:ps-0', right ? 'md:ms-auto md:ps-12' : 'md:pe-12')}
                          initial={{ opacity: 0, x: right ? 40 : -40 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, amount: 0.3 }}
                          transition={{ duration: 0.6, ease: EASE }}
                        >
                          <span className={cn('absolute top-8 start-[11px] size-3 rounded-full bg-gold ring-4 ring-[#f6f7fb] md:start-auto', right ? 'md:-start-1.5' : 'md:-end-1.5')} aria-hidden />
                          <article className="group relative grid overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-brand/10 transition-shadow hover:shadow-xl hover:shadow-brand/10 sm:grid-cols-[42%_1fr]">
                            <div className="relative aspect-[16/10] overflow-hidden sm:aspect-auto sm:min-h-[170px]">
                              <div className="absolute inset-0">
                                <NewsCover article={a} showTitle={false} />
                              </div>
                            </div>
                            <div className="p-5 md:p-6">
                              <When a={a} />
                              <PostTitle a={a} className="mt-2 line-clamp-3 font-semibold transition-colors group-hover:text-brand" />
                              {a.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/55">{a.excerpt}</p>}
                            </div>
                          </article>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
          <LoadMore {...loadMore} label={t('category.loadMore')} />
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------ N3 · Spotlight carousel */

const SLIDE_MS = 6500;

function Spotlight({ category, categories, articles, t, crumbs, loadMore }) {
  const slides = articles.slice(0, 3);
  const rest = articles.slice(3);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const a = slides[i];

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const id = setTimeout(() => setI((x) => (x + 1) % slides.length), SLIDE_MS);
    return () => clearTimeout(id);
  }, [i, paused, slides.length]);

  return (
    <>
      <section className="is-dark relative flex min-h-[92vh] flex-col overflow-hidden bg-ink pt-32 text-white" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <AnimatePresence initial={false}>
          {a && (
            <motion.div key={a.id} className="absolute inset-0" initial={{ opacity: 0, scale: 1.12 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ opacity: { duration: 1 }, scale: { duration: SLIDE_MS / 1000 + 1, ease: 'linear' } }} aria-hidden>
              <NewsCover article={a} showTitle={false} />
            </motion.div>
          )}
        </AnimatePresence>
        <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" aria-hidden />
        <span className="absolute inset-0 bg-gradient-to-r from-ink/80 to-transparent rtl:bg-gradient-to-l" aria-hidden />

        <div className="container-x relative flex flex-1 flex-col">
          <Breadcrumb className="lg:justify-start" items={crumbs} />
          <div className="mt-6 flex items-center gap-3 text-sm font-semibold text-gold-200">
            <Building2 className="size-4" aria-hidden /> {category.name}
          </div>

          <div className="flex flex-1 items-end pb-10">
            <AnimatePresence mode="wait">
              {a && (
                <motion.article key={a.id} className="group relative max-w-3xl" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.6, ease: EASE }}>
                  <When a={a} className="text-white/65" />
                  <PostTitle a={a} as="h2" className="heading-page mt-4 line-clamp-3 text-balance text-white" />
                  {a.excerpt && <p className="mt-4 line-clamp-2 max-w-2xl text-lg text-white/70">{a.excerpt}</p>}
                  <span className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-white pe-2 ps-6 text-sm font-semibold text-brand-900">
                    {t('hero.readArticle')}
                    <span className="grid size-8 place-items-center rounded-full bg-brand text-white">
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100" aria-hidden />
                    </span>
                  </span>
                </motion.article>
              )}
            </AnimatePresence>
          </div>

          {/* thumbnails with progress */}
          {slides.length > 1 && (
            <div className="grid grid-cols-[repeat(3,minmax(0,1fr))_auto] gap-3 border-t border-white/15 pb-8 pt-5">
              {slides.map((s, k) => (
                <button key={s.id} type="button" onClick={() => setI(k)} className={cn('group relative text-start transition-opacity', k === i ? 'opacity-100' : 'opacity-55 hover:opacity-90')}>
                  <span className="absolute inset-x-0 -top-5 h-0.5 overflow-hidden bg-white/15">
                    {k === i && <motion.span key={`${s.id}-${paused}`} className="block h-full origin-left bg-gold rtl:origin-right" initial={{ scaleX: 0 }} animate={{ scaleX: paused ? 0 : 1 }} transition={{ duration: paused ? 0 : SLIDE_MS / 1000, ease: 'linear' }} />}
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="hidden aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/20 md:block">
                      <NewsCover article={s} showTitle={false} />
                    </span>
                    <span className="line-clamp-2 text-xs font-semibold leading-snug md:text-sm">{s.title}</span>
                  </span>
                </button>
              ))}
              <button type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Play' : 'Pause'} className="grid size-10 place-items-center self-center rounded-full bg-white/10 ring-1 ring-white/20 hover:bg-white/20">
                {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="relative bg-white py-16 md:py-20">
        <div className="container-x">
          <div className="mb-10">
            <CategoryLinks categories={categories} current={category.slug} style="underline" />
          </div>
          {!articles.length ? (
            <Empty t={t} />
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((x, k) => (
                  <motion.div key={x.id} className="h-full" {...inView(k)}>
                    <TiltCard max={6} className="h-full rounded-[1.75rem]">
                      <NewsCard article={x} showCategory={false} />
                    </TiltCard>
                  </motion.div>
                ))}
              </div>
              <LoadMore {...loadMore} label={t('category.loadMore')} />
            </>
          )}
        </div>
      </section>
    </>
  );
}

export const COMPANY_LABELS = { now: 'Live (Editorial)', n1: 'N1 · Newsroom bento', n2: 'N2 · Timeline', n3: 'N3 · Spotlight' };
export const COMPANY_HEADER = { n1: 'light', n2: 'dark', n3: 'overlay' };

export default function CompanyNewsDrafts({ variant, ...props }) {
  if (variant === 'n1') return <Bento {...props} />;
  if (variant === 'n2') return <Timeline {...props} />;
  return <Spotlight {...props} />;
}
