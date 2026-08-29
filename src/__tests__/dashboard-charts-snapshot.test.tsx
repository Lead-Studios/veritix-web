import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PerformanceChart } from '@/components/dashboard/charts/PerformanceChart';
import { RevenueChart } from '@/components/dashboard/charts/RevenueChart';
import { RevenueByTicketTypeChart } from '@/components/dashboard/charts/RevenueByTicketTypeChart';
import { TicketTypeChart } from '@/components/dashboard/charts/TicketTypeChart';

vi.mock('next/dynamic', () => ({
  default: (loader: () => Promise<{ default: React.ComponentType<any> }>) => {
    const DynamicComponent = (props: Record<string, unknown>) => {
      const [Component, setComponent] = React.useState<React.ComponentType<any> | null>(
        null,
      );

      React.useEffect(() => {
        loader().then((module) => setComponent(() => module.default));
      }, []);

      return Component ? <Component {...props} /> : null;
    };

    return DynamicComponent;
  },
}));

import React from 'react';

describe('Dashboard Chart Snapshot Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('snapshots RevenueChart with minimal data', () => {
    const { container } = render(
      <RevenueChart data={[{ month: 'Jan', revenue: 500 }]} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('snapshots RevenueChart with empty data', () => {
    const { container } = render(<RevenueChart data={[]} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('snapshots PerformanceChart with minimal data', () => {
    const { container } = render(
      <PerformanceChart data={[{ month: 'Jan', value: 80 }]} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('snapshots PerformanceChart with empty data', () => {
    const { container } = render(<PerformanceChart data={[]} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('snapshots TicketTypeChart with minimal data', async () => {
    const { container } = render(
      <TicketTypeChart data={[{ type: 'VIP', count: 10, revenue: 1500 }]} />,
    );
    await vi.waitFor(() => expect(container.firstChild?.firstChild).toBeTruthy());
    expect(container.firstChild).toMatchSnapshot();
  });

  it('snapshots TicketTypeChart with empty data', async () => {
    const { container } = render(<TicketTypeChart data={[]} />);
    await vi.waitFor(() => expect(container.firstChild?.firstChild).toBeTruthy());
    expect(container.firstChild).toMatchSnapshot();
  });

  it('snapshots RevenueByTicketTypeChart with minimal data', () => {
    const { container } = render(
      <RevenueByTicketTypeChart data={[{ type: 'VIP', count: 10, revenue: 1500 }]} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('snapshots RevenueByTicketTypeChart with empty data', () => {
    const { container } = render(<RevenueByTicketTypeChart data={[]} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
