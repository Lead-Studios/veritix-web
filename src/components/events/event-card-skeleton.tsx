import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Loading placeholder for `EventCard`.
 *
 * Every block below copies the real card's geometry — same aspect ratio, same
 * `CardHeader`/`CardContent` padding, same number of text lines — so nothing
 * shifts when the data arrives. Keep the two in sync: if the card's padding or
 * aspect ratio changes, this has to change with it.
 */
export function EventCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      <div className="aspect-[16/9] w-full">
        <Skeleton className="h-full w-full rounded-none" />
      </div>

      <CardHeader className="p-5 pb-0">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
      </CardHeader>

      <CardContent className="mt-auto flex flex-col gap-1 p-5 pt-3">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/4" />
      </CardContent>
    </Card>
  );
}

/** Grid of placeholders, sized to the same columns as the listing. */
export function EventCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: count }, (_value, index) => (
        <EventCardSkeleton key={index} />
      ))}
    </div>
  );
}
