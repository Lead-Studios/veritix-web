import * as React from 'react';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

export interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

export function LoadingState({ label = 'Loading', className, ...props }: LoadingStateProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-3 px-6 py-12 text-center', className)}
      {...props}
    >
      <Spinner className="size-6 text-muted-foreground" label={null} />
      <p className="text-sm text-muted-foreground" role="status">
        {label}
      </p>
    </div>
  );
}
