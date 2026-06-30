"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface RegionEntry {
  label: string;
  count: number;
  percentage: number;
}

interface Props {
  regions: RegionEntry[];
}

// Map region label to ISO 3166-1 numeric codes (common country names)
function buildCountryMap(regions: RegionEntry[]): Map<string, RegionEntry> {
  const map = new Map<string, RegionEntry>();
  for (const r of regions) {
    map.set(r.label.toLowerCase(), r);
  }
  return map;
}

function getColor(percentage: number): string {
  // Choropleth: light → dark blue scale
  const opacity = Math.max(0.1, Math.min(1, percentage / 100));
  return `rgba(77, 33, 255, ${opacity})`;
}

interface TooltipState {
  x: number;
  y: number;
  content: string;
}

export default function GeoHeatmap({ regions }: Props) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const regionMap = buildCountryMap(regions);

  return (
    <div className="relative rounded-xl bg-white/5 p-4">
      <p className="mb-2 text-xs font-semibold uppercase text-[#21D4FF]">Geographic Distribution</p>
      <ComposableMap
        projectionConfig={{ scale: 140 }}
        style={{ width: "100%", height: "300px" }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const name: string = geo.properties.name ?? "";
              const entry = regionMap.get(name.toLowerCase());
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={entry ? getColor(entry.percentage) : "rgba(255,255,255,0.05)"}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth={0.5}
                  onMouseEnter={(e) => {
                    if (!entry) return;
                    setTooltip({
                      x: e.clientX,
                      y: e.clientY,
                      content: `${name}: ${entry.count} tickets (${entry.percentage}%)`,
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                  style={{
                    hover: { fill: "#21D4FF", outline: "none" },
                    pressed: { outline: "none" },
                    default: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 rounded bg-[#1a2040] border border-[#4D21FF] px-3 py-2 text-xs text-[#21D4FF] shadow-lg"
          style={{ left: tooltip.x + 12, top: tooltip.y - 28 }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
}
