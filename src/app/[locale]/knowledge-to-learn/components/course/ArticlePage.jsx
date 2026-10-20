'use client';
/**
 * /knowledge-to-learn/<course>/<section>/<article> — one lesson.
 * The Strapi lesson template is parsed server side (src/lib/learnArticle.js) and rendered here in the theme:
 *   dark hero (badge, eyebrow, title, pills + lesson list card)
 *   → white: numbered sections / summary / FAQ / risk warning, sticky "quick guide" with scroll-spy + reading progress
 *   → share, previous / next lesson → navy app promo → navy CTA.
 * Opening a lesson marks it as read (course progress). Bodies that don't follow the template render as cleaned HTML.
 */
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import { ArrowLeft, ArrowRight, BookOpen, Bookmark, Check, CheckCircle2, ChevronDown, Clock, Link2, TriangleAlert, UserRound } from 'lucide-react';
import NavLink from '@/components/shared/nav/NavLink';
import FaqAccordion from '@/components/shared/FaqAccordion';
import { SOCIALS } from '@/components/shared/icons';
import { Reveal, EASE } from '@/components/motion';
import { cn } from '@/lib/utils';
import { LearnShell, LearnHero, LearnAppPromo, LearnCta } from './LearnShell';
import { useMarkRead, useReadLessons } from './progress';
import { HUB_PATH, articleHref, courseHref, sectionHref } from '../../courses';

const PILL_ICONS = [Clock, UserRound, BookOpen];
const digits = (s, fallback) => (String(s ?? '').match(/\d+/)?.[0] ?? String(fallback)).padStart(2, '0');

/* ------------------------------------------------------------ hero */

function HeroKicker({ hero }) {
  if (!hero?.badge && !hero?.eyebrow) return null;
  return (
    <motion.div className="mt-6 flex flex-col items-center gap-3 lg:items-start" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
      {hero.badge && (
        <span className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-gold-200 ring-1 ring-gold/30">
          <BookOpen className="size-3.5" /> {hero.badge}
        </span>
      )}
      {hero.eyebrow && <span className="text-base font-medium italic text-white/60">{hero.eyebrow}</span>}
    </motion.div>
  );
}

function HeroPills({ pills, lessonLabel }) {
  const items = [...(pills ?? []).map((label, i) => ({ label, Icon: PILL_ICONS[i] ?? BookOpen })), lessonLabel && { label: lessonLabel, Icon: CheckCircle2, gold: true }].filter(Boolean);
  if (!items.length) return null;
  return (
    <motion.ul className="mt-8 flex flex-wrap justify-center gap-2.5 lg:justify-start" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } } }}>
      {items.map(({ label, Icon, gold }) => (
        <motion.li
          key={label}
          variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
          className={cn('inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ring-1 backdrop-blur', gold ? 'bg-gold/15 text-gold-200 ring-gold/30' : 'bg-white/[0.06] text-white/75 ring-white/10')}
        >
          <Icon className="size-4" /> {label}
        </motion.li>
      ))}
    </motion.ul>
  );
}

/** Hero aside: the lessons of this section (current highlighted, read ones ticked). */
function LessonsCard({ course, section, articles, current, read }) {
  const t = useTranslations('knowledgePage.course');
  if (articles.length < 2) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.2 }} className="mx-auto w-full max-w-md rounded-[2rem] bg-white/[0.05] p-5 ring-1 ring-white/10 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 px-2">
        <NavLink href={sectionHref(course, section.slug)} className="text-sm font-semibold text-white transition-colors hover:text-gold-200">
          {section.name}
        </NavLink>
        <span className="shrink-0 text-xs text-white/50">{t('lessons', { count: articles.length })}</span>
      </div>
      <ol className="mt-4 space-y-1">
        {articles.map((a, i) => {
          const on = a.slug === current;
          const done = read.includes(`${section.slug}/${a.slug}`);
          return (
            <li key={a.slug}>
              <NavLink
                href={articleHref(course, section.slug, a.slug)}
                aria-current={on ? 'page' : undefined}
                className={cn('flex items-start gap-3 rounded-xl px-3 py-2.5 text-start text-sm leading-snug transition-colors', on ? 'bg-white text-brand-900' : 'text-white/65 hover:bg-white/[0.07] hover:text-white')}
              >
                {done && !on ? (
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-gold-200" />
                ) : (
                  <span dir="ltr" className={cn('mt-0.5 w-4 shrink-0 text-xs font-bold tabular-nums', on ? 'text-gold' : 'text-white/35')}>
                    {i + 1}
                  </span>
                )}
                <span className="line-clamp-2">{a.title}</span>
              </NavLink>
            </li>
          );
        })}
      </ol>
    </motion.div>
  );
}

