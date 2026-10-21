'use client';
/**
 * Closing navy band of the GTC News pages — swap-free activation, centred: title, two info points,
 * live chat / e-mail channel cards and a wide "Contact Support Now" button.
 */
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { ArrowRight, CircleHelp, Hand, Mail, MessagesSquare } from 'lucide-react';
import BandLine from '@/components/shared/BandLine';
import NavLink from '@/components/shared/nav/NavLink';
import { AccentTitle } from '@/components/shared/SectionIntro';
import { Reveal, Stagger, StaggerItem } from '@/components/motion';
import { CONTACT } from '@/config/events';

const INFO = [
  { key: 'hand', Icon: Hand },
  { key: 'question', Icon: CircleHelp }
];
const CHANNELS = [
  { Icon: MessagesSquare, href: '/company/contact-us', live: true },
  { Icon: Mail, href: `mailto:${CONTACT.email}` }
];

export default function ActivationBand() {
  const t = useTranslations('gtcNewsPage.activation');
  const channels = t.raw('channels');
  return (
    <section className="is-dark relative overflow-hidden bg-gradient-to-b from-brand-800 via-brand-900 to-brand-950 py-16 text-white md:py-24">
      <div className="bg-grid-dark mask-radial absolute inset-0 opacity-60" aria-hidden />
      <motion.span className="absolute -end-24 -top-24 size-96 rounded-full bg-gold/20 blur-[110px]" animate={{ opacity: [0.5, 0.9, 0.5] }} transition={{ duration: 6, repeat: Infinity }} aria-hidden />
      <motion.span className="absolute -bottom-32 -start-24 size-96 rounded-full bg-brand-400/20 blur-[110px]" animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 7, repeat: Infinity }} aria-hidden />
      {[0, 1, 2].map((i) => (
        <motion.span key={i} className="absolute start-1/2 top-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]" animate={{ scale: [0.8, 1.6], opacity: [0.5, 0] }} transition={{ duration: 9, repeat: Infinity, delay: i * 3, ease: 'easeOut' }} aria-hidden />
      ))}
      <BandLine />

      <div className="container-x relative mx-auto max-w-4xl">
        <Reveal y={16} className="text-center">
          <h2 className="heading-section text-balance">
            <AccentTitle text={t('title')} accentClassName="text-gradient-gold" />
          </h2>
        </Reveal>

        <Stagger className="mt-10 grid gap-4 md:mt-12 md:grid-cols-2" stagger={0.1}>
          {INFO.map(({ key, Icon }) => (
            <StaggerItem key={key} className="flex gap-4 rounded-2xl bg-white/[0.05] p-5 ring-1 ring-white/10 backdrop-blur md:p-6">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold-200 ring-1 ring-gold/30">
                <Icon className="size-5" />
              </span>
              <span>
                <span className="block font-semibold">{t(`infoColumns.${key}.title`)}</span>
                <span className="mt-1.5 block text-sm leading-relaxed text-white/60">{t(`infoColumns.${key}.text`)}</span>
              </span>
            </StaggerItem>
          ))}
        </Stagger>

        <Stagger className="mt-4 grid gap-4 sm:grid-cols-2" stagger={0.12} delay={0.1}>
          {channels.map((c, i) => {
            const { Icon, href, live } = CHANNELS[i] ?? CHANNELS[0];
            const Link = href.startsWith('/') ? NavLink : 'a';
            return (
              <StaggerItem key={c.title}>
                <Link href={href} className="group flex flex-col items-center gap-3 rounded-[1.75rem] bg-white/[0.07] px-6 py-8 text-center ring-1 ring-white/10 backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.11] hover:ring-gold/40">
                  <span className="relative grid size-16 place-items-center rounded-2xl bg-gold text-white shadow-lg shadow-gold/30 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                    <Icon className="size-7" />
                    {live && (
                      <span className="absolute -end-1 -top-1 flex size-4">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-up opacity-70" />
                        <span className="relative inline-flex size-4 rounded-full bg-up ring-2 ring-brand-900" />
                      </span>
                    )}
                  </span>
                  <span className="mt-1 text-lg font-bold">{c.title}</span>
                  <span dir="auto" className="text-sm text-white/60">
                    {c.subtitle}
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>

        <Reveal y={12} delay={0.2} className="mt-8">
          <NavLink href="/company/contact-us" className="shine group flex h-14 w-full items-center justify-center gap-3 rounded-full bg-gold text-base font-bold text-white shadow-xl shadow-gold/30 transition-colors hover:bg-gold-600">
            {t('cta')}
            <span className="grid size-9 place-items-center rounded-full bg-white text-gold-700 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
              <ArrowRight className="size-4 rtl:-scale-x-100" />
            </span>
          </NavLink>
        </Reveal>
      </div>
    </section>
  );
}
