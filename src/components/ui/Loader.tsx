"use client";

import { motion } from "framer-motion";

type LoaderSize = "sm" | "md" | "lg";
type LoaderVariant = "spinner" | "dots" | "pulse";

interface LoaderProps {
  size?: LoaderSize;
  variant?: LoaderVariant;
  label?: string;
  fullPage?: boolean;
}

const sizeMap: Record<LoaderSize, number> = { sm: 16, md: 32, lg: 48 };

function Spinner({ size }: { size: number }) {
  return (
    <div
      className="rounded-full border-2 border-white/20 border-t-transparent animate-spin"
      style={{
        width: size,
        height: size,
        borderTopColor: "#7c85ff",
        borderRightColor: "#21d4ff",
      }}
    />
  );
}

function Dots({ size }: { size: number }) {
  const dot = size / 4;
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="rounded-full bg-gradient-to-br from-[#4d21ff] to-[#21d4ff]"
          style={{ width: dot, height: dot }}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -dot / 1.5, 0] }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function Pulse({ size }: { size: number }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <motion.div
        className="absolute rounded-full bg-gradient-to-br from-[#4d21ff]/30 to-[#21d4ff]/30"
        style={{ width: size, height: size }}
        animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
      />
      <div
        className="rounded-full bg-gradient-to-br from-[#4d21ff] to-[#21d4ff]"
        style={{ width: size / 2.5, height: size / 2.5 }}
      />
    </div>
  );
}

export function Loader({
  size = "md",
  variant = "spinner",
  label,
  fullPage = false,
}: LoaderProps) {
  const px = sizeMap[size];

  const inner = (
    <div className="flex flex-col items-center gap-3">
      {variant === "spinner" && <Spinner size={px} />}
      {variant === "dots" && <Dots size={px} />}
      {variant === "pulse" && <Pulse size={px} />}
      {label && <p className="text-sm text-white/60">{label}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1025]/90 backdrop-blur-sm">
        {inner}
      </div>
    );
  }

  return inner;
}