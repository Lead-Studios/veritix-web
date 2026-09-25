import * as React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DatePicker, fromIsoDate, toIsoDate } from '@/components/ui/date-picker';

function Harness({
  initial = '',
  min,
  max,
  onChange,
}: {
  initial?: string;
  min?: string;
  max?: string;
  onChange?: (value: string) => void;
}) {
  const [value, setValue] = React.useState(initial);

  return (
    <DatePicker
      label="Starts at"
      value={value}
      min={min}
      max={max}
      onChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
    />
  );
}

const field = () => screen.getByLabelText('Starts at');
const calendarButton = () =>
  screen.getByRole('button', { name: 'Choose Starts at from a calendar' });

describe('toIsoDate / fromIsoDate', () => {
  it('formats from local parts, not UTC', () => {
    // A local midnight west of Greenwich is the previous day in UTC, so
    // toISOString() would emit 2026-07-03 here. This must not.
    expect(toIsoDate(new Date(2026, 6, 4))).toBe('2026-07-04');
  });

  it('round-trips an ISO date', () => {
    const parsed = fromIsoDate('2026-07-04');
    expect(parsed).not.toBeNull();
    expect(toIsoDate(parsed as Date)).toBe('2026-07-04');
  });

  it('rejects malformed input', () => {
    expect(fromIsoDate('')).toBeNull();
    expect(fromIsoDate('04/07/2026')).toBeNull();
    expect(fromIsoDate('2026-7-4')).toBeNull();
    expect(fromIsoDate('not-a-date')).toBeNull();
  });

  it('rejects dates that would roll over', () => {
    // The Date constructor turns 31 February into 3 March; that is not a date
    // the user typed.
    expect(fromIsoDate('2026-02-31')).toBeNull();
    expect(fromIsoDate('2026-13-01')).toBeNull();
  });
});

