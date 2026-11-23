'use client';
/**
 * UAE CAT 5 — Legal Documents hub (GTC Financial Consultancy L.L.C. documents only; the main site's /legal hub lists
 * other GTC entities). Cards for the CMA licence documentation (PDF), Terms of Business, Privacy Policy and the Website
 * Terms of Use (PDF in /public/en-ae, opens in a new tab), then the
 * document viewer: tabs for the CMA licence (PDF) and the Word documents (CAT5_WORD_DOCS: Client Agreement, Complaint
 * Handling Policy, Cookie Policy, rendered in the page by WordDocument). A card's "View" picks its tab and scrolls to
 * the viewer; ?doc=<key> (e.g. from the cookie modal) opens that document first. Rhythm: dark hero → gray (document cards + viewer) → legal footer (Cat5Frame).
 */
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Cookie, Download, ExternalLink, Eye, FileText, Globe, Handshake, Lock, MessageSquareWarning, ScrollText, ShieldCheck } from 'lucide-react';
import { AccentTitle } from '@/components/shared/SectionIntro';
import { HeroIn, Reveal, Stagger, StaggerItem } from '@/components/motion';
import { CAT5_CMA_URL, CAT5_PDF_PATHS, CAT5_WORD_DOCS } from '@/config/regions';
import { Cat5Frame, LICENCE_NO, NetworkBackdrop, TopTitle } from '../../components/MarketingPage';
import { cat5Href } from '../../components/cat5Links';
import WordDocument from './WordDocument';

const NS = 'marketingPage.legalDocumentsPage';
const VIEWER_ID = 'document-viewer';

