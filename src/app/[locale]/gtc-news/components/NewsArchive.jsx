'use client';
/**
 * Archive of every /gtc-news/<category> page: one featured story (wide card: photo + summary), then the rest in a
 * 3-column grid. Every card links straight to the post. The newest post is in the hero, so it starts from the second.
 */
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import NavLink from '@/components/shared/nav/NavLink';
import { Reveal, EASE } from '@/components/motion';
import { Empty, LoadMore, Photo, When } from './categoryShared';

const inView = (i = 0) => ({ initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.12 }, transition: { duration: 0.5, ease: EASE, delay: (i % 3) * 0.08 } });

function Featured({ a, tx }) {
  return (
    <motion.div {...inView()}>
      <NavLink href={a.href} className="group grid overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_-40px_rgba(41,59,147,0.45)] ring-1 ring-brand/10 transition-shadow duration-500 hover:shadow-[0_40px_100px_-40px_rgba(41,59,147,0.6)] lg:grid-cols-[1.35fr_1fr]">
        <Photo a={a} className="aspect-[16/9] lg:aspect-auto lg:min-h-[24rem]" />
        <div className="relative flex flex-col justify-center p-6 md:p-10">
          <span className="absolute -end-16 -top-16 size-48 rounded-full bg-gold/15 blur-3xl" aria-hidden />
          <span className="relative inline-flex w-fit items-center gap-2 rounded-full bg-gold/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-gold-700 ring-1 ring-gold/25">
            <span className="size-1.5 rounded-full bg-gold" aria-hidden />
            {tx('featured')}
          </span>
          <When a={a} className="relative mt-5 font-semibold text-ink/50" />
          <h3 className="heading-card relative mt-2 text-balance text-ink transition-colors group-hover:text-brand md:text-[1.75rem] md:leading-tight">{a.title}</h3>
          {a.excerpt && <p className="relative mt-4 line-clamp-4 text-[15px] leading-relaxed text-ink/60">{a.excerpt}</p>}
          <span className="relative mt-7 inline-flex h-12 w-fit items-center gap-2 rounded-full bg-brand pe-2 ps-6 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-colors group-hover:bg-brand-700">
            {tx('openFull')}
            <span className="grid size-8 place-items-center rounded-full bg-white text-brand transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5">
              <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden />
            </span>
          </span>
        </div>
      </NavLink>
    </motion.div>
  );
}

function Card({ a, i, tx }) {
  return (
    <motion.div {...inView(i)} className="h-full">
      <NavLink href={a.href} className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white p-2 ring-1 ring-brand/10 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-brand/15 hover:ring-brand/20">
        <Photo a={a} className="aspect-[16/9] rounded-[1.35rem]" />
        <div className="flex flex-1 flex-col px-4 pb-4 pt-5">
          <When a={a} className="font-semibold text-gold-700" />
          <h3 className="mt-2 line-clamp-2 text-[17px] font-semibold leading-snug text-ink transition-colors group-hover:text-brand">{a.title}</h3>
          {a.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/55">{a.excerpt}</p>}
          <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brand">
            {tx('readStory')}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" aria-hidden />
          </span>
        </div>
      </NavLink>
    </motion.div>
  );
}

/** tx: category text (newsText in categoryShared). */
export default function NewsArchive({ articles, t, tx, loadMore }) {
  const [featured, ...rest] = articles.slice(1); // the newest post is in the hero
  if (articles.length && !featured) return null; // a single post: the hero shows it
  return (
    <section className="relative scroll-mt-20 overflow-clip bg-[#f6f7fb] py-14 md:py-24">
      <div className="bg-grid-light mask-radial absolute inset-0 opacity-60" aria-hidden />
      <div className="container-x relative">
        {!articles.length ? (
          <Empty t={t} />
        ) : (
          <>
            <Reveal y={16} className="mb-10 md:mb-12">
              <h2 className="heading-section text-balance">{tx('archive')}</h2>
              <p className="mt-3 max-w-2xl text-pretty text-[15px] leading-relaxed text-ink/60 md:text-base">{tx('archiveSub')}</p>
            </Reveal>
            <Featured a={featured} tx={tx} />
            {rest.length > 0 && (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 md:mt-10 lg:grid-cols-3">
                {rest.map((a, i) => (
                  <Card key={a.id} a={a} i={i} tx={tx} />
                ))}
              </div>
            )}
            <LoadMore {...loadMore} label={t('category.loadMore')} />
          </>
        )}
      </div>
    </section>
  );
}