/* ------------------------------------------------------------ quick guide (TOC) */

/** Id of the section currently in the reading zone. */
function useActiveId(ids) {
  const key = ids.join('|');
  const [active, setActive] = useState(ids[0] ?? null);
  useEffect(() => {
    const els = key.split('|').map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key]);
  return active;
}

function jump(e, id) {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.history.replaceState(null, '', `#${id}`);
}

function TocList({ items, active, onPick }) {
  return (
    <ol className="space-y-1">
      {items.map((it, i) => {
        const on = it.id === active;
        return (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              onClick={(e) => {
                jump(e, it.id);
                onPick?.();
              }}
              className={cn('relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm leading-snug transition-colors', on ? 'text-brand' : 'text-ink/60 hover:bg-white hover:text-ink')}
            >
              {on && <motion.span layoutId="toc-active" className="absolute inset-0 rounded-xl bg-white shadow-sm ring-1 ring-brand/15" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              <span dir="ltr" className={cn('relative grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-bold tabular-nums transition-colors', on ? 'bg-brand text-white' : 'bg-brand-50 text-brand')}>
                {digits(it.num, i + 1)}
              </span>
              <span className={cn('relative', on && 'font-semibold')}>{it.label}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}

function QuickGuide({ toc, active, progress }) {
  return (
    <div className="rounded-[1.75rem] bg-[#f6f7fb] p-4 ring-1 ring-brand/10">
      <div className="px-3 pt-2">
        {toc.label && <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold-600">{toc.label}</span>}
        {toc.title && <p className="mt-1 font-semibold text-ink">{toc.title}</p>}
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-brand/10" aria-hidden>
          <motion.div className="h-full origin-left rounded-full bg-gradient-to-r from-brand to-gold rtl:origin-right" style={{ scaleX: progress }} />
        </div>
      </div>
      <div className="mt-3 max-h-[calc(100vh-15rem)] overflow-y-auto pe-1">
        <TocList items={toc.items} active={active} />
      </div>
    </div>
  );
}

function MobileQuickGuide({ toc, active }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-10 overflow-hidden rounded-[1.5rem] bg-[#f6f7fb] ring-1 ring-brand/10 lg:hidden">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start">
        <span>
          {toc.label && <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-gold-600">{toc.label}</span>}
          <span className="font-semibold text-ink">{toc.title}</span>
        </span>
        <span className={cn('grid size-9 shrink-0 place-items-center rounded-full bg-brand text-white transition-transform duration-300', open && 'rotate-180')}>
          <ChevronDown className="size-4" />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>
            <div className="px-2 pb-3">
              <TocList items={toc.items} active={active} onPick={() => setOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------ body blocks */

function SectionEyebrow({ num, index }) {
  return (
    <div className="flex items-center gap-3">
      <span dir="ltr" className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand to-brand-800 text-sm font-bold text-white shadow-lg shadow-brand/20">
        {digits(num, index)}
      </span>
      {num && <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand">{num}</span>}
      <span className="h-px flex-1 bg-gradient-to-r from-gold/50 to-transparent rtl:bg-gradient-to-l" aria-hidden />
    </div>
  );
}

function Block({ block, index }) {
  switch (block.type) {
    case 'intro':
      return (
        <Reveal y={16}>
          <div className="learn-article learn-lead" dangerouslySetInnerHTML={{ __html: block.html }} />
        </Reveal>
      );
    case 'section':
      return (
        <section id={block.id || undefined} className="scroll-mt-28">
          <Reveal y={24}>
            <SectionEyebrow num={block.num} index={index} />
            <h2 className="mt-5 text-balance text-2xl font-bold leading-tight tracking-tight text-ink md:text-[1.75rem]">{block.title}</h2>
            <div className="learn-article mt-5" dangerouslySetInnerHTML={{ __html: block.html }} />
          </Reveal>
        </section>
      );
    case 'summary':
      return (
        <section id={block.id || undefined} className="scroll-mt-28">
          <Reveal y={24}>
            <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-brand-50 via-white to-gold-50 p-7 ring-1 ring-brand/15 md:p-9">
              <span className="absolute inset-y-0 start-0 w-1 bg-gradient-to-b from-gold to-brand" aria-hidden />
              <motion.span className="absolute -end-16 -top-16 size-56 rounded-full bg-gold/15 blur-3xl" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 6, repeat: Infinity }} aria-hidden />
              <div className="relative flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-gold text-white shadow-lg shadow-gold/30">
                  <Bookmark className="size-5" />
                </span>
                <h2 className="text-xl font-bold text-ink md:text-2xl">{block.title}</h2>
              </div>
              <div className="learn-article relative mt-5" dangerouslySetInnerHTML={{ __html: block.html }} />
            </div>
          </Reveal>
        </section>
      );
    case 'faq':
      return (
        <section id={block.id || undefined} className="scroll-mt-28">
          <Reveal y={24}>
            <SectionEyebrow num={block.num} index={index} />
            <h2 className="mt-5 text-2xl font-bold tracking-tight text-ink md:text-[1.75rem]">{block.title}</h2>
          </Reveal>
          {block.items.length > 0 && <FaqAccordion items={block.items} numbered className="mt-8" />}
        </section>
      );
    case 'risk':
      return (
        <Reveal y={24}>
          <div className="is-dark relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-brand-900 to-ink p-7 text-white md:p-9">
            <div className="bg-grid-dark absolute inset-0 opacity-40" aria-hidden />
            <div className="relative flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-down/15 text-red-300 ring-1 ring-down/30">
                <TriangleAlert className="size-5" />
              </span>
              <h2 className="text-lg font-bold text-red-300">{block.title}</h2>
            </div>
            <div className="relative mt-5 space-y-3 text-sm leading-relaxed">
              {block.paragraphs.map((p, i) => (
                <p key={i} className={i === block.paragraphs.length - 1 && i > 0 ? 'text-white/55' : 'text-white/80'}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </Reveal>
      );
    default:
      return null;
  }
}

/* ------------------------------------------------------------ share + prev / next */

const SHARE = {
  LinkedIn: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
  Facebook: (u) => `https://www.facebook.com/sharer/sharer.php?u=${u}`,
  X: (u, t) => `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
  Telegram: (u, t) => `https://t.me/share/url?url=${u}&text=${t}`
};

function ShareRow({ title }) {
  const t = useTranslations('knowledgePage.course');
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);
  useEffect(() => setUrl(window.location.href.split('#')[0]), []);
  const u = encodeURIComponent(url);
  const txt = encodeURIComponent(title);
  const btn = 'grid size-11 place-items-center rounded-full bg-brand-50 text-brand transition-all hover:-translate-y-0.5 hover:bg-brand hover:text-white';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="mt-14 flex flex-col items-center justify-between gap-4 rounded-[1.5rem] p-5 ring-1 ring-brand/10 sm:flex-row">
      <span className="text-sm font-semibold text-ink">{t('share')}</span>
      <div className="flex flex-wrap items-center gap-2">
        {SOCIALS.filter((s) => SHARE[s.name]).map((s) => (
          <a key={s.name} href={url ? SHARE[s.name](u, txt) : undefined} target="_blank" rel="noopener noreferrer" aria-label={s.name} className={btn}>
            {s.icon('size-4')}
          </a>
        ))}
        <button type="button" onClick={copy} aria-label={copied ? t('copied') : t('copyLink')} title={copied ? t('copied') : t('copyLink')} className={cn(btn, copied && 'bg-up text-white hover:bg-up')}>
          {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
        </button>
      </div>
    </div>
  );
}

function PrevNext({ course, section, prev, next }) {
  const t = useTranslations('knowledgePage.course');
  const card = 'group flex flex-1 flex-col gap-1 rounded-2xl p-5 ring-1 ring-brand/10 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand/10 hover:ring-brand/25';
  return (
    <nav className="mt-6 flex flex-col gap-4 sm:flex-row">
      {prev ? (
        <NavLink href={articleHref(course, section.slug, prev.slug)} className={card}>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-ink/45">
            <ArrowLeft className="size-3.5 rtl:-scale-x-100" /> {t('previous')}
          </span>
          <span className="font-semibold text-ink group-hover:text-brand">{prev.title}</span>
        </NavLink>
      ) : (
        <NavLink href={sectionHref(course, section.slug)} className={card}>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-ink/45">
            <ArrowLeft className="size-3.5 rtl:-scale-x-100" /> {t('backToSection')}
          </span>
          <span className="font-semibold text-ink group-hover:text-brand">{section.name}</span>
        </NavLink>
      )}
      {next && (
        <NavLink href={articleHref(course, section.slug, next.slug)} className={cn(card, 'bg-brand text-end ring-brand hover:ring-brand')}>
          <span className="inline-flex items-center justify-end gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
            {t('next')} <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1 rtl:-scale-x-100" />
          </span>
          <span className="font-semibold text-white">{next.title}</span>
        </NavLink>
      )}
    </nav>
  );
}

/* ------------------------------------------------------------ page */

export default function ArticlePage({ course, ns, section, article, articles }) {
  const t = useTranslations('knowledgePage.course');
  const tc = useTranslations(`${ns}.courseHeader`);
  const tk = useTranslations('knowledgePage.breadcrumb');
  useMarkRead(course, section.slug, article.slug);
  const read = useReadLessons(course);
  const courseTitle = tc('title').replace(/[[\]]/g, '');
  const i = articles.findIndex((a) => a.slug === article.slug);
  const lesson = article.lesson;
  const hero = lesson?.hero;
  const toc = lesson?.toc;

  const bodyRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: bodyRef, offset: ['start 30%', 'end 70%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const active = useActiveId(toc?.items.map((it) => it.id) ?? []);
  let n = 0;

  return (
    <LearnShell>
      <LearnHero
        crumbs={[
          { label: tk('home'), href: '/' },
          { label: tk('current'), href: HUB_PATH },
          { label: courseTitle, href: courseHref(course) },
          { label: section.name, href: sectionHref(course, section.slug) },
          { label: article.title }
        ]}
        back={{ href: sectionHref(course, section.slug), label: t('backToSection') }}
        kicker={<HeroKicker hero={hero} />}
        title={hero?.title || article.title}
        subtitle={hero?.description || article.excerpt}
        aside={<LessonsCard course={course} section={section} articles={articles} current={article.slug} read={read} />}
      >
        <HeroPills pills={hero?.pills} lessonLabel={i >= 0 ? t('lessonOf', { n: i + 1, total: articles.length }) : null} />
      </LearnHero>

      <section className="relative bg-white py-14 md:py-20">
        <div className={cn('container-x grid gap-12 lg:gap-16', toc && 'lg:grid-cols-[minmax(0,1fr)_300px]')}>
          <div ref={bodyRef} className={cn('min-w-0', !toc && 'mx-auto w-full max-w-3xl')}>
            {toc && <MobileQuickGuide toc={toc} active={active} />}
            {article.image && (
              <img src={article.image.url} alt={article.image.alt || article.title} className="mb-12 aspect-[16/9] w-full rounded-[1.75rem] object-cover ring-1 ring-brand/10" />
            )}
            {lesson ? (
              <div className="space-y-14 md:space-y-16">
                {lesson.blocks.map((b, k) => (
                  <Block key={`${b.type}-${b.id || k}`} block={b} index={b.type === 'section' || b.type === 'faq' ? ++n : n} />
                ))}
              </div>
            ) : (
              <Reveal y={16}>
                <div className="learn-article" dangerouslySetInnerHTML={{ __html: article.html }} />
              </Reveal>
            )}
            <ShareRow title={article.title} />
            <PrevNext course={course} section={section} prev={articles[i - 1]} next={i >= 0 ? articles[i + 1] : null} />
          </div>

          {toc && (
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <QuickGuide toc={toc} active={active} progress={progress} />
              </div>
            </aside>
          )}
        </div>
      </section>

      {/* <LearnAppPromo /> */}
      <LearnCta />
    </LearnShell>
  );
}
