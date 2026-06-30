"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Preset = "7d" | "30d" | "90d" | "custom";

const PRESETS: { label: string; value: Preset }[] = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
  { label: "Custom", value: "custom" },
];

export function DateRangePicker() {
  const router = useRouter();
  const params = useSearchParams();
  const preset = (params.get("range") as Preset) ?? "30d";
  const from = params.get("from") ?? "";
  const to = params.get("to") ?? "";

  function setPreset(value: Preset) {
    const sp = new URLSearchParams(params.toString());
    sp.set("range", value);
    if (value !== "custom") {
      sp.delete("from");
      sp.delete("to");
    }
    router.replace(`?${sp.toString()}`);
  }

  function setCustom(key: "from" | "to", value: string) {
    const sp = new URLSearchParams(params.toString());
    sp.set(key, value);
    sp.set("range", "custom");
    router.replace(`?${sp.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex overflow-hidden rounded-xl border border-white/10">
        {PRESETS.map(({ label, value }) => (
          <button
            key={value}
            type="button"
            onClick={() => setPreset(value)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              preset === value
                ? "bg-[#4D21FF] text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {preset === "custom" && (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <input
            type="date"
            value={from}
            onChange={(e) => setCustom("from", e.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#4D21FF] focus:outline-none [color-scheme:dark]"
            aria-label="From date"
          />
          <span>–</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setCustom("to", e.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#4D21FF] focus:outline-none [color-scheme:dark]"
            aria-label="To date"
          />
        </div>
      )}
    </div>
  );
}
