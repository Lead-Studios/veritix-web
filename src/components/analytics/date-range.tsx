'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

/**
 * Shared date range control for analytics views.
 *
 * Presets and the custom range both write straight to the `from`/`to` query
 * parameters, so a filtered view is shareable and survives a reload.
 */

export interface DateRangeProps {
  className?: string;
}

type Preset = '7d' | '30d' | '90d';

const PRESETS: { label: string; value: Preset }[] = [
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
  { label: '90 days', value: '90d' },
];

export function DateRange({ className }: DateRangeProps) {
  const router = useRouter();
  const params = useSearchParams();
  const preset = (params.get('range') as Preset) ?? '30d';
  const from = params.get('from') ?? '';
  const to = params.get('to') ?? '';

  function setPreset(value: Preset) {
    const sp = new URLSearchParams(params.toString());
    sp.set('range', value);
    sp.delete('from');
    sp.delete('to');
    router.replace(`?${sp.toString()}`);
  }

  function setCustom(key: 'from' | 'to', value: string) {
    const sp = new URLSearchParams(params.toString());
    sp.set(key, value);
    sp.delete('range');
    router.replace(`?${sp.toString()}`);
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {/* Preset buttons */}
      <div className="flex rounded-xl overflow-hidden border border-white/10">
        {PRESETS.map(({ label, value }) => (
          <button
            key={value}
            type="button"
            onClick={() => setPreset(value)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              preset === value
                ? 'bg-[#4D21FF] text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Custom date inputs */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <input
          type="date"
          value={from}
          onChange={(e) => setCustom('from', e.target.value)}
          aria-label="Start date"
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#4D21FF] [color-scheme:dark]"
        />
        <span>–</span>
        <input
          type="date"
          value={to}
          onChange={(e) => setCustom('to', e.target.value)}
          aria-label="End date"
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#4D21FF] [color-scheme:dark]"
        />
      </div>
    </div>
  );
}
