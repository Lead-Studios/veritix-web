import React from 'react';

export function CapacityProgressBar({ sold, total }: { sold: number; total: number }) {
  const percentage = (sold / total) * 100;
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-blue-500 transition-all"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export default CapacityProgressBar;
