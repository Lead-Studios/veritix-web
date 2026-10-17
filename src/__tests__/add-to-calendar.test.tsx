import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AddToCalendar } from '@/components/tickets/add-to-calendar';
import { buildIcsFile, googleCalendarUrl } from '@/lib/calendar';
import type { VeritixEvent } from '@/types';

const event: VeritixEvent = {
  id: 'event-1',
  slug: 'summer-show',
  title: 'Summer Show',
  description: 'A live show',
  venue: 'Town Hall',
  city: 'London',
  startsAt: '2026-07-10T18:00:00.000Z',
  endsAt: '2026-07-10T21:00:00.000Z',
  status: 'published',
  organizer: { id: 'organizer-1', name: 'Organizer', verified: true },
  tiers: [],
};

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('AddToCalendar', () => {
  it('offers a downloadable .ics and a Google Calendar link', async () => {
    vi.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const createObjectURL = vi.fn(() => 'blob:calendar-file');
    const revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL });
    const anchorClick = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {});
    const append = vi.spyOn(document.body, 'append');

    render(<AddToCalendar event={event} />);

    const googleLink = screen.getByRole('link', { name: 'Add to Google Calendar' });
    expect(googleLink).toHaveAttribute('href', googleCalendarUrl(event));
    expect(googleLink).toHaveAttribute('target', '_blank');

    await user.click(screen.getByRole('button', { name: 'Download .ics' }));

    expect(createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(append).toHaveBeenCalled();
    const downloadLink = append.mock.calls[0][0] as HTMLAnchorElement;
    expect(downloadLink.download).toBe('summer-show.ics');
    expect(downloadLink.href).toBe('blob:calendar-file');
    expect(anchorClick).toHaveBeenCalled();
    expect(buildIcsFile(event)).toContain('SUMMARY:Summer Show');
    await vi.advanceTimersByTimeAsync(1000);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:calendar-file');
  });
});
