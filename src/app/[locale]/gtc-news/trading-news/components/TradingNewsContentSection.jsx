'use client';

import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/motion';
import { cn } from '@/lib/utils';

const COLUMN_KEYS = ['tradingSymbol', 'expiringSymbol', 'newContract', 'newSessionFrom', 'closeOnlyTime', 'expiryTime'];

export default function TradingNewsContentSection() {
  const t = useTranslations('tradingNewsPage.article');
  const columns = t.raw('table.columns');
  const rows = t.raw('table.rows');

  return (
    <section className="relative bg-white py-14 md:py-20">
      <div className="bg-grid-light mask-radial absolute inset-0 opacity-40" aria-hidden />
      <div className="container-x relative max-w-6xl">
        <Reveal y={20}>
          <h2 className="heading-section max-w-4xl text-balance">{t('title')}</h2>
          <p className="mt-4 text-base font-medium text-ink/80">{t('subtitle')}</p>
        </Reveal>

        <Reveal y={24} delay={0.08} className="mt-10">
          <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-2xl shadow-brand/10 ring-1 ring-brand/10">
            <div className="no-scrollbar overflow-x-auto">
              <table className="w-full min-w-[880px] border-collapse text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-brand-800 via-brand to-brand-700 text-white">
                    {COLUMN_KEYS.map((key) => (
                      <th
                        key={key}
                        className="px-4 py-4 text-start text-[11px] font-bold uppercase leading-snug tracking-[0.08em] text-white/85 md:px-5 md:text-xs"
                      >
                        {columns[key]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i} className="border-t border-brand/[0.08] bg-white transition-colors hover:bg-brand-50/40">
                      {COLUMN_KEYS.map((key) => (
                        <td
                          key={key}
                          className={cn(
                            'px-4 py-4 align-top text-[13px] leading-relaxed text-ink/80 md:px-5 md:py-5',
                            key === 'tradingSymbol' && 'font-semibold text-ink',
                            ['newSessionFrom', 'closeOnlyTime', 'expiryTime'].includes(key) && 'whitespace-nowrap tabular-nums'
                          )}
                          dir={['newSessionFrom', 'closeOnlyTime', 'expiryTime'].includes(key) ? 'ltr' : undefined}
                        >
                          {row[key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        <Reveal y={16} delay={0.12} className="mt-8">
          <div className="rounded-2xl border border-brand/10 bg-[#f6f8fc] px-5 py-5 md:px-7 md:py-6">
            <p className="text-[15px] leading-relaxed text-ink/70">{t('note')}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
