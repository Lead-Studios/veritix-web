import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectedRevenueCard } from '@/components/dashboard/ProjectedRevenueCard';

describe('ProjectedRevenueCard (#793)', () => {
  const fullInput = {
    remainingTickets: 100,
    averageTicketPrice: 5000,
    sellThroughRate: 0.72,
    totalTickets: 500,
  };

  it('renders with a confidence range', () => {
    render(<ProjectedRevenueCard input={fullInput} />);
    expect(screen.getByText('Projected Revenue')).toBeInTheDocument();
    // Should show range like "₦ X – ₦ Y"
    expect(screen.getByText(/projected from remaining inventory/)).toBeInTheDocument();
  });

  it('shows sell-through rate progress bar', () => {
    render(<ProjectedRevenueCard input={fullInput} />);
    expect(screen.getByText('Sell-through rate')).toBeInTheDocument();
    expect(screen.getByText('72%')).toBeInTheDocument();
  });

  it('shows confidence level', () => {
    render(<ProjectedRevenueCard input={fullInput} />);
    // 0.72 sell-through → high confidence (>= 0.6)
    expect(screen.getByText('High confidence')).toBeInTheDocument();
  });

  it('hides when insufficient data (remainingTickets = 0)', () => {
    const { container } = render(
      <ProjectedRevenueCard input={{ ...fullInput, remainingTickets: 0 }} />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('hides when sell-through is below 10%', () => {
    const { container } = render(
      <ProjectedRevenueCard
        input={{
          ...fullInput,
          totalTickets: 1000,
          remainingTickets: 950,
          sellThroughRate: 0.05,
        }}
      />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('shows medium confidence for moderate sell-through', () => {
    render(<ProjectedRevenueCard input={{ ...fullInput, sellThroughRate: 0.4 }} />);
    expect(screen.getByText('Medium confidence')).toBeInTheDocument();
  });

  it('shows low confidence for low sell-through', () => {
    render(<ProjectedRevenueCard input={{ ...fullInput, sellThroughRate: 0.15 }} />);
    expect(screen.getByText('Low confidence')).toBeInTheDocument();
  });

  it('displays custom currency symbol', () => {
    render(<ProjectedRevenueCard input={fullInput} currencySymbol="$" />);
    expect(screen.getByText(/\$/)).toBeInTheDocument();
  });
});
