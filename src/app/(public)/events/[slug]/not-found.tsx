import Link from 'next/link';
import { CalendarX } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/feedback/empty-state';
import { routes } from '@/lib/routes';

/**
 * Shown when a slug does not resolve to an event.
 *
 * `page.tsx` calls `notFound()` on a 404 from the API, which lands here instead
 * of the app-wide 404 — the buyer gets an explanation and a route back to the
 * listing rather than a dead end.
 */
export default function EventNotFound() {
  return (
    <Container className="py-20 sm:py-28">
      <EmptyState
        icon={<CalendarX className="size-8" aria-hidden="true" />}
        title="We could not find that event"
        description="The link may be out of date, or the organizer may have taken the event down. Browse the listing to see what is on."
        action={
          <Button asChild>
            <Link href={routes.events}>Browse events</Link>
          </Button>
        }
      />
    </Container>
  );
}
