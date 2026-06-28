"use client";

import { useState } from "react";
import { HiOutlineSelector } from "react-icons/hi";

interface EventOption {
  id: string;
  name: string;
  date: string;
}

interface EventSelectorDropdownProps {
  events: EventOption[];
  selectedEventId: string | null;
  onSelect: (eventId: string) => void;
}

export function EventSelectorDropdown({
  events,
  selectedEventId,
  onSelect,
}: EventSelectorDropdownProps) {
  const [open, setOpen] = useState(false);

  const selected = events.find((e) => e.id === selectedEventId);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white hover:border-white/20 transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={selected ? "text-white" : "text-gray-500"}>
          {selected ? selected.name : "Select an event…"}
        </span>
        <HiOutlineSelector className="w-4 h-4 text-gray-400 flex-shrink-0" />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-xl border border-white/10 bg-[#020718] shadow-xl overflow-hidden">
          <ul role="listbox" className="max-h-60 overflow-y-auto">
            {events.map((event) => {
              const isSelected = event.id === selectedEventId;
              return (
                <li
                  key={event.id}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onSelect(event.id);
                    setOpen(false);
                  }}
                  className={`px-4 py-3 text-sm cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-[#4D21FF]/20 text-[#4D21FF]"
                      : "text-gray-300 hover:bg-white/5"
                  }`}
                >
                  <p className="font-medium">{event.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                </li>
              );
            })}
          </ul>
          {events.length === 0 && (
            <p className="px-4 py-6 text-sm text-gray-500 text-center">No events available</p>
          )}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
      )}
    </div>
  );
}
