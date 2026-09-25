import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { exportAttendeesToCSV, exportRowsToCSV, toFileSlug } from '@/lib/csv';

/**
 * jsdom has no download plumbing and its `Blob` cannot be read back, so each
 * clicked anchor is captured and the blob's parts are recorded. The parts are
 * exactly what the browser would have written to disk, so their text is the file.
 */

const { createObjectURL, revokeObjectURL } = vi.hoisted(() => ({
  createObjectURL: vi.fn(),
  revokeObjectURL: vi.fn(),
}));

let fileText = '';
/** Every anchor the helper clicked, so the download's filename can be read. */
const clicked: HTMLAnchorElement[] = [];

beforeEach(() => {
  fileText = '';
  clicked.length = 0;
  createObjectURL.mockReset();
  revokeObjectURL.mockReset();

  createObjectURL.mockReturnValue('blob:mock-url');

  vi.stubGlobal(
    'Blob',
    class {
      constructor(parts: string[]) {
        fileText = parts.join('');
      }
    },
  );
  // jsdom implements neither object-URL function.
  URL.createObjectURL = createObjectURL;
  URL.revokeObjectURL = revokeObjectURL;

  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function capture(
    this: HTMLAnchorElement,
  ) {
    clicked.push(this);
  });
});

/** Filename the helper asked the browser to save. */
const downloadName = (): string | undefined => clicked.at(-1)?.download;

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('toFileSlug', () => {
  it('lowercases and replaces anything a filename would object to', () => {
    expect(toFileSlug('Lagos Sound Festival')).toBe('lagos_sound_festival');
    expect(toFileSlug('Jazz/Soul: Night?')).toBe('jazz_soul__night_');
    expect(toFileSlug('  spaced  out  ')).toBe('__spaced__out__');
  });
});

describe('exportRowsToCSV', () => {
  it('writes the headers and rows, and names the download', async () => {
    exportRowsToCSV(
      ['Date', 'Tickets sold'],
      [
        ['2026-09-20', '12'],
        ['2026-09-21', '7'],
      ],
      'sales_2026-09-20_to_2026-09-21_analytics.csv',
    );

    expect(fileText).toBe(
      'Date,Tickets sold\n2026-09-20,12\n2026-09-21,7',
    );
    expect(downloadName()).toBe('sales_2026-09-20_to_2026-09-21_analytics.csv');
  });

  it('quotes a cell containing a comma so the row does not shift', async () => {
    exportRowsToCSV(['Event', 'Sold'], [['Jazz, Soul & More', '314']]);

    expect(fileText).toBe('Event,Sold\n"Jazz, Soul & More",314');
  });

  it('doubles embedded quotes and wraps the cell', async () => {
    exportRowsToCSV(['Title'], [['The "Main" Room']]);

    expect(fileText).toBe('Title\n"The ""Main"" Room"');
  });

  it('keeps a newline inside one quoted cell', async () => {
    exportRowsToCSV(['Notes'], [['line one\nline two']]);

    expect(fileText).toBe('Notes\n"line one\nline two"');
  });

  it('writes headers alone when there are no rows', async () => {
    exportRowsToCSV(['Date', 'Sold'], [], 'empty.csv');

    expect(fileText).toBe('Date,Sold');
  });

  it('revokes the object URL it created', () => {
    exportRowsToCSV(['A'], [['1']], 'a.csv');

    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });
});

describe('exportAttendeesToCSV', () => {
  it('keeps its original filename shape after the refactor', async () => {
    exportAttendeesToCSV(
      [
        { name: 'Ada Lovelace', email: 'ada@example.com', ticketType: 'Floor', checkedIn: true },
        { name: 'Alan Turing', email: 'alan@example.com', ticketType: 'Balcony', checkedIn: false },
      ],
      'Lagos Sound Festival',
      '2026-10-17',
    );

    expect(downloadName()).toBe('lagos_sound_festival_2026-10-17_attendees.csv');
    expect(fileText).toBe(
      [
        'Name,Email,Ticket Type,Checked In',
        'Ada Lovelace,ada@example.com,Floor,Yes',
        'Alan Turing,alan@example.com,Balcony,No',
      ].join('\n'),
    );
  });

  it('rounds a checked-in flag to a Yes or No a bookkeeper can read', async () => {
    exportAttendeesToCSV(
      [{ name: 'Grace Hopper', email: 'grace@example.com', ticketType: 'Floor', checkedIn: true }],
      'Accra Chill Fest',
      '2026-08-29',
    );

    expect(fileText).toContain('Grace Hopper,grace@example.com,Floor,Yes');
  });
});
