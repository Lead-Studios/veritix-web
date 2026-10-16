import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SWRConfig } from 'swr';
import type { AnalyticsRange, CheckInRateReport, SalesPoint } from '@/lib/analytics';

/**
 * `swr` is wired the way `AppProviders` wires it — the tests supply the fetcher
 * the API route would have supplied — so the components are exercised through
 * the same path the app uses rather than through a mocked hook.
 */

const { toastMock, exportRowsToCSVMock } = vi.hoisted(() => ({
  toastMock: { success: vi.fn(), error: vi.fn() },
  exportRowsToCSVMock: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: toastMock,
  ToastContainer: () => null,
}));

// Partial mock: the filename slugging stays real, only the download is stubbed.
vi.mock('@/lib/csv', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/csv')>();
  return { ...actual, exportRowsToCSV: exportRowsToCSVMock };
});

const { CheckInRate } = await import('@/components/analytics/check-in-rate');
const { ExportButton, analyticsExportFilename } = await import('@/components/analytics/export-button');
const { ChartSkeleton, CHART_HEIGHT } = await import('@/components/analytics/chart-skeleton');
const { toFileSlug } = await import('@/lib/csv');

const RANGE: AnalyticsRange = { from: '2026-08-27', to: '2026-09-25' };

const REPORT: CheckInRateReport = {
  range: RANGE,
  eventId: null,
  events: [
    {
      eventId: 'evt_7',
      title: 'Lagos Jazz & Soul Night',
      startsAt: '2026-09-11T19:00:00.000Z',
      ticketsSold: 314,
      checkedIn: 195,
      rate: 195 / 314,
    },
    {
      eventId: 'evt_1',
      title: 'Lagos Sound Festival',
      startsAt: '2026-10-17T16:00:00.000Z',
      ticketsSold: 712,
      checkedIn: 0,
      rate: 0,
    },
  ],
  trend: [
    {
      eventId: 'evt_7',
      title: 'Lagos Jazz & Soul Night',
      startsAt: '2026-09-11T19:00:00.000Z',
      rate: 195 / 314,
    },
  ],
};

const POINTS: SalesPoint[] = [{ date: '2026-09-20', ticketsSold: 12, grossMinor: 99_000 }];

function renderWithFetcher(ui: React.ReactElement, report: CheckInRateReport | null) {
  return render(
    <SWRConfig
      value={{
        fetcher: async (key: string) =>
          key.startsWith('/analytics/check-in-rate') ? report : { range: RANGE },
        revalidateOnFocus: false,
        // A cache per render, or one test's payload is served to the next.
        provider: () => new Map(),
      }}
    >
      {ui}
    </SWRConfig>,
  );
}

beforeEach(() => {
  toastMock.success.mockClear();
  toastMock.error.mockClear();
  exportRowsToCSVMock.mockClear();
});

describe('analyticsExportFilename', () => {
  it('names the file after the event and the range', () => {
    expect(
      analyticsExportFilename({
        range: RANGE,
        salesOverTime: POINTS,
        checkInRates: [],
        eventTitle: 'Lagos Sound Festival',
      }),
    ).toBe('lagos_sound_festival_2026-08-27_to_2026-09-25_analytics.csv');
  });

  it('falls back to all_events when the view spans every event', () => {
    expect(analyticsExportFilename({ range: RANGE, salesOverTime: POINTS, checkInRates: [] })).toBe(
      'all_events_2026-08-27_to_2026-09-25_analytics.csv',
    );
  });

  it('strips characters a filesystem would object to', () => {
    expect(toFileSlug('Lagos: Jazz/Soul? Night')).toBe('lagos__jazz_soul__night');
  });
});

describe('ExportButton', () => {
  it('exports the view through the shared CSV helper, named for event and range', async () => {
    render(
      <ExportButton
        range={RANGE}
        salesOverTime={POINTS}
        checkInRates={REPORT.events}
        eventTitle="Lagos Sound Festival"
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: /export csv/i }));

    expect(exportRowsToCSVMock).toHaveBeenCalledOnce();
    const [headers, rows, filename] = exportRowsToCSVMock.mock.calls[0] as [string[], string[][], string];

    expect(filename).toBe('lagos_sound_festival_2026-08-27_to_2026-09-25_analytics.csv');
    expect(headers[1]).toBe('2026-08-27 to 2026-09-25');
    // Daily series first, then the per-event rates, as two blocks.
    expect(rows[0]).toEqual(['Date', 'Tickets sold', 'Gross revenue (USD)']);
    expect(rows[1]).toEqual(['2026-09-20', '12', '990.00']);
    expect(rows).toContainEqual(['Event', 'Event date', 'Tickets sold', 'Checked in', 'Check-in rate']);
    expect(rows).toContainEqual([
      'Lagos Jazz & Soul Night',
      'Sep 11, 2026',
      '314',
      '195',
      '62.1%',
    ]);
    expect(toastMock.success).toHaveBeenCalledWith('Analytics exported');
  });

  it('refuses to export an empty range and says so', async () => {
    render(<ExportButton range={RANGE} salesOverTime={[]} checkInRates={[]} />);

    await userEvent.click(screen.getByRole('button', { name: /export csv/i }));

    expect(exportRowsToCSVMock).not.toHaveBeenCalled();
    expect(toastMock.error).toHaveBeenCalledWith('There is nothing to export for this range');
  });
});

