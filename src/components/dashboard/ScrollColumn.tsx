import { ReactNode } from 'react';
import { THEME_COLORS } from '@/lib/themeColors';

interface ScrollColumnProps {
  animationClass: string;
  children: ReactNode;
  className?: string;
}

export const ScrollColumn = ({
  animationClass,
  children,
  className = '',
}: ScrollColumnProps) => (
  <div className="relative h-full overflow-hidden rounded-lg">
    <div
      className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b"
      style={{
        backgroundImage: `linear-gradient(to bottom, ${THEME_COLORS.surfaceDark}, transparent, ${THEME_COLORS.surfaceDark})`,
      }}
    />
    <div
      className={`${animationClass} motion-reduce:animate-none flex flex-col ${className}`}
    >
      {children}
    </div>
  </div>
);
