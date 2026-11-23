'use client';
/**
 * UAE CAT 5 — Legal Documents hub (GTC Financial Consultancy L.L.C. documents only; the main site's /legal hub lists
 * other GTC entities). Cards only, every PDF opens in a new tab or downloads: the CMA licence (/CMA.pdf), the Privacy
 * Policy and the CAT5_DOCS (Website Terms of Use, Client Agreement, Complaint Handling Policy, Cookie Policy), both in
 * /public/en-ae/documents. Rhythm: dark hero → gray (document cards) → legal footer (Cat5Frame).
 */
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { Cookie, Download, ExternalLink, FileText, Globe, Handshake, Lock, MessageSquareWarning, ShieldCheck } from 'lucide-react';
import { AccentTitle } from '@/components/shared/SectionIntro';
import { HeroIn, Reveal, Stagger, StaggerItem } from '@/components/motion';
import { CAT5_CMA_URL, CAT5_DOCS, CAT5_PDF_PATHS } from '@/config/regions';
import { Cat5Frame, LICENCE_NO, NetworkBackdrop, TopTitle } from '../../components/MarketingPage';

const NS = 'marketingPage.legalDocumentsPage';

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

const DOC_ICONS = { termsOfUse: Globe, clientAgreement: Handshake, complaints: MessageSquareWarning, cookies: Cookie };

/** View (new tab) + Download for a PDF card */
function PdfLinks({ file, t, dark }) {
  return (
    <>
      <a href={encodeURI(file)} target="_blank" rel="noopener noreferrer" className={dark ? btn.primary : btn.brand}>
        <ExternalLink className="size-4" aria-hidden /> {t('view')}
      </a>
      <a href={encodeURI(file)} download className={dark ? btn.ghostDark : btn.outline}>
        <Download className="size-4" aria-hidden /> {t('downloadFile')}
      </a>
    </>
  );
}

export default function LegalDocumentsPage() {
  const t = useTranslations(NS);
  const tt = useTranslations('marketingPage.termsOfBusinessPage');
  const tf = useTranslations('marketingPage.footer.links');

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

      {/* document cards — PDFs open in a new tab, pages link to their page */}
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
                <PdfLinks file={CAT5_PDF_PATHS.legalDocuments} t={t} dark />
              </DocCard>
            </StaggerItem>
            <StaggerItem className="h-full">
              <DocCard Icon={Lock} title={tf('privacy')} hint={tt('viewerHint')} type={t('pdf')}>
                <PdfLinks file={CAT5_PDF_PATHS.privacyPolicy} t={t} />
              </DocCard>
            </StaggerItem>
            {CAT5_DOCS.map(({ key, file }) => (
              <StaggerItem key={key} className="h-full">
                <DocCard Icon={DOC_ICONS[key] ?? FileText} title={t(`docs.${key}.title`)} hint={t(`docs.${key}.hint`)} type={t('pdf')}>
                  <PdfLinks file={file} t={t} />
                </DocCard>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal y={12}>
            <p className="mt-10 text-center text-xs text-ink/50">
              {t('cmaNote')}{' '}
              <a href={CAT5_CMA_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand underline underline-offset-2 hover:text-brand-700">
                {t('cmaLink')}
              </a>
            </p>
          </Reveal>
        </div>
      </section>
    </Cat5Frame>
  );
}
