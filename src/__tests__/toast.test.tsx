import * as React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ToastProvider, useToast } from '@/components/ui/toast';

/**
 * Trigger labels are deliberately different from the toast titles they queue, so
 * a query for toast text cannot accidentally match the button that raised it.
 */
function Trigger() {
  const { toast, dismissAll } = useToast();

  return (
    <>
      <button type="button" onClick={() => toast({ title: 'Event saved' })}>
        save
      </button>
      <button
        type="button"
        onClick={() =>
          toast({ title: 'Save failed', description: 'Try again.', variant: 'error' })
        }
      >
        fail
      </button>
      <button
        type="button"
        onClick={() => toast({ title: 'Sticky notice', duration: null })}
      >
        sticky
      </button>
      <button
        type="button"
        onClick={() => toast({ title: 'Quick notice', duration: 50 })}
      >
        quick
      </button>
      <button type="button" onClick={dismissAll}>
        clear
      </button>
    </>
  );
}

function renderWithProvider(limit?: number) {
  return render(
    <ToastProvider limit={limit}>
      <Trigger />
    </ToastProvider>,
  );
}

const liveRegion = () => screen.getByLabelText('Notifications');
/** Scoped so assertions can only ever see toast content. */
const inToasts = () => within(liveRegion());

describe('Toast', () => {
  it('renders the live region before any toast exists', () => {
    renderWithProvider();

    // The region must already be in the DOM, or inserting into it announces
    // nothing.
    const region = liveRegion();
    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(region).toHaveAttribute('aria-atomic', 'false');
  });

  it('shows a queued toast inside the live region', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByRole('button', { name: 'save' }));

    expect(inToasts().getByText('Event saved')).toBeInTheDocument();
  });

  it('renders a description when given one', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByRole('button', { name: 'fail' }));

    expect(inToasts().getByText('Save failed')).toBeInTheDocument();
    expect(inToasts().getByText('Try again.')).toBeInTheDocument();
  });

  it('auto-dismisses after its duration', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByRole('button', { name: 'quick' }));
    expect(inToasts().getByText('Quick notice')).toBeInTheDocument();

    await waitFor(() =>
      expect(inToasts().queryByText('Quick notice')).not.toBeInTheDocument(),
    );
  });

  it('stays until dismissed when duration is null', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByRole('button', { name: 'sticky' }));

    // Long enough that a 50ms toast would already be gone.
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(inToasts().getByText('Sticky notice')).toBeInTheDocument();
  });

  it('can be dismissed manually', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByRole('button', { name: 'sticky' }));
    await user.click(screen.getByRole('button', { name: 'Dismiss: Sticky notice' }));

    expect(inToasts().queryByText('Sticky notice')).not.toBeInTheDocument();
  });

  it('names each dismiss button after its own toast', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByRole('button', { name: 'sticky' }));
    await user.click(screen.getByRole('button', { name: 'fail' }));

    // Several toasts can be on screen at once, so "Close" alone is ambiguous.
    expect(
      screen.getByRole('button', { name: 'Dismiss: Sticky notice' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Dismiss: Save failed' }),
    ).toBeInTheDocument();
  });

  it('dismisses only the toast whose button was pressed', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByRole('button', { name: 'sticky' }));
    await user.click(screen.getByRole('button', { name: 'fail' }));
    await user.click(screen.getByRole('button', { name: 'Dismiss: Sticky notice' }));

    expect(inToasts().queryByText('Sticky notice')).not.toBeInTheDocument();
    expect(inToasts().getByText('Save failed')).toBeInTheDocument();
  });

  it('stacks multiple toasts', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByRole('button', { name: 'sticky' }));
    await user.click(screen.getByRole('button', { name: 'fail' }));

    expect(inToasts().getByText('Sticky notice')).toBeInTheDocument();
    expect(inToasts().getByText('Save failed')).toBeInTheDocument();
  });

  it('drops the oldest toast past the limit', async () => {
    const user = userEvent.setup();
    renderWithProvider(1);

    await user.click(screen.getByRole('button', { name: 'sticky' }));
    await user.click(screen.getByRole('button', { name: 'fail' }));

    expect(inToasts().queryByText('Sticky notice')).not.toBeInTheDocument();
    expect(inToasts().getByText('Save failed')).toBeInTheDocument();
  });

  it('clears every toast with dismissAll', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByRole('button', { name: 'sticky' }));
    await user.click(screen.getByRole('button', { name: 'fail' }));
    await user.click(screen.getByRole('button', { name: 'clear' }));

    expect(inToasts().queryByText('Sticky notice')).not.toBeInTheDocument();
    expect(inToasts().queryByText('Save failed')).not.toBeInTheDocument();
  });

  it('keeps two toasts queued in the same tick distinct', async () => {
    function Double() {
      const { toast } = useToast();
      return (
        <button
          type="button"
          onClick={() => {
            toast({ title: 'First', duration: null });
            toast({ title: 'Second', duration: null });
          }}
        >
          both
        </button>
      );
    }

    const user = userEvent.setup();
    render(
      <ToastProvider>
        <Double />
      </ToastProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'both' }));

    expect(inToasts().getByText('First')).toBeInTheDocument();
    expect(inToasts().getByText('Second')).toBeInTheDocument();
  });

  it('throws when useToast is called outside the provider', () => {
    function Orphan() {
      useToast();
      return null;
    }

    expect(() => render(<Orphan />)).toThrow(/must be used within a <ToastProvider>/);
  });
});