describe('CheckInRate', () => {
  it('shows checked-in against sold per event and names the range', async () => {
    renderWithFetcher(<CheckInRate />, REPORT);

    await waitFor(() => {
      expect(screen.getByText('Lagos Jazz & Soul Night')).toBeInTheDocument();
    });

    // The gap between sold and attended is the whole point of the metric.
    expect(screen.getByText('195 of 314 checked in · Sep 11, 2026')).toBeInTheDocument();
    expect(screen.getByText('62.1%')).toBeInTheDocument();
    // An event that has not run yet reports 0%, not a dash.
    expect(screen.getByText('0.0%')).toBeInTheDocument();
    expect(screen.getByText(/2026-08-27 to 2026-09-25/)).toBeInTheDocument();
  });

  it('labels each bar with the counts behind the percentage', async () => {
    renderWithFetcher(<CheckInRate />, REPORT);

    await waitFor(() => {
      expect(screen.getByText('Lagos Jazz & Soul Night')).toBeInTheDocument();
    });

    expect(
      screen.getByRole('img', { name: 'Lagos Jazz & Soul Night: 195 of 314 tickets checked in' }),
    ).toBeInTheDocument();
  });

  it('draws a trend once there is more than one event to compare', async () => {
    renderWithFetcher(
      <CheckInRate />,
      {
        ...REPORT,
        trend: [
          ...REPORT.trend,
          {
            eventId: 'evt_8',
            title: 'Accra Chill Fest',
            startsAt: '2026-08-29T14:00:00.000Z',
            rate: 0.88,
          },
        ],
      },
    );

    await waitFor(() => {
      expect(screen.getByText('Trend across past events')).toBeInTheDocument();
    });
    expect(screen.getByRole('img', { name: /check-in rate across 2 events/i })).toBeInTheDocument();
  });

  it('does not draw a one-bar "trend"', async () => {
    renderWithFetcher(<CheckInRate />, REPORT);

    await waitFor(() => {
      expect(screen.getByText('Lagos Jazz & Soul Night')).toBeInTheDocument();
    });

    // A single point is not a trend, and one bar would imply a comparison.
    expect(screen.queryByText('Trend across past events')).not.toBeInTheDocument();
  });

  it('says there is nothing to report when no event sold in the range', async () => {
    renderWithFetcher(<CheckInRate />, { range: RANGE, eventId: null, events: [], trend: [] });

    await waitFor(() => {
      expect(screen.getByText(/no events sold a ticket in this range/i)).toBeInTheDocument();
    });
  });

  it('offers the export only once a range is known', async () => {
    renderWithFetcher(<CheckInRate eventTitle="Lagos Sound Festival" />, REPORT);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /export csv/i })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: /export csv/i }));
    const filename = exportRowsToCSVMock.mock.calls[0][2] as string;
    expect(filename).toBe('lagos_sound_festival_2026-08-27_to_2026-09-25_analytics.csv');
  });
});

describe('ChartSkeleton', () => {
  it('reserves the chart height and announces the load', () => {
    render(<ChartSkeleton />);

    const status = screen.getByRole('status');
    expect(status).toBeInTheDocument();
    expect(screen.getByText('Loading chart')).toBeInTheDocument();

    // Correct dimensions, so nothing shifts when the bundle lands.
    const skeleton = status.firstElementChild as HTMLElement;
    expect(skeleton.style.height).toBe(`${CHART_HEIGHT}px`);
  });

  it('honours a caller-supplied height and label', () => {
    render(<ChartSkeleton height={120} label="Loading revenue" />);

    expect(screen.getByText('Loading revenue')).toBeInTheDocument();
    expect((screen.getByRole('status').firstElementChild as HTMLElement).style.height).toBe('120px');
  });
});
