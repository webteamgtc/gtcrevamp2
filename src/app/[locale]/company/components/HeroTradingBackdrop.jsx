'use client';
/**
 * Light trading animation behind the Company hero:
 * soft candlesticks grow in, a glowing gold price line draws across them,
 * a light beam sweeps the chart and the latest price pulses.
 * Purely decorative (aria-hidden), no image requests, deterministic so SSR matches.
 */
import { useMemo } from 'react';
import { motion } from 'motion/react';
import { EASE } from '@/components/motion';

const W = 1440;
const H = 420;

function buildCandles(n = 44, seed = 21) {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const out = [];
  let price = 0.55; // 0..1 (share of chart height, 1 = top)
  for (let i = 0; i < n; i++) {
    const drift = 0.006 + Math.sin(i / 6) * 0.004; // gentle uptrend with waves
    const open = price;
    const close = Math.min(0.92, Math.max(0.12, open + drift + (rnd() - 0.5) * 0.07));
    const high = Math.max(open, close) + rnd() * 0.04;
    const low = Math.min(open, close) - rnd() * 0.04;
    out.push({ open, close, high, low });
    price = close;
  }
  return out;
}

export default function HeroTradingBackdrop() {
  const candles = useMemo(() => buildCandles(), []);
  const step = W / candles.length;
  const bodyW = step * 0.42;
  const y = (v) => H - v * H * 0.78 - 20; // map 0..1 to svg y (leave room at the bottom)

  const line = candles.map((c, i) => `${i === 0 ? 'M' : 'L'}${(i + 0.5) * step} ${y(c.close)}`).join(' ');
  const area = `${line} L${W} ${H} L0 ${H} Z`;
  const last = candles[candles.length - 1];
  const lastX = (candles.length - 0.5) * step;
  const lastY = y(last.close);

  return (
    <div dir="ltr" className="pointer-events-none absolute inset-x-0 bottom-0 h-[300px] md:h-[400px]" aria-hidden>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" className="size-full">
        <defs>
          <linearGradient id="hero-line" x1="0" x2="1">
            <stop offset="0" stopColor="#f1e3d3" stopOpacity="0.15" />
            <stop offset="0.55" stopColor="#d2a67a" stopOpacity="0.9" />
            <stop offset="1" stopColor="#f1e3d3" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="hero-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d2a67a" stopOpacity="0.16" />
            <stop offset="1" stopColor="#d2a67a" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hero-beam" x1="0" x2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.09" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <filter id="hero-glow" x="-10%" y="-50%" width="120%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* price levels */}
        {[0.25, 0.45, 0.65, 0.85].map((v) => (
          <line key={v} x1="0" x2={W} y1={y(v)} y2={y(v)} stroke="rgba(255,255,255,0.06)" strokeDasharray="4 8" />
        ))}

        {/* candles */}
        {candles.map((c, i) => {
          const up = c.close >= c.open;
          const cx = (i + 0.5) * step;
          const top = y(Math.max(c.open, c.close));
          const bottom = y(Math.min(c.open, c.close));
          const color = up ? 'rgba(241,227,211,0.42)' : 'rgba(131,144,212,0.38)';
          return (
            <motion.g key={i} style={{ transformOrigin: `${cx}px ${H}px` }} initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} transition={{ duration: 0.7, delay: 0.2 + i * 0.03, ease: EASE }}>
              <line x1={cx} x2={cx} y1={y(c.high)} y2={y(c.low)} stroke={color} strokeWidth="1.2" />
              <rect x={cx - bodyW / 2} y={top} width={bodyW} height={Math.max(2, bottom - top)} rx="1.5" fill={color} />
            </motion.g>
          );
        })}

        {/* area + glowing price line */}
        <motion.path d={area} fill="url(#hero-area)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 1.2 }} />
        <motion.path d={line} fill="none" stroke="#d2a67a" strokeWidth="6" strokeOpacity="0.35" filter="url(#hero-glow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 2.6, ease: 'easeInOut' }} />
        <motion.path d={line} fill="none" stroke="url(#hero-line)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 2.6, ease: 'easeInOut' }} />

        {/* latest price */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.1, duration: 0.6 }}>
          <line x1="0" x2={W} y1={lastY} y2={lastY} stroke="rgba(210,166,122,0.35)" strokeDasharray="2 6" />
          <motion.circle cx={lastX} cy={lastY} r="16" fill="#d2a67a" animate={{ r: [6, 22], opacity: [0.5, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }} />
          <circle cx={lastX} cy={lastY} r="5" fill="#f1e3d3" />
        </motion.g>

        {/* light beam sweeping across */}
        <motion.rect y="0" width="260" height={H} fill="url(#hero-beam)" initial={{ x: -300 }} animate={{ x: W + 40 }} transition={{ duration: 6, delay: 3.4, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }} />
      </svg>
    </div>
  );
}
