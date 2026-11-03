'use client';
import { MotionConfig } from 'motion/react';
import IntroLoader from './shared/intro/IntroLoader';
import GeoGate from './shared/geo/GeoGate';
import UkGate from './shared/geo/UkGate';

export default function Providers({ children }) {
  return (
    <MotionConfig reducedMotion="user">
      <IntroLoader />
      {/* UK visitors: live account links / forms open the UK notice instead */}
      <UkGate>{children}</UkGate>
      <GeoGate />
    </MotionConfig>
  );
}
