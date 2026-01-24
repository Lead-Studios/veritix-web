import { AreaChart, Area, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface RevenueChartProps {
  data: Array<{ month: string; revenue: number }>
}

const COMMON_TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: '#000625',
    border: '1px solid #4D21FF',
    borderRadius: '6px',
    color: '#21D4FF',
  },
  labelStyle: { color: '#21D4FF' },
}

export const RevenueChart = ({ data }: RevenueChartProps) => (
  <ResponsiveContainer width="100%" height={192}>
    <AreaChart data={data}>
      <defs>
        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#4D21FF" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#21D4FF" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(77,33,255,0.4)" />
      <Tooltip {...COMMON_TOOLTIP_STYLE} />
      <Area
        type="monotone"
        dataKey="revenue"
        stroke="#21D4FF"
        fillOpacity={1}
        fill="url(#colorRevenue)"
      />
    </AreaChart>
  </ResponsiveContainer>
)

