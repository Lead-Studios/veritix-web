import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Tooltip } from '@/components/ui/tooltip';

function Harness({ delayMs = 0 }: { delayMs?: number }) {
  return (
    <>
      <Tooltip content="Delete event" delayMs={delayMs}>
        <button type="button" aria-label="Delete">
          x
        </button>
      </Tooltip>
      <button type="button">After</button>
    </>
  );
}

describe('Tooltip', () => {
  it('is hidden until the trigger is hovered or focused', () => {
    render(<Harness />);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).not.toHaveAttribute(
      'aria-describedby',
    );
  });

  it('opens on hover', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.hover(screen.getByRole('button', { name: 'Delete' }));

    expect(screen.getByRole('tooltip')).toHaveTextContent('Delete event');
  });

  it('closes when the pointer leaves', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    const trigger = screen.getByRole('button', { name: 'Delete' });
    await user.hover(trigger);
    await user.unhover(trigger);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('opens on keyboard focus', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    // The reason this component exists: hover-only would be unusable here.
    await user.tab();

    expect(screen.getByRole('button', { name: 'Delete' })).toHaveFocus();
    expect(screen.getByRole('tooltip')).toHaveTextContent('Delete event');
  });

  it('closes on blur', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.tab();
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    await user.tab();

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('describes the trigger without replacing its name', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.tab();

    const trigger = screen.getByRole('button', { name: 'Delete' });
    expect(trigger).toHaveAttribute('aria-describedby', screen.getByRole('tooltip').id);
    // The button keeps its own accessible name; the tooltip only adds to it.
    expect(trigger).toHaveAccessibleName('Delete');
    expect(trigger).toHaveAccessibleDescription('Delete event');
  });

  it('never takes focus away from the trigger', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.tab();
    const trigger = screen.getByRole('button', { name: 'Delete' });

    expect(trigger).toHaveFocus();
    expect(screen.getByRole('tooltip')).not.toHaveFocus();
  });

  it('does not trap focus: Tab continues to the next control', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.tab();
    await user.tab();

    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
  });

  it('dismisses on Escape while the trigger keeps focus', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.tab();
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveFocus();
  });

  it('delays opening on hover', async () => {
    // Real timers on purpose: driving userEvent with fake timers deadlocks,
    // because its internal awaits need a clock that is being advanced.
    const user = userEvent.setup();
    render(<Harness delayMs={150} />);

    await user.hover(screen.getByRole('button', { name: 'Delete' }));

    // Not open yet, so the delay is doing something.
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());
  });

  it('opens immediately on focus even when a hover delay is set', async () => {
    const user = userEvent.setup();
    render(<Harness delayMs={150} />);

    await user.tab();

    // A keyboard user has already committed to the control, so no delay.
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('preserves handlers already on the trigger', async () => {
    const onFocus = vi.fn();
    const onMouseEnter = vi.fn();
    const user = userEvent.setup();

    render(
      <Tooltip content="Delete event">
        <button
          type="button"
          aria-label="Delete"
          onFocus={onFocus}
          onMouseEnter={onMouseEnter}
        >
          x
        </button>
      </Tooltip>,
    );

    await user.hover(screen.getByRole('button', { name: 'Delete' }));
    expect(onMouseEnter).toHaveBeenCalled();

    await user.tab();
    expect(onFocus).toHaveBeenCalled();
  });

  it('supports each side', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Delete event" side="bottom">
        <button type="button" aria-label="Delete">
          x
        </button>
      </Tooltip>,
    );

    await user.tab();

    expect(screen.getByRole('tooltip').className).toContain('top-full');
  });
});
