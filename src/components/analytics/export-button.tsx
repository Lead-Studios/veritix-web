'use client';

import * as React from 'react';
import { toast } from 'react-toastify';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportRowsToCSV, toFileSlug } from '@/lib/csv';
import { formatDate } from '@/lib/format';
import type { AnalyticsRange, CheckInRateRow, SalesPoint } from '@/lib/analytics';

/** What the export contains: the daily series and the per-event check-in rates. */
export interface AnalyticsExportData {
  range: AnalyticsRange;
  salesOverTime: SalesPoint[];
  checkInRates: CheckInRateRow[];
  currency?: string;
  /** Event title, used in the filename. Falls back to a whole-account export. */
  eventTitle?: string;
}

export interface ExportButtonProps extends AnalyticsExportData {
  className?: string;
  disabled?: boolean;
}

/** `lagos-sound-festival`, or `all_events` when the view spans every event. */
function scopeSlug(eventTitle: string | undefined): string {
  return eventTitle ? toFileSlug(eventTitle) : 'all_events';
}

/** `lagos-sound-festival_2026-08-27_to_2026-09-25_analytics.csv` */
export function analyticsExportFilename(data: AnalyticsExportData): string {
  const { from, to } = data.range;
  return `${scopeSlug(data.eventTitle)}_${from}_to_${to}_analytics.csv`;
}

/**
 * Download the analytics view currently on screen.
 *
 * The export is deliberately the view and not the whole account: it carries the
 * active date range and the event filter, and the filename repeats the range so
 * a folder of last quarter's exports stays readable. Rows go through the shared
 * CSV helper, which is what handles the quoting.
 */
export function ExportButton({
  range,
  salesOverTime,
  checkInRates,
  currency = 'USD',
  eventTitle,
  className,
  disabled = false,
}: ExportButtonProps) {
  const [exporting, setExporting] = React.useState(false);

  const isEmpty = salesOverTime.length === 0 && checkInRates.length === 0;

  const handleExport = () => {
    if (isEmpty) {
      toast.error('There is nothing to export for this range');
      return;
    }

    setExporting(true);
    try {
      // One file, two tables: the daily series first, then the per-event rates,
      // separated by a blank line so a spreadsheet reads it as two blocks.
      const rows: string[][] = [
        ['Date', 'Tickets sold', `Gross revenue (${currency})`],
        ...salesOverTime.map((point) => [
          point.date,
          String(point.ticketsSold),
          (point.grossMinor / 100).toFixed(2),
        ]),
        [''],
        ['Event', 'Event date', 'Tickets sold', 'Checked in', 'Check-in rate'],
        ...checkInRates.map((row) => [
          row.title,
          formatDate(row.startsAt),
          String(row.ticketsSold),
          String(row.checkedIn),
          // Kept as a plain percentage: this file is for a bookkeeper, not a chart.
          row.rate === null ? 'n/a' : `${(row.rate * 100).toFixed(1)}%`,
        ]),
      ];

      exportRowsToCSV(
        ['Veritix analytics export', `${range.from} to ${range.to}`],
        rows,
        analyticsExportFilename({ range, salesOverTime, checkInRates, currency, eventTitle }),
      );

      toast.success('Analytics exported');
    } catch {
      toast.error('Could not export the analytics — try again');
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={disabled || exporting}
      className={className}
    >
      <Download aria-hidden="true" />
      {exporting ? 'Exporting…' : 'Export CSV'}
    </Button>
  );
}