describe('DatePicker', () => {
  it('renders a labelled text field with the calendar closed', () => {
    render(<Harness />);

    expect(field()).toBeInTheDocument();
    expect(field()).toHaveAttribute('placeholder', 'YYYY-MM-DD');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(calendarButton()).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows the current value in the text field', () => {
    render(<Harness initial="2026-07-04" />);
    expect(field()).toHaveValue('2026-07-04');
  });

  it('accepts a typed date on Enter', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Harness onChange={onChange} />);

    await user.type(field(), '2026-07-04{Enter}');

    expect(onChange).toHaveBeenCalledWith('2026-07-04');
  });

  it('accepts a typed date on blur', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Harness onChange={onChange} />);

    await user.type(field(), '2026-08-15');
    await user.tab();

    expect(onChange).toHaveBeenCalledWith('2026-08-15');
  });

  it('flags a malformed typed date instead of emitting it', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Harness onChange={onChange} />);

    await user.type(field(), '15/08/2026{Enter}');

    expect(onChange).not.toHaveBeenCalled();
    expect(field()).toHaveAttribute('aria-invalid', 'true');
    expect(field()).toHaveAccessibleDescription(/YYYY-MM-DD/);
  });

  it('clears the value on an empty field', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Harness initial="2026-07-04" onChange={onChange} />);

    await user.clear(field());
    await user.keyboard('{Enter}');

    expect(onChange).toHaveBeenCalledWith('');
  });

  it('rejects a typed date outside the bounds', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Harness min="2026-07-01" max="2026-07-31" onChange={onChange} />);

    await user.type(field(), '2026-06-30{Enter}');

    expect(onChange).not.toHaveBeenCalled();
    expect(field()).toHaveAttribute('aria-invalid', 'true');
  });

  it('opens the calendar and wires aria-controls', async () => {
    const user = userEvent.setup();
    render(<Harness initial="2026-07-04" />);

    await user.click(calendarButton());

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAccessibleName('Starts at calendar');
    expect(calendarButton()).toHaveAttribute('aria-expanded', 'true');
    expect(calendarButton()).toHaveAttribute('aria-controls', dialog.id);
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('opens on the selected month with that day focused', async () => {
    const user = userEvent.setup();
    render(<Harness initial="2026-07-04" />);

    await user.click(calendarButton());

    expect(screen.getByRole('grid')).toHaveAccessibleName('July 2026');
    expect(screen.getByRole('button', { name: 'July 4, 2026' })).toHaveFocus();
  });

  it('keeps the grid to a single tab stop', async () => {
    const user = userEvent.setup();
    render(<Harness initial="2026-07-04" />);
    await user.click(calendarButton());

    expect(screen.getByRole('button', { name: 'July 4, 2026' })).toHaveAttribute(
      'tabindex',
      '0',
    );
    expect(screen.getByRole('button', { name: 'July 5, 2026' })).toHaveAttribute(
      'tabindex',
      '-1',
    );
  });

  it('moves a day at a time with left and right', async () => {
    const user = userEvent.setup();
    render(<Harness initial="2026-07-04" />);
    await user.click(calendarButton());

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: 'July 5, 2026' })).toHaveFocus();

    await user.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(screen.getByRole('button', { name: 'July 3, 2026' })).toHaveFocus();
  });

  it('moves a week at a time with up and down', async () => {
    const user = userEvent.setup();
    render(<Harness initial="2026-07-04" />);
    await user.click(calendarButton());

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('button', { name: 'July 11, 2026' })).toHaveFocus();

    await user.keyboard('{ArrowUp}{ArrowUp}');
    expect(screen.getByRole('button', { name: 'June 27, 2026' })).toHaveFocus();
  });

  it('jumps to the ends of the week with Home and End', async () => {
    const user = userEvent.setup();
    render(<Harness initial="2026-07-08" />);
    await user.click(calendarButton());

    // 8 July 2026 is a Wednesday, so its week runs Sunday 5th to Saturday 11th.
    await user.keyboard('{Home}');
    expect(screen.getByRole('button', { name: 'July 5, 2026' })).toHaveFocus();

    await user.keyboard('{End}');
    expect(screen.getByRole('button', { name: 'July 11, 2026' })).toHaveFocus();
  });

  it('changes month with PageUp and PageDown', async () => {
    const user = userEvent.setup();
    render(<Harness initial="2026-07-04" />);
    await user.click(calendarButton());

    await user.keyboard('{PageDown}');
    expect(screen.getByRole('grid')).toHaveAccessibleName('August 2026');

    await user.keyboard('{PageUp}{PageUp}');
    expect(screen.getByRole('grid')).toHaveAccessibleName('June 2026');
  });

  it('changes month with the header buttons', async () => {
    const user = userEvent.setup();
    render(<Harness initial="2026-07-04" />);
    await user.click(calendarButton());

    await user.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByRole('grid')).toHaveAccessibleName('August 2026');

    await user.click(screen.getByRole('button', { name: 'Previous month' }));
    expect(screen.getByRole('grid')).toHaveAccessibleName('July 2026');
  });

  it('selects the focused day with Enter and closes', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Harness initial="2026-07-04" onChange={onChange} />);
    await user.click(calendarButton());

    await user.keyboard('{ArrowRight}{Enter}');

    expect(onChange).toHaveBeenCalledWith('2026-07-05');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('selects with Space', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Harness initial="2026-07-04" onChange={onChange} />);
    await user.click(calendarButton());

    await user.keyboard('{ArrowDown} ');

    expect(onChange).toHaveBeenCalledWith('2026-07-11');
  });

  it('selects on click', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Harness initial="2026-07-04" onChange={onChange} />);
    await user.click(calendarButton());

    await user.click(screen.getByRole('button', { name: 'July 20, 2026' }));

    expect(onChange).toHaveBeenCalledWith('2026-07-20');
  });

  it('writes the chosen date back into the text field', async () => {
    const user = userEvent.setup();
    render(<Harness initial="2026-07-04" />);
    await user.click(calendarButton());

    await user.click(screen.getByRole('button', { name: 'July 20, 2026' }));

    expect(field()).toHaveValue('2026-07-20');
  });

  it('marks the selected day for assistive tech', async () => {
    const user = userEvent.setup();
    render(<Harness initial="2026-07-04" />);
    await user.click(calendarButton());

    const day = screen.getByRole('button', { name: 'July 4, 2026' });
    expect(day).toHaveAttribute('aria-current', 'date');
    expect(day.closest('[role="gridcell"]')).toHaveAttribute('aria-selected', 'true');
  });

  it('disables days outside the bounds and refuses to select them', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Harness
        initial="2026-07-15"
        min="2026-07-10"
        max="2026-07-20"
        onChange={onChange}
      />,
    );
    await user.click(calendarButton());

    const tooEarly = screen.getByRole('button', { name: 'July 9, 2026' });
    expect(tooEarly).toHaveAttribute('aria-disabled', 'true');

    // Browsing onto a bounded-out day is allowed; selecting it is not.
    await user.keyboard('{ArrowUp}{Enter}');

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<Harness initial="2026-07-04" />);
    await user.click(calendarButton());

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(calendarButton()).toHaveFocus();
  });

  it('renders six weeks so the grid never reflows', async () => {
    const user = userEvent.setup();
    render(<Harness initial="2026-07-04" />);
    await user.click(calendarButton());

    const grid = screen.getByRole('grid');
    // Six week rows plus the weekday header row.
    expect(within(grid).getAllByRole('row')).toHaveLength(7);
  });

  it('honours disabled', () => {
    render(<DatePicker label="Starts at" value="" onChange={vi.fn()} disabled />);

    expect(screen.getByLabelText('Starts at')).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Choose Starts at from a calendar' }),
    ).toBeDisabled();
  });
});