function DocCard({ Icon, title, hint, type, children, featured }) {
  return (
    <div className={`group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-6 ring-1 transition-all duration-500 hover:-translate-y-1.5 md:p-7 ${featured ? 'is-dark bg-gradient-to-br from-brand-700 via-brand-900 to-ink text-white shadow-2xl shadow-brand/25 ring-brand' : 'bg-white ring-brand/10 hover:shadow-2xl hover:shadow-brand/15 hover:ring-brand/20'}`}>
      {featured && (
        <>
          <div className="bg-grid-dark absolute inset-0 opacity-50" aria-hidden />
          <motion.span className="absolute -end-16 -top-16 size-56 rounded-full bg-gold/25 blur-3xl" animate={{ opacity: [0.45, 0.9, 0.45] }} transition={{ duration: 6, repeat: Infinity }} aria-hidden />
        </>
      )}
      <div className="relative flex items-start justify-between gap-3">
        <span className={`grid size-12 place-items-center rounded-2xl transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 ${featured ? 'bg-gold text-white shadow-lg shadow-gold/30' : 'bg-gradient-to-br from-brand-500 to-brand-900 text-white shadow-lg shadow-brand/25'}`}>
          <Icon className="size-5" />
        </span>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${featured ? 'bg-white/10 text-gold-200 ring-1 ring-white/15' : 'bg-brand-50 text-brand'}`}>{type}</span>
      </div>
      <h3 className={`relative mt-6 text-lg font-bold md:text-xl ${featured ? 'text-white' : 'text-ink'}`}>{title}</h3>
      <p className={`relative mt-1.5 flex-1 text-sm leading-relaxed ${featured ? 'text-white/60' : 'text-ink/55'}`}>{hint}</p>
      <div className="relative mt-6 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

const btn = {
  primary: 'inline-flex h-10 items-center gap-2 rounded-full bg-gold px-4 text-sm font-semibold text-white shadow-lg shadow-gold/25 transition-colors hover:bg-gold-600',
  ghostDark: 'inline-flex h-10 items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-semibold text-white ring-1 ring-white/15 transition-colors hover:bg-white/20',
  brand: 'inline-flex h-10 items-center gap-2 rounded-full bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-700',
  outline: 'inline-flex h-10 items-center gap-2 rounded-full border border-brand/20 bg-white px-4 text-sm font-semibold text-brand transition-colors hover:bg-brand-50'
};

const WORD_ICONS = { clientAgreement: Handshake, complaints: MessageSquareWarning, cookies: Cookie };


export default function LegalDocumentsPage() {
  const t = useTranslations(NS);
  const tt = useTranslations('marketingPage.termsOfBusinessPage');
  const tf = useTranslations('marketingPage.footer.links');
  const locale = useLocale();
  const pdf = CAT5_PDF_PATHS.legalDocuments;
  const [active, setActive] = useState('cma');

  // ?doc=<key> (cookie modal link) opens that document in the viewer
  useEffect(() => {
    const key = new URLSearchParams(window.location.search).get('doc');
    if (key && CAT5_WORD_DOCS.some((d) => d.key === key)) setActive(key);
  }, []);

  const open = (key) => {
    setActive(key);
    document.getElementById(VIEWER_ID)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const docs = [
    { key: 'cma', Icon: ShieldCheck, title: t('viewerTitle'), hint: t('viewerHint'), file: pdf, pdf: true },
    ...CAT5_WORD_DOCS.map((d) => ({ ...d, Icon: WORD_ICONS[d.key] ?? FileText, title: t(`docs.${d.key}.title`), hint: t(`docs.${d.key}.hint`) }))
  ];
  const current = docs.find((d) => d.key === active) ?? docs[0];

  return (
    <Cat5Frame page="home">
      {/* hero */}
      <section className="is-dark relative overflow-hidden bg-[#05081c] text-white">
        <NetworkBackdrop id="gtn-legal-docs" />
        <div className="container-x relative flex min-h-[360px] flex-col items-center justify-center py-16 text-center md:min-h-[420px] md:py-20">
          <HeroIn>
            <TopTitle dark center>
              {t('label')}
            </TopTitle>
          </HeroIn>
          <HeroIn as="h1" delay={0.05} className="heading-page mt-6 max-w-3xl text-balance">
            <AccentTitle text={t('title')} />
          </HeroIn>
          <HeroIn as="p" delay={0.1} className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-white/75 md:text-lg">
            {t('text')}
          </HeroIn>
          <HeroIn delay={0.12} className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-gold-200 ring-1 ring-white/15">
            <ShieldCheck className="size-4" aria-hidden />
            {LICENCE_NO}
          </HeroIn>
        </div>
      </section>

      {/* document cards */}
      <section className="relative overflow-hidden bg-[#f6f8fc] py-12 md:py-16">
        <div className="container-x">
          <Reveal y={16}>
            <h2 className="heading-section text-center">
              <AccentTitle text={t('listTitle')} />
            </h2>
          </Reveal>
          <Stagger className="mt-10 grid gap-5 md:grid-cols-3" stagger={0.1}>
            <StaggerItem className="h-full">
              <DocCard featured Icon={ShieldCheck} title={t('viewerTitle')} hint={t('viewerHint')} type={t('pdf')}>
                <button type="button" onClick={() => open('cma')} className={btn.primary}>
                  <Eye className="size-4" aria-hidden /> {t('view')}
                </button>
                <a href={pdf} target="_blank" rel="noopener noreferrer" className={btn.ghostDark} aria-label={t('openNewTab')} title={t('openNewTab')}>
                  <ExternalLink className="size-4" aria-hidden />
                </a>
                <a href={pdf} download className={btn.ghostDark} aria-label={t('download')} title={t('download')}>
                  <Download className="size-4" aria-hidden />
                </a>
              </DocCard>
            </StaggerItem>
            <StaggerItem className="h-full">
              <DocCard Icon={ScrollText} title={tt('viewerTitle')} hint={tt('viewerHint')} type={t('page')}>
                <a href={cat5Href(locale, 'termsOfBusiness')} className={btn.brand}>
                  {t('view')} <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden />
                </a>
              </DocCard>
            </StaggerItem>
            <StaggerItem className="h-full">
              <DocCard Icon={Lock} title={tf('privacy')} hint={tt('viewerHint')} type={t('page')}>
                <a href={cat5Href(locale, 'privacy')} className={btn.brand}>
                  {t('view')} <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden />
                </a>
              </DocCard>
            </StaggerItem>
            <StaggerItem className="h-full">
              <DocCard Icon={Globe} title={t('docs.termsOfUse.title')} hint={t('docs.termsOfUse.hint')} type={t('pdf')}>
                <a href={CAT5_PDF_PATHS.termsOfUse} target="_blank" rel="noopener noreferrer" className={btn.brand}>
                  <ExternalLink className="size-4" aria-hidden /> {t('view')}
                </a>
                <a href={CAT5_PDF_PATHS.termsOfUse} download className={btn.outline}>
                  <Download className="size-4" aria-hidden /> {t('downloadFile')}
                </a>
              </DocCard>
            </StaggerItem>
            {CAT5_WORD_DOCS.map(({ key, file }) => {
              return (
                <StaggerItem key={key} className="h-full">
                  <DocCard Icon={WORD_ICONS[key] ?? FileText} title={t(`docs.${key}.title`)} hint={t(`docs.${key}.hint`)} type={t('word')}>
                    <button type="button" onClick={() => open(key)} className={btn.brand}>
                      <Eye className="size-4" aria-hidden /> {t('view')}
                    </button>
                    <a href={encodeURI(file)} download className={btn.outline}>
                      <Download className="size-4" aria-hidden /> {t('downloadFile')}
                    </a>
                  </DocCard>
                </StaggerItem>
              );
            })}
          </Stagger>

          {/* document viewer — CMA licence (PDF) + Word documents */}
          <Reveal y={20} className="mt-12">
            <div id={VIEWER_ID} className="scroll-mt-28 overflow-hidden rounded-[1.75rem] bg-white shadow-[0_40px_100px_-40px_rgba(41,59,147,0.35)] ring-1 ring-brand/10">
              {/* tabs */}
              <div role="tablist" className="flex gap-1.5 overflow-x-auto border-b border-brand/10 bg-[#f6f8fc] p-2 [scrollbar-width:none] md:p-3">
                {docs.map(({ key, title, Icon }) => {
                  const on = key === current.key;
                  return (
                    <button key={key} type="button" role="tab" aria-selected={on} onClick={() => setActive(key)} className={`relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${on ? 'text-white' : 'text-ink/60 hover:bg-white hover:text-brand'}`}>
                      {on && <motion.span layoutId="legal-doc-tab" className="absolute inset-0 rounded-full bg-brand shadow-lg shadow-brand/25" transition={{ type: 'spring', stiffness: 420, damping: 34 }} aria-hidden />}
                      <Icon className="relative size-4" aria-hidden />
                      <span className="relative whitespace-nowrap">{title}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-4 border-b border-brand/10 bg-gradient-to-r from-brand-50/80 to-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between md:px-8">
                <div className="flex items-start gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand text-white shadow-lg shadow-brand/25">
                    <current.Icon className="size-5" aria-hidden />
                  </span>
                  <div>
                    <h2 className="heading-card text-ink">{current.title}</h2>
                    <p className="mt-1 text-sm text-ink/55">{current.hint}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {current.pdf && (
                    <a href={current.file} target="_blank" rel="noopener noreferrer" className={btn.brand}>
                      <ExternalLink className="size-4" aria-hidden />
                      {t('openNewTab')}
                    </a>
                  )}
                  <a href={encodeURI(current.file)} download className={btn.outline}>
                    <Download className="size-4" aria-hidden />
                    {current.pdf ? t('download') : t('downloadFile')}
                  </a>
                </div>
              </div>

              <div className="relative bg-ink/[0.03] p-2 md:p-4">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={current.key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                    {current.pdf ? (
                      <iframe src={`${current.file}#view=FitH`} title={current.title} loading="lazy" className="h-[min(75vh,880px)] w-full rounded-xl border border-brand/10 bg-white shadow-inner" />
                    ) : (
                      <WordDocument file={current.file} loadingLabel={t('loading')} errorLabel={t('loadError')} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
              {current.pdf && (
                <p className="border-t border-brand/10 px-5 py-4 text-center text-xs text-ink/50 md:px-8">
                  {t('cmaNote')}{' '}
                  <a href={CAT5_CMA_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand underline underline-offset-2 hover:text-brand-700">
                    {t('cmaLink')}
                  </a>
                </p>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </Cat5Frame>
  );
}
