import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

/** Controlled wrapper, since Switch has no uncontrolled mode by design. */
function Harness({
  initial = false,
  disabled = false,
}: {
  initial?: boolean;
  disabled?: boolean;
}) {
  const [checked, setChecked] = React.useState(initial);
  return (
    <>
      <Switch
        id="notifications"
        checked={checked}
        onCheckedChange={setChecked}
        disabled={disabled}
      />
      <Label htmlFor="notifications">Email notifications</Label>
    </>
  );
}

describe('Switch', () => {
  it('exposes itself as a switch with its state in aria-checked', () => {
    render(<Harness />);

    const control = screen.getByRole('switch');
    expect(control).toHaveAttribute('aria-checked', 'false');
    expect(control).not.toBeChecked();
  });

  it('reflects the on state', () => {
    render(<Harness initial />);

    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('toggles on click', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    const control = screen.getByRole('switch');
    await user.click(control);
    expect(control).toHaveAttribute('aria-checked', 'true');

    await user.click(control);
    expect(control).toHaveAttribute('aria-checked', 'false');
  });

  it('toggles with Space', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    const control = screen.getByRole('switch');
    control.focus();
    await user.keyboard(' ');

    expect(control).toHaveAttribute('aria-checked', 'true');
  });

  it('toggles with Enter', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    // A checkbox would ignore Enter; this is why Switch is a button.
    const control = screen.getByRole('switch');
    control.focus();
    await user.keyboard('{Enter}');

    expect(control).toHaveAttribute('aria-checked', 'true');
  });

  it('is reachable by keyboard with a visible focus ring', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.tab();

    const control = screen.getByRole('switch');
    expect(control).toHaveFocus();
    expect(control.className).toContain('focus-visible:ring-ring');
  });

  it('is named by an associated label', () => {
    render(<Harness />);
    expect(screen.getByRole('switch')).toHaveAccessibleName('Email notifications');
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    render(<Harness disabled />);

    const control = screen.getByRole('switch');
    await user.click(control);

    expect(control).toBeDisabled();
    expect(control).toHaveAttribute('aria-checked', 'false');
  });

  it('reports every change exactly once', async () => {
    const onCheckedChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Switch
        aria-label="Public profile"
        checked={false}
        onCheckedChange={onCheckedChange}
      />,
    );

    await user.click(screen.getByRole('switch'));

    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('stays controlled by the parent', async () => {
    const user = userEvent.setup();
    render(
      <Switch aria-label="Public profile" checked={false} onCheckedChange={vi.fn()} />,
    );

    await user.click(screen.getByRole('switch'));

    // The parent ignored the change, so the switch must not move on its own.
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });

  it('does not submit a form when used inside one', async () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    const user = userEvent.setup();

    render(
      <form onSubmit={onSubmit}>
        <Switch aria-label="Public profile" checked={false} onCheckedChange={vi.fn()} />
      </form>,
    );

    await user.click(screen.getByRole('switch'));

    // type="button" keeps it from acting as a submit control.
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('forwards a ref to the button', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <Switch
        aria-label="Public profile"
        checked={false}
        onCheckedChange={vi.fn()}
        ref={ref}
      />,
    );

    expect(ref.current).toBe(screen.getByRole('switch'));
  });
});
