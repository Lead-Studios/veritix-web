export * from './motionVariants';
import type { Variants } from 'framer-motion';

export function resolveMotionVariants(variants: Variants, prefersReducedMotion: boolean | null): Variants {
  if (!prefersReducedMotion) return variants;
  return { hidden: {}, visible: {} };
}

export function getTransition(prefersReducedMotion: boolean | null): { duration: number; ease?: [number, number, number, number] } {
  return prefersReducedMotion ? { duration: 0 } : { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] };
}
