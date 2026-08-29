'use client';

import React from 'react';
import {
  FunnelChart as RechartsFunnelChart,
  Funnel,
  Tooltip,
  Cell,
  LabelList,
  ResponsiveContainer,
} from 'recharts';

export interface FunnelStage {
  name: string;
  value: number;
  fill?: string;
}

interface FunnelChartProps {
  stages: FunnelStage[];
  height?: number;
  valueFormatter?: (value: number) => string;
  className?: string;
}

const DEFAULT_COLORS = ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'];

/**
 * Ticket-sales funnel chart showing drop-off between stages
 * (e.g. page views → add to cart → checkout → purchase).
 */
export const FunnelChart: React.FC<FunnelChartProps> = ({
  stages,
  height = 300,
  valueFormatter = (v) => v.toLocaleString(),
  className = '',
}) => {
  const data = stages.map((stage, i) => ({
    ...stage,
    fill: stage.fill ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length],
  }));

  const summary =
    stages.length > 0
      ? `Funnel showing ${stages.length} stages from ${stages[0].name} (${stages[0].value.toLocaleString()}) to ${stages[stages.length - 1].name} (${stages[stages.length - 1].value.toLocaleString()})`
      : 'Empty funnel chart';

  return (
    <div className={className} style={{ width: '100%', height }}>
      <div className="sr-only" role="img" aria-label={summary}>
        {summary}
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsFunnelChart>
          <Tooltip
            formatter={(value: number) => [valueFormatter(value), 'Count']}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              fontSize: 13,
            }}
          />
          <Funnel dataKey="value" data={data} isAnimationActive aria-label={summary}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
            <LabelList
              position="right"
              content={({ value, name }) => `${name}: ${valueFormatter(Number(value))}`}
              style={{ fontSize: 12, fill: '#374151' }}
            />
          </Funnel>
        </RechartsFunnelChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FunnelChart;
