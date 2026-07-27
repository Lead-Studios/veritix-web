import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PayoutHistory } from '../PayoutHistory';
import * as payoutsApi from '@/lib/api/payouts';

vi.mock('@/lib/api/payouts');

describe('PayoutHistory Component', () => {
  const mockOrganizerId = 'org-123';

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('shows loading skeleton on mount while fetching payouts', () => {
    vi.spyOn(payoutsApi, 'fetchOrganizerPayouts').mockReturnValue(new Promise(() => {}));

    render(<PayoutHistory organizerId={mockOrganizerId} />);

    expect(screen.getByTestId('payout-skeleton')).toBeInTheDocument();
  });

  it('renders payout table rows upon successful API resolution', async () => {
    const mockData: payoutsApi.PayoutRecord[] = [
      {
        id: 'pay-1',
        date: '2026-07-20T10:00:00Z',
        amount: 2500,
        currency: 'XLM',
        status: 'Settled',
        transactionRef: '0xabc123...',
      },
    ];

    vi.spyOn(payoutsApi, 'fetchOrganizerPayouts').mockResolvedValue(mockData);

    render(<PayoutHistory organizerId={mockOrganizerId} />);

    await waitFor(() => {
      expect(screen.getByText('XLM 2,500')).toBeInTheDocument();
      expect(screen.getByText('Settled')).toBeInTheDocument();
      expect(screen.getByText('0xabc123...')).toBeInTheDocument();
    });

    expect(payoutsApi.fetchOrganizerPayouts).toHaveBeenCalledWith(mockOrganizerId);
  });

  it('renders empty state when no payout records are returned', async () => {
    vi.spyOn(payoutsApi, 'fetchOrganizerPayouts').mockResolvedValue([]);

    render(<PayoutHistory organizerId={mockOrganizerId} />);

    await waitFor(() => {
      expect(screen.getByText('No payout history found')).toBeInTheDocument();
    });
  });
});