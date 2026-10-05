'use client';
/** 3D rotating ring of live instrument cards (Draft 3 hero). */
import { useEffect, useState } from 'react';
import { motion, useAnimationFrame, useMotionValue, useTransform } from 'motion/react';
import { cn } from '@/lib/utils';
import { useTicker, FlashPrice, Sparkline } from './ticker';

function useRingRows() {
  const a = useTicker(0, 1500);
  const b = useTicker(1, 1600);
  const c = useTicker(2, 1700);
  const d = useTicker(4, 1800);
  const e = useTicker(3, 1900);
  return [a[0], c[0], b[0], d[1], e[0], a[1], c[2], b[1], d[0], e[1], a[2], c[1]];
}

export default function InstrumentRing({ className, radius = 470, speed = 0.012 }) {
  const rows = useRingRows();
  const n = rows.length;
  const rot = useMotionValue(0);
  const [r, setR] = useState(radius);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const fit = () => setR(window.innerWidth < 640 ? 330 : window.innerWidth < 1024 ? 420 : radius);
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [radius]);

  useAnimationFrame((_, delta) => {
    if (!paused) rot.set(rot.get() + delta * speed);
  });
  const transform = useTransform(rot, (v) => `translateZ(${-r}px) rotateY(${-v}deg)`);

  return (
    <div
      dir="ltr"
      className={cn('relative mx-auto h-[260px] w-full [perspective:1600px] md:h-[300px]', className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0 [transform:rotateX(-8deg)] [transform-style:preserve-3d]">
        <motion.div className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]" style={{ transform }}>
          {rows.map((row, i) => (
            <RingCard key={row.s} row={row} angle={(360 / n) * i} r={r} rot={rot} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function RingCard({ row, angle, r, rot }) {
  // fade cards as they travel to the back of the ring
  const opacity = useTransform(rot, (v) => {
    const a = (((angle - v) % 360) + 360) % 360;
    const front = Math.cos((a * Math.PI) / 180);
    return 0.25 + Math.max(0, front) * 0.75;
  });
  return (
    <motion.div
      className="absolute -left-[105px] -top-[70px] w-[210px] rounded-2xl border border-white/20 bg-white/[0.12] p-4 text-white shadow-2xl shadow-black/30 backdrop-blur-md [backface-visibility:hidden]"
      style={{ transform: `rotateY(${angle}deg) translateZ(${r}px)`, opacity }}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-bold">{row.s}</div>
          <div className="text-[11px] text-white/50">{row.n}</div>
        </div>
        <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold', row.change >= 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300')}>
          {row.change >= 0 ? '+' : ''}
          {row.change.toFixed(2)}%
        </span>
      </div>
      <div className="mt-2 text-xl font-bold">
        <FlashPrice value={row.bid} decimals={row.d} dir={row.dir} tick={row.tick} />
      </div>
      <Sparkline data={row.hist} up={row.dir > 0} width={178} height={30} className="mt-2" />
    </motion.div>
  );
}
