'use client';

import React, { useState, useId } from 'react';

export interface AccessibleChartWrapperProps {
  title: string;
  summary: string;
  data: Array<Record<string, any>>;
  columns: Array<{ key: string; label: string }>;
  children: React.ReactElement;
  ariaLabel?: string;
}

export function AccessibleChartWrapper({
  title,
  summary,
  data,
  columns,
  children,
  ariaLabel,
}: AccessibleChartWrapperProps) {
  const [showTable, setShowTable] = useState(false);
  const tableId = useId();
  const summaryId = useId();

  return (
    <div className="accessible-chart-container relative space-y-3">
      {/* Visually Hidden Screen Reader Summary */}
      <div id={summaryId} className="sr-only" aria-live="polite">
        <h3>{title}</h3>
        <p>{summary}</p>
      </div>

      {/* Accessible Controls Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h4>
        <button
          type="button"
          onClick={() => setShowTable((prev) => !prev)}
          aria-expanded={showTable}
          aria-controls={tableId}
          className="rounded border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        >
          {showTable ? 'Hide data table' : 'View as table'}
        </button>
      </div>

      {/* Recharts SVG Container with Accessibility Attributes */}
      <div
        role="img"
        aria-label={ariaLabel || `${title}. ${summary}`}
        aria-describedby={summaryId}
        className="chart-svg-region"
      >
        {children}
      </div>

      {/* Toggleable Accessible Data Table */}
      {showTable && (
        <div id={tableId} className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-xs dark:divide-gray-700">
            <caption className="sr-only">{title} data table</caption>
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className="px-3 py-2 font-medium text-gray-500 dark:text-gray-400"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {data.map((row, idx) => (
                <tr key={idx}>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="whitespace-nowrap px-3 py-2 text-gray-900 dark:text-gray-100"
                    >
                      {row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
