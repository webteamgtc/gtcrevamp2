'use client';
import { useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import NavLink from '@/components/shared/nav/NavLink';
import ArrowLink from '@/components/shared/ArrowLink';
import { SectionIntro } from '@/components/shared/SectionIntro';
import { Reveal } from '@/components/motion';
import { NEWS_PATH } from '@/lib/news-path';
import { getDir } from '@/i18n/locales';

/** Article cover from Strapi, or a branded navy cover with the title when there is no image. */
function Cover({ article }) {
  if (article.cover?.url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={article.cover.url}
        alt={article.cover.alt || article.title}
        width={article.cover.width ?? undefined}
        height={article.cover.height ?? undefined}
        loading="lazy"
        decoding="async"
        className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />
    );
  }
  return (
    <div className="relative size-full overflow-hidden bg-gradient-to-br from-brand-900 via-brand to-brand-700 text-white transition-transform duration-700 group-hover:scale-[1.04]" aria-hidden>
      <div className="bg-grid-dark absolute inset-0 opacity-50" />
      <span className="absolute -end-10 -top-10 size-48 rounded-full bg-gold/30 blur-3xl" />
      <span className="absolute -bottom-16 start-1/4 size-56 rounded-full bg-[#5b6ed2]/40 blur-3xl" />
      <div className="relative flex h-full flex-col justify-between p-6">
        <span className="text-sm font-black tracking-tight text-white/90">GTCFX</span>
        <p className="max-w-[85%] text-balance text-xl font-bold leading-tight">{article.title}</p>
      </div>
    </div>
  );
}

function Meta({ article }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink/50">
      {article.category && <span className="rounded-full bg-brand-50 px-2.5 py-1 font-semibold text-brand">{article.category}</span>}
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays className="size-3.5" aria-hidden />
        <time dateTime={article.publishedAt}>{article.dateLabel}</time>
      </span>
    </p>
  );
}

/**
 * Market News: large cards in a snap-scrolling row with previous/next buttons.
 * Data comes from Strapi (`articles`, see docs/strapi-news.md) through the page; sample articles until it's connected.
 */
export function MarketNews({ articles = [] }) {
  const t = useTranslations('marketsPage');
  const row = useRef(null);
  const rtl = getDir(useLocale()) === 'rtl';
  const go = (dir) => {
    const el = row.current;
    if (!el) return;
    el.scrollBy({ left: dir * (rtl ? -1 : 1) * el.clientWidth * 0.8, behavior: 'smooth' });
  };
  if (!articles.length) return null;
  return (
    <section className="relative bg-[#f6f7fb] py-14 text-ink md:py-24">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionIntro layout="split" title={t('news.title')} description={t('news.description')} className="flex-1" />
          <div className="flex gap-2">
            {[
              [-1, ChevronLeft, t('news.prev')],
              [1, ChevronRight, t('news.next')]
            ].map(([d, I, label]) => (
              <button key={d} type="button" onClick={() => go(d)} aria-label={label} className="grid size-12 place-items-center rounded-full border border-brand/15 bg-white text-brand transition-colors hover:bg-brand hover:text-white">
                <I className="size-5 rtl:-scale-x-100" />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div ref={row} className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-5 scroll-px-5 md:px-8 md:scroll-px-8 xl:px-[calc((100vw_-_1280px)/2_+_2rem)] xl:scroll-px-[calc((100vw_-_1280px)/2_+_2rem)] pb-4 md:mt-14">
        {articles.map((a) => (
          <article key={a.id} className="group relative w-[82vw] shrink-0 snap-start overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_-40px_rgba(41,59,147,0.5)] ring-1 ring-brand/10 sm:w-[420px]">
            <div className="aspect-[16/10] overflow-hidden">
              <Cover article={a} />
            </div>
            <div className="p-6">
              <Meta article={a} />
              <h3 className="heading-small mt-3 line-clamp-2">
                <NavLink href={a.href} className="after:absolute after:inset-0 hover:text-brand">
                  {a.title}
                </NavLink>
              </h3>
              {a.excerpt && <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-ink/55">{a.excerpt}</p>}
            </div>
          </article>
        ))}
      </div>
      <Reveal y={12} className="mt-10 flex justify-center">
        <ArrowLink href={NEWS_PATH}>{t('news.viewAll')}</ArrowLink>
      </Reveal>
    </section>
  );
}
