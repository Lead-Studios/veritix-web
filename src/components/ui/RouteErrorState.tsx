'use client';

import { Button } from '@/components/button';

type RouteErrorStateProps = {
  title: string;
  description: string;
  onRetry?: () => void;
  retryLabel?: string;
};

export function RouteErrorState({
  title,
  description,
  onRetry,
  retryLabel = 'Try again',
}: RouteErrorStateProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white/80">
        Something went wrong
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        <p className="max-w-md text-sm text-slate-300">{description}</p>
      </div>
      {onRetry ? (
        <Button
          onClick={onRetry}
          className="bg-gradient-to-r from-[#4D21FF] to-[#21D4FF] text-white"
        >
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
