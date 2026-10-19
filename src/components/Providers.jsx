'use client';
import { MotionConfig } from 'motion/react';
import { ScrollReveal } from '@/components/shared/ScrollReveal';

export default function Providers({ children }) {
  return (
    <MotionConfig reducedMotion="user">
      {children}
      <ScrollReveal />
    </MotionConfig>
  );
}
