import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * Draft logo — cropped from the current site. Replace /public/images/gtc-logo.png
 * with the official SVG (and a white version for dark headers) before launch.
 */
export default function Logo({ className, onDark = false }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg transition-all',
        onDark && 'bg-white px-1.5 py-1 shadow-lg shadow-black/20',
        className
      )}
    >
      <Image src="/images/gtc-logo.png" alt="GTCFX" width={186} height={72} priority className="h-9 w-auto md:h-10" />
    </span>
  );
}
