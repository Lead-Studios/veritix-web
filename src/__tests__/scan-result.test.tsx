import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ScanResultDisplay } from '@/components/verify/scan-result';

afterEach(() => {
  vi.useRealTimers();
});

describe('ScanResultDisplay', () => {
  it('shows the ticket outcome with a large icon and a visible text verdict', () => {
    render(
      <ScanResultDisplay
        result={{ kind: 'valid', message: 'Ticket accepted.', ticketId: 'tkt_1' }}
        onDismiss={vi.fn()}
      />,
    );

    const panel = screen.getByText('Ticket accepted.').closest('[data-result]');
    expect(panel).toHaveClass('w-full');
    expect(panel).toHaveAttribute('data-result', 'valid');
    expect(screen.getByText('Valid — let them in')).toBeInTheDocument();
    expect(screen.getByText('Ticket tkt_1')).toBeInTheDocument();
    expect(panel?.querySelector('svg')).toHaveClass('h-12', 'w-12');
  });

  it('dismisses the result automatically after a short interval', () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();

    render(
      <ScanResultDisplay
        result={{ kind: 'invalid', message: 'This ticket is not valid.' }}
        onDismiss={onDismiss}
      />,
    );

    expect(onDismiss).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('allows the operator to dismiss the result immediately', () => {
    const onDismiss = vi.fn();
    render(
      <ScanResultDisplay
        result={{ kind: 'already_used', message: 'Already scanned.' }}
        onDismiss={onDismiss}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Scan next ticket' }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });
});
