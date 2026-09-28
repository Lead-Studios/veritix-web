"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface TabItem {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (value: string) => void;
  className?: string;
  tabListClassName?: string;
}

/**
 * Tabs — an accessible tabs widget following the ARIA tabs pattern.
 *
 * - Each tab button has `role="tab"` and `aria-selected`.
 * - The tab list has `role="tablist"`.
 * - Arrow keys move focus and select between tabs.
 * - Home / End jump to first / last tab.
 * - Disabled tabs are skipped during keyboard navigation.
 */
export function Tabs({
  tabs,
  activeTab,
  onTabChange,
  className,
  tabListClassName,
}: TabsProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const enabledTabs = tabs.filter((t) => !t.disabled);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const currentEnabledIndex = enabledTabs.findIndex(
      (t) => t.value === tabs[index].value,
    );

    let nextEnabledTab: TabItem | undefined;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nextEnabledTab =
        enabledTabs[(currentEnabledIndex + 1) % enabledTabs.length];
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      nextEnabledTab =
        enabledTabs[
          (currentEnabledIndex - 1 + enabledTabs.length) % enabledTabs.length
        ];
    } else if (e.key === "Home") {
      e.preventDefault();
      nextEnabledTab = enabledTabs[0];
    } else if (e.key === "End") {
      e.preventDefault();
      nextEnabledTab = enabledTabs[enabledTabs.length - 1];
    }

    if (nextEnabledTab) {
      onTabChange(nextEnabledTab.value);
      const nextIndex = tabs.findIndex((t) => t.value === nextEnabledTab!.value);
      tabRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        role="tablist"
        className={cn(
          "flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1",
          tabListClassName,
        )}
      >
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.value}`}
              id={`tab-${tab.value}`}
              disabled={tab.disabled}
              tabIndex={isActive ? 0 : -1}
              onClick={() => !tab.disabled && onTabChange(tab.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={cn(
                "relative flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                isActive
                  ? "bg-gradient-to-r from-[#4d21ff] to-[#21d4ff] text-white shadow"
                  : "bg-transparent text-gray-400 hover:text-white",
                tab.disabled && "cursor-not-allowed opacity-40",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
