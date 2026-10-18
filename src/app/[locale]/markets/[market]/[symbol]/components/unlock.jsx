'use client';
/**
 * Symbol page — "Unlock Global Markets With A Reliable CFD Broker": the devices picture + four download buttons.
 * Picture and button links: SYMBOL_PAGE in src/config/marketPages.js. Copy: marketsPage.symbol.unlock.
 */
import Image from 'next/image';
import { motion } from 'motion/react';
import { Apple, Globe, SquareTerminal, Download } from 'lucide-react';
import NavLink from '@/components/shared/nav/NavLink';
import BandLine from '@/components/shared/BandLine';
import { SectionIntro } from '@/components/shared/SectionIntro';
import { Reveal, Stagger, StaggerItem, Parallax } from '@/components/motion';
import { SYMBOL_PAGE } from '@/config/marketPages';
import { cn } from '@/lib/utils';
import { useSymT } from './shared';

const WindowsIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M3 5.1 10.4 4v7.2H3V5.1Zm0 13.8 7.4 1.1v-7.1H3v6Zm8.3 1.2L21 21.5v-8.6h-9.7v7.2Zm0-16.2v7.3H21V2.5l-9.7 1.4Z" />
  </svg>
);
const DL_ICON = { windows: WindowsIcon, mac: Apple, linux: SquareTerminal, web: Globe };

function Devices({ className, priority = false }) {
  const t = useSymT();
  const img = SYMBOL_PAGE.devicesImage;
  return <Image src={img.src} width={img.width} height={img.height} alt={t('unlock.imageAlt')} sizes="(min-width: 1280px) 1100px, 100vw" priority={priority} className={cn('h-auto w-full', className)} />;
}

/** Centred — as in the design: title, the devices picture, the note and four buttons (Windows filled). */
export function UnlockCentered() {
  const t = useSymT();
  return (
    <section className="overflow-hidden bg-white py-14 text-ink md:py-24">
      <div className="container-x">
        <SectionIntro title={t('unlock.title')} description={t('unlock.text')} />
        <Reveal y={30} className="mx-auto mt-10 max-w-5xl md:mt-14">
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
            <Devices />
          </motion.div>
        </Reveal>
        <p className="mx-auto mt-8 max-w-2xl text-center text-[15px] text-ink/60">{t('unlock.note')}</p>
        <Stagger className="mx-auto mt-6 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4" stagger={0.07}>
          {SYMBOL_PAGE.downloads.map((d, i) => {
            const I = DL_ICON[d.id] ?? Download;
            return (
              <StaggerItem key={d.id}>
                <NavLink href={d.href} className={cn('flex h-14 items-center justify-center gap-3 rounded-xl border text-base font-semibold transition-all hover:-translate-y-0.5', i === 0 ? 'border-brand bg-brand text-white hover:bg-brand-700' : 'border-brand/20 text-ink hover:border-brand hover:text-brand')}>
                  <I className="size-5" />
                  {t(`unlock.${d.id}`)}
                </NavLink>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

/** Split — copy and a 2×2 grid of download cards on the start side, the picture floating on a soft glow on the other. */
export function UnlockSplit() {
  const t = useSymT();
  return (
    <section className="overflow-hidden bg-[#f6f8fc] py-14 text-ink md:py-24">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
        <div>
          <SectionIntro layout="split" className="lg:grid-cols-1 lg:gap-5" title={t('unlock.title')} description={t('unlock.text')} />
          <Stagger className="mt-8 grid grid-cols-2 gap-3" stagger={0.07}>
            {SYMBOL_PAGE.downloads.map((d) => {
              const I = DL_ICON[d.id] ?? Download;
              return (
                <StaggerItem key={d.id}>
                  <NavLink href={d.href} className="group flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-brand/10 transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-30px_rgba(41,59,147,0.6)] hover:ring-brand/30">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                      <I className="size-5" />
                    </span>
                    <span>
                      <span className="block text-[15px] font-semibold">{t(`unlock.${d.id}`)}</span>
                      <span className="block text-xs text-ink/50">{t(d.id === 'web' ? 'unlock.openBrowser' : 'unlock.download')}</span>
                    </span>
                  </NavLink>
                </StaggerItem>
              );
            })}
          </Stagger>
          <p className="mt-6 text-sm text-ink/55">{t('unlock.note')}</p>
        </div>
        <Reveal y={30} className="relative">
          <span className="absolute inset-[8%] rounded-full bg-brand/20 blur-[90px]" aria-hidden />
          <Parallax offset={40} className="relative">
            <Devices />
          </Parallax>
        </Reveal>
      </div>
    </section>
  );
}

/** Stage — dark band: the picture rises onto a lit stage, the downloads sit under it as glass buttons. */
export function UnlockStage() {
  const t = useSymT();
  return (
    <section className="is-dark relative overflow-hidden bg-ink py-14 text-white md:py-24">
      <div className="bg-grid-dark mask-radial absolute inset-0 opacity-50" aria-hidden />
      <span className="absolute left-1/2 top-1/2 size-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/35 blur-[140px]" aria-hidden />
      <BandLine />
      <div className="container-x relative">
        <SectionIntro dark title={t('unlock.title')} description={t('unlock.text')} />
        <Reveal y={40} className="mx-auto mt-10 max-w-5xl md:mt-14">
          <div className="rounded-[2rem] bg-white p-3 shadow-[0_60px_120px_-40px_rgba(41,59,147,0.9)] ring-1 ring-white/20 sm:p-6">
            <Devices />
          </div>
        </Reveal>
        <Stagger className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4" stagger={0.07}>
          {SYMBOL_PAGE.downloads.map((d) => {
            const I = DL_ICON[d.id] ?? Download;
            return (
              <StaggerItem key={d.id}>
                <NavLink href={d.href} className="flex h-14 items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/[0.06] text-base font-semibold text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:border-gold hover:bg-gold">
                  <I className="size-5" />
                  {t(`unlock.${d.id}`)}
                </NavLink>
              </StaggerItem>
            );
          })}
        </Stagger>
        <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-white/55">{t('unlock.note')}</p>
      </div>
    </section>
  );
}
