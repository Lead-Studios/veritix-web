import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface PerformanceChartProps {
  data: Array<{ month: string; value: number }>
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

export const PerformanceChart = ({ data }: PerformanceChartProps) => (
  <ResponsiveContainer width="100%" height={192}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(77,33,255,0.4)" />
      <XAxis dataKey="month" stroke="#21D4FF" tick={{ fontSize: 12 }} />
      <YAxis stroke="#21D4FF" tick={{ fontSize: 12 }} />
      <Tooltip {...COMMON_TOOLTIP_STYLE} />
      <Bar dataKey="value" fill="#4D21FF" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
)

