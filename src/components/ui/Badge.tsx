import type { ReactNode } from "react";

type BadgeVariant = "primary" | "outline" | "subtle" | "success" | "danger";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary:
    "bg-gradient-to-r from-[#4d21ff] to-[#21d4ff] text-white",
  outline:
    "border border-[#3a3c77] text-[#7c85ff] bg-transparent",
  subtle:
    "bg-white/10 text-white/80",
  success:
    "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  danger:
    "bg-red-500/20 text-red-400 border border-red-500/30",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-2.5 py-0.5 text-[10px]",
  md: "px-3 py-1 text-xs",
};

export function Badge({
  children,
  variant = "primary",
  size = "md",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg font-semibold ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
}