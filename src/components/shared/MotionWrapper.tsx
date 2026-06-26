"use client";

import { motion, type Variants } from "framer-motion";
import { resolveMotionVariants, getTransition } from "@/lib/animations";
import { useMotionPreferences } from "@/hooks/useMotionPreferences";

type Props = {
  children: React.ReactNode;
  variants: Variants;
  variants: import('framer-motion').Variants;
  className?: string;
};

export function MotionWrapper({ children, variants, className }: Props) {
  const { prefersReducedMotion } = useMotionPreferences();

  const resolvedVariants = resolveMotionVariants(
    variants,
    prefersReducedMotion
  );

  return (
    <motion.div
      className={className}
      variants={resolvedVariants}
      initial="hidden"
      animate="visible"
      transition={getTransition(prefersReducedMotion)}
    >
      {children}
    </motion.div>
  );
}