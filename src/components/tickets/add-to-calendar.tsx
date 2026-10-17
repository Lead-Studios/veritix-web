'use client';

import { CalendarPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { buildIcsFile, googleCalendarUrl } from '@/lib/calendar';
import type { VeritixEvent } from '@/types';

export function AddToCalendar({ event }: { event: VeritixEvent }) {
  const downloadIcs = () => {
    const file = new Blob([buildIcsFile(event)], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.slug || 'event'}.ics`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button type="button" variant="outline" onClick={downloadIcs}>
        <CalendarPlus className="size-4" aria-hidden="true" />
        Download .ics
      </Button>
      <a
        href={googleCalendarUrl(event)}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        Add to Google Calendar
      </a>
    </div>
  );
}
