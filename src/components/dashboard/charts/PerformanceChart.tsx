interface PerformanceChartProps {
  data: Array<{ month: string; value: number }>;
}

export const PerformanceChart = ({ data }: PerformanceChartProps) => {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="flex h-48 items-end gap-4">
      {data.map((item) => (
        <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
          <div
            className="w-6 rounded-t-md bg-[#4D21FF]"
            style={{ height: `${(item.value / maxValue) * 100}%` }}
          />
          <span className="text-[10px] text-[#21D4FF]">{item.month}</span>
        </div>
      ))}
    </div>
  );
};
