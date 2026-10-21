'use client';
/**
 * "GTCFX & Knowledge Hub" — the latest event story (Strapi `event` category): copy beside a large image
 * (cursor tilt + zoom), "View more" to the category.
 */
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { ArrowRight, CalendarDays, Sparkles } from 'lucide-react';
import ArrowLink from '@/components/shared/ArrowLink';
import NavLink from '@/components/shared/nav/NavLink';
import { SectionIntro } from '@/components/shared/SectionIntro';
import { NewsCover } from '@/components/shared/news/NewsCard';
import { Reveal, TiltCard, EASE } from '@/components/motion';
import { newsCategoryHref } from '@/lib/news-path';

export default function KnowledgeHubSection({ featured }) {
  const t = useTranslations('gtcNewsPage.knowledgeHub');
  if (!featured) return null;
  const href = newsCategoryHref(featured.categorySlug);
  return (
    <section className="relative overflow-hidden bg-white py-14 md:py-24">
      <div className="absolute -start-40 top-20 size-[420px] rounded-full bg-gold/[0.08] blur-[120px]" aria-hidden />
      <div className="container-x relative">
        <SectionIntro title={t('title')} description={t('subtitle')} layout="split">
          <div className="mt-6 flex justify-center lg:justify-start">
            <ArrowLink href={href}>{t('viewMore')}</ArrowLink>
          </div>
        </SectionIntro>

        <Reveal y={28} className="mt-12 md:mt-14">
          <article className="group relative grid items-center gap-8 overflow-hidden rounded-[2rem] bg-[#f6f7fb] p-4 ring-1 ring-brand/10 md:p-6 lg:grid-cols-[1fr_1.15fr] lg:gap-12 lg:p-8">
            <div className="bg-grid-light mask-radial absolute inset-0 opacity-50" aria-hidden />
            <div className="relative order-2 px-2 pb-2 lg:order-1 lg:px-4">
              <motion.span className="inline-flex items-center gap-2 rounded-full bg-brand px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-lg shadow-brand/25" initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}>
                <Sparkles className="size-3.5 text-gold-200" />
                {featured.category}
              </motion.span>
              <h3 className="mt-5 text-balance text-2xl font-bold leading-tight text-ink transition-colors group-hover:text-brand md:text-3xl">
                <NavLink href={featured.href} className="after:absolute after:inset-0">
                  {featured.title}
                </NavLink>
              </h3>
              <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-ink/50">
                <CalendarDays className="size-4 text-gold" />
                <time dateTime={featured.publishedAt}>{featured.dateLabel}</time>
                {featured.author && <span>· {featured.author}</span>}
              </p>
              {featured.excerpt && <p className="mt-5 line-clamp-4 text-pretty text-[15px] leading-relaxed text-ink/60 md:text-base">{featured.excerpt}</p>}
              <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-brand">
                {t('readMore')}
                <span className="grid size-9 place-items-center rounded-full bg-brand text-white transition-all duration-500 group-hover:bg-gold">
                  <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-0.5 rtl:-scale-x-100" />
                </span>
              </span>
            </div>

            <TiltCard max={6} className="relative order-1 lg:order-2">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] shadow-2xl shadow-brand/25 ring-1 ring-brand/10">
                <NewsCover article={featured} />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-950/40 via-transparent to-transparent" aria-hidden />
              </div>
              <motion.span className="absolute -bottom-4 -end-4 -z-10 size-40 rounded-full bg-gold/30 blur-3xl" animate={{ opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 5, repeat: Infinity }} aria-hidden />
            </TiltCard>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
