"use client";

import { motion } from "framer-motion";
import { resolveMotionVariants, getTransition } from "@/lib/animations";
import { useMotionPreferences } from "@/hooks/useMotionPreferences";

type Props = {
  children: React.ReactNode;
  variants: any;
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