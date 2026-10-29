'use client';

import { useTranslations } from 'next-intl';
import { Download, ExternalLink, FileText, ShieldCheck } from 'lucide-react';
import { AccentTitle } from '@/components/shared/SectionIntro';
import { HeroIn, Reveal } from '@/components/motion';
import { CAT5_CMA_URL } from '@/config/regions';
import { Cat5Frame, LICENCE_NO, NetworkBackdrop, TopTitle } from '../../components/MarketingPage';

const PDF_PATH = '/CMA.pdf';

export default function LegalDocumentsPage() {
  const t = useTranslations('marketingPage.legalDocumentsPage');
  return (
    <Cat5Frame page="home">
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

      <section className="bg-[#f6f8fc] py-12 md:py-16">
        <div className="container-x">
          <Reveal y={20}>
            <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-[0_40px_100px_-40px_rgba(41,59,147,0.35)] ring-1 ring-brand/10">
              <div className="flex flex-col gap-4 border-b border-brand/10 bg-gradient-to-r from-brand-50/80 to-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between md:px-8">
                <div className="flex items-start gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand text-white shadow-lg shadow-brand/25">
                    <FileText className="size-5" aria-hidden />
                  </span>
                  <div>
                    <h2 className="heading-card text-ink">{t('viewerTitle')}</h2>
                    <p className="mt-1 text-sm text-ink/55">{t('viewerHint')}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={PDF_PATH}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-full bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                  >
                    <ExternalLink className="size-4" aria-hidden />
                    {t('openNewTab')}
                  </a>
                  <a
                    href={PDF_PATH}
                    download
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-brand/20 bg-white px-4 text-sm font-semibold text-brand transition-colors hover:bg-brand-50"
                  >
                    <Download className="size-4" aria-hidden />
                    {t('download')}
                  </a>
                </div>
              </div>
              <div className="relative bg-ink/[0.03] p-2 md:p-4">
                <iframe
                  src={`${PDF_PATH}#view=FitH`}
                  title={t('viewerTitle')}
                  className="h-[min(75vh,880px)] w-full rounded-xl border border-brand/10 bg-white shadow-inner"
                />
              </div>
              <p className="border-t border-brand/10 px-5 py-4 text-center text-xs text-ink/50 md:px-8">
                {t('cmaNote')}{' '}
                <a href={CAT5_CMA_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand underline underline-offset-2 hover:text-brand-700">
                  {t('cmaLink')}
                </a>
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </Cat5Frame>
  );
}
