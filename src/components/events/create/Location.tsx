"use client";

import React, { useEffect, useRef, useState } from "react";
import { EventFormData } from "@/app/(protected)/events/create/page";
import RadioButton from "../ui/RadioButton";
import type { CreateEventFormErrors } from "@/lib/createEventValidation";
import { searchLocations, type LocationResult } from "@/lib/locationSearch";

interface LocationProps {
  formData: EventFormData;
  updateFormData: (updates: Partial<EventFormData>) => void;
  errors?: CreateEventFormErrors;
}

export default function Location({ formData, updateFormData, errors = {} }: LocationProps) {
  const needsVenue = formData.eventType !== "online";
  const showStreamingUrl =
    formData.eventType === "online" || formData.eventType === "hybrid";

  // ---- Address autocomplete state ----
  const [suggestions, setSuggestions] = useState<LocationResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const skipNextSearch = useRef(false);

  // Debounced search whenever the address text changes
  useEffect(() => {
    if (skipNextSearch.current) {
      // Skip the next search after a suggestion is selected programmatically
      skipNextSearch.current = false;
      return;
    }
    const query = formData.address.trim();
    if (query.length < 3) {
      setSuggestions([]);
      setSearched(false);
      setIsSearching(false);
      return;
    }
    let cancelled = false;
    setIsSearching(true);
    const handle = setTimeout(async () => {
      try {
        const results = await searchLocations(query);
        if (cancelled) return;
        setSuggestions(results);
        setSearched(true);
        setActiveIdx(-1);
      } catch {
        if (!cancelled) {
          setSuggestions([]);
          setSearched(true);
        }
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [formData.address]);

  // Click-outside dismissal
  useEffect(() => {
    const handleDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, []);

  const handleSelectSuggestion = (s: LocationResult) => {
    skipNextSearch.current = true;
    updateFormData({
      address: s.address.street || s.displayName,
      city: s.address.city || formData.city,
      latitude: s.lat,
      longitude: s.lng,
    });
    setIsOpen(false);
    setSuggestions([]);
    setActiveIdx(-1);
  };

  const handleAddressChange = (value: string) => {
    // Manual entry — clear previously-selected coordinates so they don't
    // misrepresent the freshly-typed address.
    updateFormData({
      address: value,
      latitude: null,
      longitude: null,
    });
    setIsOpen(true);
  };

  const handleAddressKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[activeIdx]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const showNoResultsHint =
    isOpen &&
    !isSearching &&
    searched &&
    suggestions.length === 0 &&
    formData.address.trim().length >= 3;

  return (
    <section className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
          3
        </div>
        <h2 className="text-2xl font-bold text-white">Location</h2>
      </div>

      <div className="space-y-6">
        {/* Event Type */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Event Type
          </label>
          <div className="flex gap-4">
            <RadioButton
              id="physical"
              name="eventType"
              value="physical"
              checked={formData.eventType === "physical"}
              onChange={(e) =>
                updateFormData({ eventType: e.target.value as "physical" })
              }
              label="Physical Event"
            />
            <RadioButton
              id="online"
              name="eventType"
              value="online"
              checked={formData.eventType === "online"}
              onChange={(e) =>
                updateFormData({ eventType: e.target.value as "online" })
              }
              label="Online Event"
            />
            <RadioButton
              id="hybrid"
              name="eventType"
              value="hybrid"
              checked={formData.eventType === "hybrid"}
              onChange={(e) =>
                updateFormData({ eventType: e.target.value as "hybrid" })
              }
              label="Hybrid Event"
            />
          </div>
        </div>

        {/* Venue Name */}
        {needsVenue && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Venue Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.venueName}
              onChange={(e) => updateFormData({ venueName: e.target.value })}
              placeholder="Enter Venue name"
              aria-invalid={!!errors.venueName}
              className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${errors.venueName ? "border-red-500" : "border-gray-700"}`}
            />
            {errors.venueName && <p role="alert" className="mt-1 text-xs text-red-400">{errors.venueName}</p>}
          </div>
        )}

        {/* Address */}
        {needsVenue && (
          <div>
            <label
              htmlFor="event-address"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Address <span className="text-red-400">*</span>
            </label>
          <div className="relative" ref={wrapperRef}>
            <input
              id="event-address"
              type="text"
              value={formData.address}
              onChange={(e) => handleAddressChange(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0 || formData.address.trim().length >= 3) {
                  setIsOpen(true);
                }
              }}
              onKeyDown={handleAddressKeyDown}
              placeholder="Start typing an address…"
              autoComplete="off"
              role="combobox"
              aria-expanded={isOpen}
              aria-autocomplete="list"
              aria-controls="address-suggestions"
              aria-activedescendant={
                activeIdx >= 0 ? `address-suggestion-${activeIdx}` : undefined
              }
              aria-invalid={!!errors.address}
              aria-describedby={errors.address ? "error-address" : undefined}
              className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${errors.address ? "border-red-500" : "border-gray-700"}`}
            />
            {isSearching && (
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400"
                aria-live="polite"
              >
                Searching…
              </span>
            )}
            {isOpen && suggestions.length > 0 && (
              <ul
                id="address-suggestions"
                role="listbox"
                className="absolute z-20 left-0 right-0 mt-1 max-h-64 overflow-y-auto bg-gray-900 border border-gray-700 rounded-lg shadow-lg"
              >
                {suggestions.map((s, idx) => (
                  <li
                    key={`${s.lat},${s.lng},${idx}`}
                    id={`address-suggestion-${idx}`}
                    role="option"
                    aria-selected={idx === activeIdx}
                    onMouseDown={(e) => {
                      // Use mouseDown so we beat the input blur
                      e.preventDefault();
                      handleSelectSuggestion(s);
                    }}
                    onMouseEnter={() => setActiveIdx(idx)}
                    className={`px-4 py-2 text-sm text-white cursor-pointer ${idx === activeIdx ? "bg-blue-700" : "hover:bg-gray-800"}`}
                  >
                    {s.displayName}
                  </li>
                ))}
              </ul>
            )}
            {showNoResultsHint && (
              <p className="mt-1 text-xs text-gray-400">
                No matches found — you can keep typing the address manually.
              </p>
            )}
          </div>
          {errors.address && (
            <p id="error-address" role="alert" className="mt-1 text-xs text-red-400">
              {errors.address}
            </p>
          )}
          </div>
        )}

        {/* City, State, Zip Code */}
        {needsVenue && (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                City <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => updateFormData({ city: e.target.value })}
                placeholder="City"
                aria-invalid={!!errors.city}
                className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${errors.city ? "border-red-500" : "border-gray-700"}`}
              />
              {errors.city && <p role="alert" className="mt-1 text-xs text-red-400">{errors.city}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                State
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => updateFormData({ state: e.target.value })}
                placeholder="State"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Zip Code
              </label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => updateFormData({ zipCode: e.target.value })}
                placeholder="Zip Code"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Streaming URL — online & hybrid only */}
        {showStreamingUrl && (
          <div>
            <label
              htmlFor="event-streaming-url"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Streaming URL <span className="text-red-400">*</span>
            </label>
            <input
              id="event-streaming-url"
              type="url"
              inputMode="url"
              value={formData.streamingUrl}
              onChange={(e) => updateFormData({ streamingUrl: e.target.value })}
              placeholder="https://zoom.us/j/… or https://meet.google.com/…"
              aria-invalid={!!errors.streamingUrl}
              aria-describedby={
                errors.streamingUrl ? "error-streaming-url" : "hint-streaming-url"
              }
              className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${errors.streamingUrl ? "border-red-500" : "border-gray-700"}`}
            />
            <p id="hint-streaming-url" className="mt-1 text-xs text-gray-500">
              Provide a link attendees will use to join the event (Zoom, Meet, YouTube Live, etc.).
            </p>
            {errors.streamingUrl && (
              <p id="error-streaming-url" role="alert" className="mt-1 text-xs text-red-400">
                {errors.streamingUrl}
              </p>
            )}
          </div>
        )}

        {/* Map Placeholder */}
        {needsVenue && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Map
            </label>
            <div className="w-full h-64 bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-600 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p className="text-gray-500 text-sm">
                Map integration will appear here
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
