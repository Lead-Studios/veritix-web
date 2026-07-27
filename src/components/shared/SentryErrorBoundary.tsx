"use client";

import * as Sentry from "@sentry/nextjs";
import React from "react";
import { RouteErrorState } from "@/components/ui/RouteErrorState";

type Props = {
  children: React.ReactNode;
  title?: string;
  description?: string;
};

type State = {
  hasError: boolean;
  error?: Error;
};

export class SentryErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: info.componentStack,
        },
      },
    });
  }

  reset = (): void => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <RouteErrorState
          title={this.props.title ?? "This section is unavailable right now."}
          description={this.props.description ?? "We hit an unexpected error. Please try again in a moment."}
          onRetry={this.reset}
        />
      );
    }

    return this.props.children;
  }
}
