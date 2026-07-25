import React from "react";

interface LoadingSpinnerProps {
  /** Accessible label for screen readers */
  label?: string;
  /** Visual size of the spinner */
  size?: "sm" | "md" | "lg";
  /** Optionally render as inline (span) instead of block (div) */
  inline?: boolean;
  /** Extra class names */
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-4",
};

/**
 * Accessible loading spinner that announces loading state to screen readers.
 * Uses role="status" and aria-label so assistive technologies read the label
 * without requiring sighted-only animation cues.
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = "Loading…",
  size = "md",
  inline = false,
  className = "",
}) => {
  const Tag = inline ? "span" : "div";

  return (
    <Tag
      role="status"
      aria-label={label}
      aria-live="polite"
      className={`flex items-center justify-center ${className}`}
    >
      <span
        aria-hidden="true"
        className={`inline-block animate-spin rounded-full border-solid border-current border-r-transparent ${sizeClasses[size]}`}
      />
      {/* Visible fallback text for environments where CSS animation is disabled */}
      <span className="sr-only">{label}</span>
    </Tag>
  );
};

export default LoadingSpinner;