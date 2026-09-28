import { type ReactNode } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  X,
} from "lucide-react";
import { cn } from "../../lib/cn";

export type AlertVariant = "info" | "success" | "warning" | "destructive";

const variantConfig: Record<
  AlertVariant,
  {
    container: string;
    icon: string;
    Icon: React.ComponentType<{ size?: number; className?: string }>;
    defaultTitle: string;
  }
> = {
  info: {
    container:
      "border-blue-500/30 bg-blue-500/10 text-blue-300",
    icon: "text-blue-400",
    Icon: Info,
    defaultTitle: "Note",
  },
  success: {
    container:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    icon: "text-emerald-400",
    Icon: CheckCircle2,
    defaultTitle: "Success",
  },
  warning: {
    container:
      "border-amber-500/30 bg-amber-500/10 text-amber-300",
    icon: "text-amber-400",
    Icon: AlertTriangle,
    defaultTitle: "Warning",
  },
  destructive: {
    container:
      "border-red-500/30 bg-red-500/10 text-red-300",
    icon: "text-red-400",
    Icon: XCircle,
    defaultTitle: "Error",
  },
};

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  /** When true the element uses role="alert" (live region) for urgent announcements. */
  urgent?: boolean;
  onDismiss?: () => void;
  className?: string;
}

/**
 * Alert — inline contextual message with info / success / warning / destructive variants.
 *
 * Use `urgent` only for time-sensitive messages that need to interrupt the user;
 * non-urgent informational messages should omit it.
 */
export function Alert({
  variant = "info",
  title,
  children,
  urgent = false,
  onDismiss,
  className,
}: AlertProps) {
  const config = variantConfig[variant];
  const { Icon } = config;

  return (
    <div
      role={urgent ? "alert" : "region"}
      aria-label={title ?? config.defaultTitle}
      aria-live={urgent ? "assertive" : "polite"}
      className={cn(
        "relative flex gap-3 rounded-xl border p-4",
        config.container,
        className,
      )}
    >
      {/* Leading icon */}
      <Icon
        size={18}
        className={cn("mt-0.5 shrink-0", config.icon)}
        aria-hidden
      />

      {/* Body */}
      <div className="min-w-0 flex-1 text-sm">
        {title && (
          <p className="mb-1 font-semibold leading-snug">{title}</p>
        )}
        <div className="leading-relaxed opacity-90">{children}</div>
      </div>

      {/* Optional dismiss button */}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className={cn(
            "ml-auto shrink-0 rounded p-0.5 opacity-60 transition hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
            config.icon,
          )}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

/* ── Callout ─────────────────────────────────────────────────────────────── */

export interface CalloutProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Callout — heavier, more prominent version of Alert for editorial/tips usage.
 * Always non-urgent (no live region) — it is purely decorative / contextual.
 */
export function Callout({
  variant = "info",
  title,
  children,
  className,
}: CalloutProps) {
  const config = variantConfig[variant];
  const { Icon } = config;

  return (
    <aside
      aria-label={title ?? config.defaultTitle}
      className={cn(
        "relative overflow-hidden rounded-2xl border p-5",
        config.container,
        className,
      )}
    >
      {/* Gradient left accent bar */}
      <div
        className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#4d21ff] to-[#21d4ff]"
        aria-hidden
      />

      <div className="flex gap-3 pl-3">
        <Icon
          size={20}
          className={cn("mt-0.5 shrink-0", config.icon)}
          aria-hidden
        />
        <div className="min-w-0 text-sm">
          {title && (
            <p className="mb-1 font-semibold leading-snug">{title}</p>
          )}
          <div className="leading-relaxed opacity-90">{children}</div>
        </div>
      </div>
    </aside>
  );
}
