interface RevenueChartProps {
  data: Array<{ month: string; revenue: number }>;
}

export const RevenueChart = ({ data }: RevenueChartProps) => {
  const maxValue = Math.max(...data.map((item) => item.revenue), 1);

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.month} className="flex items-center gap-3 text-xs">
          <span className="w-8 text-[#21D4FF]">{item.month}</span>
          <div className="h-2 flex-1 rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#4D21FF] to-[#21D4FF]"
              style={{ width: `${(item.revenue / maxValue) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
