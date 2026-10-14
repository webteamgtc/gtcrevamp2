'use client';
import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * DEMO PRICE FEED — indicative prices that move randomly.
 * Replace `useTicker` with your real quotes feed (WebSocket / REST) before launch.
 */
export const TICKER_GROUPS = [
  [
    { s: 'XAUUSD', n: 'Gold', p: 4158.99, d: 2 },
    { s: 'XAGUSD', n: 'Silver', p: 48.62, d: 3 },
    { s: 'XPTUSD', n: 'Platinum', p: 1582.4, d: 2 },
    { s: 'XPDUSD', n: 'Palladium', p: 1321.7, d: 2 }
  ],
  [
    { s: 'UKOIL', n: 'Brent Crude', p: 101.24, d: 2 },
    { s: 'USOIL', n: 'WTI Crude', p: 89.84, d: 2 },
    { s: 'NGAS', n: 'Natural Gas', p: 3.124, d: 3 },
    { s: 'GASOIL', n: 'Gasoil', p: 812.5, d: 1 }
  ],
  [
    { s: 'EURGBP', n: 'Euro / Pound', p: 0.86712, d: 5 },
    { s: 'EURJPY', n: 'Euro / Yen', p: 176.421, d: 3 },
    { s: 'GBPJPY', n: 'Pound / Yen', p: 203.512, d: 3 },
    { s: 'AUDNZD', n: 'Aussie / Kiwi', p: 1.09412, d: 5 }
  ],
  [
    { s: 'AAPL', n: 'Apple', p: 248.31, d: 2 },
    { s: 'NVDA', n: 'NVIDIA', p: 186.44, d: 2 },
    { s: 'TSLA', n: 'Tesla', p: 412.7, d: 2 },
    { s: 'AMZN', n: 'Amazon', p: 231.12, d: 2 }
  ],
  [
    { s: 'US30', n: 'Dow Jones', p: 46820.5, d: 1 },
    { s: 'NAS100', n: 'Nasdaq 100', p: 24980.2, d: 1 },
    { s: 'SPX500', n: 'S&P 500', p: 6720.4, d: 1 },
    { s: 'GER40', n: 'DAX 40', p: 24310.8, d: 1 }
  ],
  // extra groups (not shown as ticker tabs): crypto, soft commodities
  [
    { s: 'BTCUSD', n: 'Bitcoin', p: 112480.5, d: 1 },
    { s: 'ETHUSD', n: 'Ethereum', p: 4152.3, d: 1 },
    { s: 'SOLUSD', n: 'Solana', p: 212.84, d: 2 },
    { s: 'XRPUSD', n: 'Ripple', p: 2.914, d: 3 }
  ],
  [
    { s: 'COFFEE', n: 'Coffee', p: 382.4, d: 1 },
    { s: 'COCOA', n: 'Cocoa', p: 7420.0, d: 1 },
    { s: 'SUGAR', n: 'Sugar', p: 16.84, d: 2 },
    { s: 'WHEAT', n: 'Wheat', p: 521.6, d: 1 }
  ],
  // 7: menu "Recommendations"
  [
    { s: 'EURUSD', n: 'Euro / Dollar', p: 1.16035, d: 5 },
    { s: 'GBPUSD', n: 'Pound / Dollar', p: 1.34218, d: 5 },
    { s: 'USDJPY', n: 'Dollar / Yen', p: 151.842, d: 3 },
    { s: 'USDCHF', n: 'Dollar / Franc', p: 0.80412, d: 5 },
    { s: 'XAUUSD', n: 'Gold', p: 4158.99, d: 2 }
  ],
  // 8: menu "Popular indices"
  [
    { s: 'US30', n: 'Wall Street', p: 46820.5, d: 1 },
    { s: 'SPX500', n: 'US SP 500', p: 6720.4, d: 1 },
    { s: 'NAS100', n: 'US Tech 100', p: 24980.2, d: 1 }
  ]
];
export const TAB_GROUPS = 5;

function seedHistory(p) {
  const h = [];
  let v = p;
  for (let i = 0; i < 24; i++) {
    v = v * (1 + Math.sin(i * 1.7 + p) * 0.0009);
    h.push(v);
  }
  return h;
}

export function useTicker(groupIndex = 0, interval = 1400) {
  const base = TICKER_GROUPS[groupIndex] ?? TICKER_GROUPS[0];
  const initial = useMemo(
    () => base.map((x) => ({ ...x, bid: x.p, ask: x.p * 1.00024, dir: 1, change: 0.12, hist: seedHistory(x.p), tick: 0 })),
    [base]
  );
  const [rows, setRows] = useState(initial);

  useEffect(() => {
    setRows(initial);
    const id = setInterval(() => {
      setRows((prev) =>
        prev.map((r) => {
          if (Math.random() < 0.35) return r;
          const move = (Math.random() - 0.48) * 0.0012;
          const bid = r.bid * (1 + move);
          return {
            ...r,
            bid,
            ask: bid * (1 + 0.00012 + Math.random() * 0.0002),
            dir: move >= 0 ? 1 : -1,
            change: ((bid - r.p) / r.p) * 100 + 0.12,
            hist: [...r.hist.slice(1), bid],
            tick: r.tick + 1
          };
        })
      );
    }, interval);
    return () => clearInterval(id);
  }, [initial, interval]);

  return rows;
}

export const fmt = (v, d) => Number(v).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

export function Sparkline({ data, up, className, width = 90, height = 30 }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const pts = data.map((v, i) => [(i / (data.length - 1)) * width, height - ((v - min) / (max - min || 1)) * (height - 4) - 2]);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const color = up ? '#16a34a' : '#dc2626';
  const id = `sg-${up ? 'u' : 'd'}`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} width={width} height={height} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L${width},${height} L0,${height} Z`} fill={`url(#${id})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

/** Price that flashes green/red when it changes */
export function FlashPrice({ value, decimals, dir, tick, className }) {
  return (
    <span className={cn('relative inline-flex tabular-nums', className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={tick}
          initial={{ y: dir > 0 ? 10 : -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: dir > 0 ? -10 : 10, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className={cn(tick > 0 && (dir > 0 ? 'text-up' : 'text-down'))}
        >
          {fmt(value, decimals)}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function SymbolBadge({ symbol, className }) {
  return (
    <span
      className={cn(
        'grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-50 to-brand-100 text-xs font-bold text-brand',
        className
      )}
    >
      {symbol.slice(0, 2)}
    </span>
  );
}

export function UpDown({ dir, className }) {
  return (
    <motion.span animate={{ rotate: dir > 0 ? 0 : 180 }} className={cn('inline-flex', dir > 0 ? 'text-up' : 'text-down', className)}>
      <ArrowUp className="size-3.5" strokeWidth={2.5} />
    </motion.span>
  );
}
