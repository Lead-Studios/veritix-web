'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

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
    console.error(
      `[ChartErrorBoundary${this.props.chartName ? ` — ${this.props.chartName}` : ''}]`,
      error,
      info,
    );
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
          aria-live="polite"
          className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/5 p-8 text-center"
        >
          <AlertTriangle size={24} className="mb-3 text-yellow-400" aria-hidden="true" />
          <p className="text-sm font-medium text-gray-300">
            {this.props.chartName
              ? `"${this.props.chartName}" unavailable — refresh to retry`
              : 'Chart unavailable — refresh to retry'}
          </p>
          <button
            onClick={this.reset}
            className="mt-3 rounded-lg bg-[#4D21FF]/20 px-4 py-1.5 text-xs font-medium text-[#21D4FF] transition-colors hover:bg-[#4D21FF]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4D21FF]"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
