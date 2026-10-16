import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/** Height the analytics charts render at, so the fallback reserves the same box. */
export const CHART_HEIGHT = 288;

export interface ChartSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: number;
  label?: string;
}

/**
 * Placeholder shown while a lazily-loaded chart bundle arrives.
 *
 * Always carries the chart's real height: a chart that pops in from a shorter
 * box scrolls the page under the reader's cursor, which is worse than the wait
 * it was meant to hide. Announced as a status so assistive tech hears the
 * chart is on its way rather than reporting an empty region.
 */
export function ChartSkeleton({
  height = CHART_HEIGHT,
  label = 'Loading chart',
  className,
  ...props
}: ChartSkeletonProps) {
  return (
    <div role="status" aria-live="polite" className={cn('w-full', className)} {...props}>
      <Skeleton className="h-full w-full" style={{ height }} />
      <span className="sr-only">{label}</span>
    </div>
  );
}
