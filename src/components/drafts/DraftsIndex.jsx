'use client';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { ArrowUpRight, Languages } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import Logo from '../shared/Logo';
import { Stagger, StaggerItem, WordReveal, Reveal } from '../motion';
import { cn } from '@/lib/utils';

const PREVIEWS = [
  { href: '/draft-1', key: 'd1', bg: 'bg-white', bar: 'bg-[#f3f4f8]', block: 'bg-brand', text: 'bg-ink/80', accent: 'bg-gold' },
  { href: '/draft-2', key: 'd2', bg: 'bg-ink', bar: 'bg-white/10', block: 'bg-brand', text: 'bg-white/80', accent: 'bg-gold' },
  { href: '/draft-3', key: 'd3', bg: 'bg-brand-950', bar: 'bg-white', block: 'bg-[#eef0f5]', text: 'bg-white/80', accent: 'bg-gold' }
];

export default function DraftsIndex() {
  const t = useTranslations('drafts');
  const locale = useLocale();
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f6fa] py-16">
      <div className="bg-grid-light mask-radial absolute inset-0" />
      <div className="container-x relative">
        <div className="flex items-center justify-between">
          <Logo />
          <Link href="/" locale={locale === 'ar' ? 'en' : 'ar'} className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">
            <Languages className="size-4" /> {t('language')}
          </Link>
        </div>
        <h1 className="mt-16 max-w-3xl text-4xl font-bold tracking-tight text-ink md:text-6xl">
          <WordReveal text={t('title')} immediate />
        </h1>
        <Reveal delay={0.3}>
          <p className="mt-4 max-w-2xl text-lg text-ink/60">{t('subtitle')}</p>
        </Reveal>
        <Stagger className="mt-14 grid gap-6 md:grid-cols-3" stagger={0.12} delay={0.3}>
          {PREVIEWS.map((p) => (
            <StaggerItem key={p.key}>
              <Link href={p.href} className="group block rounded-[2rem] border border-brand/10 bg-white p-3 shadow-xl shadow-brand/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand/15">
                <div className={cn('relative aspect-[4/3] overflow-hidden rounded-[1.5rem] p-4', p.bg)}>
                  <div className={cn('h-3 w-full rounded-full', p.bar)} />
                  <motion.div className="mt-6 space-y-2" initial={{ opacity: 0.6 }} whileHover={{ opacity: 1 }}>
                    <div className={cn('h-4 w-3/4 rounded-full', p.text)} />
                    <div className={cn('h-4 w-1/2 rounded-full', p.text)} />
                    <div className={cn('mt-4 h-6 w-24 rounded-full', p.accent)} />
                  </motion.div>
                  <div className="mt-6 grid grid-cols-3 gap-2">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className={cn('h-14 rounded-xl transition-transform duration-500 group-hover:-translate-y-1', i === 1 ? 'bg-brand' : p.block, i === 1 && 'delay-75', i === 2 && 'delay-150')} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between p-4">
                  <div>
                    <h2 className="text-lg font-bold text-ink">{t(`${p.key}.name`)}</h2>
                    <p className="text-sm text-ink/55">{t(`${p.key}.desc`)}</p>
                  </div>
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-50 text-brand transition-all group-hover:rotate-45 group-hover:bg-brand group-hover:text-white">
                    <ArrowUpRight className="size-5" />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </main>
  );
}
