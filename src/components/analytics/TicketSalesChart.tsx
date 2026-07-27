'use client';

import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { AccessibleChartWrapper } from '../ui/AccessibleChartWrapper';

const salesData = [
  { date: '2026-07-01', sales: 120 },
  { date: '2026-07-02', sales: 250 },
  { date: '2026-07-03', sales: 410 },
  { date: '2026-07-04', sales: 380 },
];

export function TicketSalesChart() {
  return (
    <AccessibleChartWrapper
      title="Daily Ticket Sales"
      summary="Ticket sales steadily increased from 120 on July 1 to a peak of 410 on July 3, before settling at 380 on July 4."
      data={salesData}
      columns={[
        { key: 'date', label: 'Date' },
        { key: 'sales', label: 'Tickets Sold' },
      ]}
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={salesData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="sales" stroke="#6366f1" />
        </LineChart>
      </ResponsiveContainer>
    </AccessibleChartWrapper>
  );
}