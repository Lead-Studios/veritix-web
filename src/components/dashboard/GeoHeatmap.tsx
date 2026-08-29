'use client';

import { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { Map as MapIcon, Table } from 'lucide-react';
import { THEME_COLORS } from '@/lib/themeColors';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export interface RegionEntry {
  label: string;
  count: number;
  percentage: number;
}

interface Props {
  regions: RegionEntry[];
}

/** Build a name → entry lookup (lower-cased for fuzzy matching) */
function buildCountryMap(regions: RegionEntry[]): Map<string, RegionEntry> {
  const map = new Map<string, RegionEntry>();
  for (const r of regions) {
    map.set(r.label.toLowerCase(), r);
  }
  return map;
}

/** Choropleth fill: light → dark violet */
function getColor(percentage: number): string {
  const opacity = Math.max(0.15, Math.min(1, percentage / 100));
  return `rgba(77, 33, 255, ${opacity})`;
}

interface TooltipState {
  x: number;
  y: number;
  content: string;
}

/** Accessible data-table fallback */
function RegionTable({ regions }: { regions: RegionEntry[] }) {
  return (
    <div className="overflow-x-auto rounded-lg bg-white/5">
      <table
        className="w-full text-left text-xs"
        aria-label="Attendee geographic distribution"
      >
        <thead>
          <tr className="border-b border-white/10">
            <th scope="col" className="px-4 py-2 font-semibold text-brand-accent">
              Region
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-right font-semibold text-brand-accent"
            >
              Attendees
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-right font-semibold text-brand-accent"
            >
              Share
            </th>
          </tr>
        </thead>
        <tbody>
          {regions.map((r) => (
            <tr
              key={r.label}
              className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
            >
              <td className="px-4 py-2 text-white">{r.label}</td>
              <td className="px-4 py-2 text-right text-brand-primary font-medium">
                {r.count.toLocaleString()}
              </td>
              <td className="px-4 py-2 text-right text-gray-400">{r.percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function GeoHeatmap({ regions }: Props) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [showTable, setShowTable] = useState(false);

  const regionMap = buildCountryMap(regions);

  return (
    <div className="relative rounded-xl bg-white/5 p-4">
      {/* Header row */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-brand-accent">
          Geographic Distribution
        </p>

        {/* Toggle: map ↔ table */}
        <div
          className="flex overflow-hidden rounded-lg border border-white/10"
          role="group"
          aria-label="Switch between map and table view"
        >
          <button
            onClick={() => setShowTable(false)}
            aria-pressed={!showTable}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary ${
              !showTable
                ? 'bg-brand-primary text-white'
                : 'bg-transparent text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <MapIcon size={11} aria-hidden="true" />
            Map
          </button>
          <button
            onClick={() => setShowTable(true)}
            aria-pressed={showTable}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary ${
              showTable
                ? 'bg-brand-primary text-white'
                : 'bg-transparent text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Table size={11} aria-hidden="true" />
            Table
          </button>
        </div>
      </div>

      {showTable ? (
        <RegionTable regions={regions} />
      ) : (
        <>
          {/* Responsive map — uses aspect-ratio to stay mobile-friendly */}
          <div className="w-full" style={{ aspectRatio: '16 / 7', minHeight: 200 }}>
            <ComposableMap
              projectionConfig={{ scale: 140 }}
              style={{ width: '100%', height: '100%' }}
              aria-label="World choropleth map of attendee distribution"
              role="img"
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const name: string = geo.properties.name ?? '';
                    const entry = regionMap.get(name.toLowerCase());
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={
                          entry ? getColor(entry.percentage) : 'rgba(255,255,255,0.05)'
                        }
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth={0.5}
                        onMouseEnter={(e) => {
                          if (!entry) return;
                          setTooltip({
                            x: (e as MouseEvent).clientX,
                            y: (e as MouseEvent).clientY,
                            content: `${name}: ${entry.count.toLocaleString()} attendees (${entry.percentage}%)`,
                          });
                        }}
                        onMouseLeave={() => setTooltip(null)}
                        style={{
                          hover: { fill: THEME_COLORS.brandAccent, outline: 'none' },
                          pressed: { outline: 'none' },
                          default: { outline: 'none' },
                        }}
                        aria-label={
                          entry
                            ? `${name}: ${entry.count} attendees (${entry.percentage}%)`
                            : name
                        }
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
          </div>

          {/* Colour legend */}
          <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-500">
            <div
              className="h-2 w-16 rounded-full"
              style={{
                background:
                  'linear-gradient(to right, rgba(77,33,255,0.15), rgba(77,33,255,1))',
              }}
              aria-hidden="true"
            />
            <span>Low → High attendance</span>
          </div>
        </>
      )}

      {/* Floating tooltip (map mode only) */}
      {!showTable && tooltip && (
        <div
          role="tooltip"
          className="pointer-events-none fixed z-50 rounded bg-[#1a2040] border border-brand-primary px-3 py-2 text-xs text-brand-accent shadow-lg"
          style={{ left: tooltip.x + 12, top: tooltip.y - 28 }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
}
