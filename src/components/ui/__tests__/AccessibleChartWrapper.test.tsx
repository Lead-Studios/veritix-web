import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AccessibleChartWrapper } from '../AccessibleChartWrapper';

describe('AccessibleChartWrapper', () => {
  const mockProps = {
    title: 'Revenue Metrics',
    summary: 'Revenue grew by 25% month-over-month.',
    data: [
      { month: 'Jan', revenue: '$10,000' },
      { month: 'Feb', revenue: '$12,500' },
    ],
    columns: [
      { key: 'month', label: 'Month' },
      { key: 'revenue', label: 'Revenue' },
    ],
  };

  it('renders SVG container with role="img" and aria-label', () => {
    render(
      <AccessibleChartWrapper {...mockProps}>
        <div data-testid="mock-chart" />
      </AccessibleChartWrapper>,
    );

    const imgRegion = screen.getByRole('img');
    expect(imgRegion).toBeInTheDocument();
    expect(imgRegion).toHaveAttribute(
      'aria-label',
      'Revenue Metrics. Revenue grew by 25% month-over-month.',
    );
  });

  it('renders visually-hidden caption summary for screen reader navigation', () => {
    render(
      <AccessibleChartWrapper {...mockProps}>
        <div data-testid="mock-chart" />
      </AccessibleChartWrapper>,
    );

    const summaryText = screen.getByText('Revenue grew by 25% month-over-month.');
    expect(summaryText.parentElement).toHaveClass('sr-only');
  });

  it('toggles table view visibility when "View as table" button is clicked', () => {
    render(
      <AccessibleChartWrapper {...mockProps}>
        <div data-testid="mock-chart" />
      </AccessibleChartWrapper>,
    );

    const toggleBtn = screen.getByRole('button', { name: /view as table/i });
    expect(screen.queryByRole('table')).not.toBeInTheDocument();

    fireEvent.click(toggleBtn);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    expect(screen.getByText('$12,500')).toBeInTheDocument();
    expect(toggleBtn).toHaveTextContent('Hide data table');

    fireEvent.click(toggleBtn);
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});
