import * as React from 'react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  /** Primary recovery action, e.g. "Browse events". */
  action?: React.ReactNode;
  /**
   * Element used for the title. It was a `<p>`, so a page rendered entirely as
   * an empty state ("You have no tickets yet") exposed no heading at all.
   */
  titleAs?: 'h1' | 'h2' | 'h3';
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  titleAs: Title = 'h2',
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border px-6 py-12 text-center',
        className,
      )}
      {...props}
    >
      {icon && <div className="text-muted-foreground">{icon}</div>}
      <div className="space-y-1">
        <Title className="text-sm font-medium text-foreground">{title}</Title>
        {description && (
          <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
