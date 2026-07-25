"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Optional custom fallback UI. Receives the error and a reset callback. */
  fallback?: (error: Error, reset: () => void) => ReactNode;
  /** Callback fired when an error is caught — useful for logging. */
  onError?: (error: Error, info: ErrorInfo) => void;
  /** Chart name shown in the default fallback UI. */
  chartName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary for chart components. Prevents a rendering error in one
 * chart from crashing the entire dashboard. Provides a visual fallback with
 * an optional retry button.
 *
 * Usage:
 * ```tsx
 * <ChartErrorBoundary chartName="Revenue Overview">
 *   <RevenueChart />
 * </ChartErrorBoundary>
 * ```
 */
export class ChartErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
    this.reset = this.reset.bind(this);
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
  }

  reset() {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset);
      }

      return (
        <div
          role="alert"
          className="flex flex-col items-center justify-center gap-3 rounded-lg border border-red-200 bg-red-50 p-6 text-center"
        >
          <svg
            aria-hidden="true"
            className="h-8 w-8 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <p className="text-sm font-medium text-red-700">
            {this.props.chartName
              ? `Could not load "${this.props.chartName}"`
              : "Chart failed to load"}
          </p>
          <p className="text-xs text-red-500">{this.state.error.message}</p>
          <button
            onClick={this.reset}
            className="rounded-md bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ChartErrorBoundary;