import { Variants, Transition, Easing } from "framer-motion";

export { fadeIn, fadeInUp } from "./motionVariants";

export function resolveMotionVariants(
  variants: Variants,
  prefersReducedMotion: boolean | null
): Variants {
  if (!prefersReducedMotion) return variants;
  return Object.fromEntries(
    Object.entries(variants).map(([key, value]) => [key, value])
  );
}

export function getTransition(prefersReducedMotion: boolean | null): Transition {
  return prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.4, ease: "easeOut" as Easing };
}
