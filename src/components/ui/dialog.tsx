"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { FocusTrap } from "./FocusTrap";
import { cn } from "../../lib/cn";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeClasses: Record<string, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

/**
 * Dialog — an accessible modal dialog following the ARIA dialog pattern.
 *
 * - Uses `role="dialog"` with `aria-modal="true"` (delegated to FocusTrap).
 * - Closes on Escape key and backdrop click.
 * - Locks body scroll while open.
 * - Traps focus inside the panel while open.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
}: DialogProps) {
  // Lock body scroll
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-[#0a0f24]/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <FocusTrap active={open}>
          <div
            className={cn(
              `relative w-full ${sizeClasses[size]}`,
              "rounded-3xl border border-white/10 bg-[#0b1025] p-6",
              "shadow-[0_40px_80px_rgba(10,16,40,0.7)]",
            )}
          >
            {/* Gradient top border accent */}
            <div
              className="absolute inset-x-0 top-0 h-[2px] rounded-t-3xl bg-gradient-to-r from-[#4d21ff] to-[#21d4ff]"
              aria-hidden
            />

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-1.5 text-white/60 transition hover:bg-white/20 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              aria-label="Close dialog"
            >
              <X size={16} />
            </button>

            {(title || description) && (
              <div className="mb-5 pr-6">
                {title && (
                  <h2 className="text-xl font-semibold text-white" id={`dialog-title`}>
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="mt-1 text-sm text-white/60">{description}</p>
                )}
              </div>
            )}

            {children}
          </div>
        </FocusTrap>
      </div>
    </>
  );
}
