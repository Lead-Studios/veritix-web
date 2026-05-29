"use client";

import React, { useMemo } from "react";
import { EventFormData } from "@/app/(protected)/events/create/page";
import RadioButton from "../ui/RadioButton";
import type { CreateEventFormErrors } from "@/lib/createEventValidation";
import {
  DEFAULT_RECURRENCE,
  PREVIEW_LIMIT,
  dayLabel,
  describeRecurrence,
  formatOccurrenceLabel,
  generateOccurrences,
  type CustomUnit,
  type RecurrenceConfig,
  type RecurrenceEndType,
  type RecurrenceFrequency,
} from "@/lib/recurrence";

interface RecurrenceProps {
  formData: EventFormData;
  updateFormData: (updates: Partial<EventFormData>) => void;
  errors?: CreateEventFormErrors;
}

const FREQUENCY_OPTIONS: Array<{
  value: RecurrenceFrequency;
  label: string;
  description: string;
}> = [
  { value: "none", label: "None", description: "Single occurrence (default)" },
  { value: "daily", label: "Daily", description: "Every day" },
  { value: "weekly", label: "Weekly", description: "Same weekday each week" },
  { value: "monthly", label: "Monthly", description: "Same day each month" },
  { value: "custom", label: "Custom", description: "Pick your own pattern" },
];

const WEEK_DAYS = [0, 1, 2, 3, 4, 5, 6] as const;

export default function Recurrence({
  formData,
  updateFormData,
  errors = {},
}: RecurrenceProps) {
  const recurrence: RecurrenceConfig = formData.recurrence ?? DEFAULT_RECURRENCE;
  const isRepeating = recurrence.frequency !== "none";

  const update = (patch: Partial<RecurrenceConfig>) => {
    updateFormData({ recurrence: { ...recurrence, ...patch } });
  };

  const setFrequency = (frequency: RecurrenceFrequency) => {
    if (frequency === "none") {
      // Reset to defaults when skipping recurrence.
      updateFormData({ recurrence: { ...DEFAULT_RECURRENCE } });
      return;
    }
    update({ frequency });
  };

  const toggleDay = (day: number) => {
    const set = new Set(recurrence.daysOfWeek);
    if (set.has(day)) set.delete(day);
    else set.add(day);
    update({ daysOfWeek: [...set].sort((a, b) => a - b) });
  };

  const occurrences = useMemo(
    () =>
      isRepeating && formData.startDate
        ? generateOccurrences(formData.startDate, recurrence, PREVIEW_LIMIT)
        : [],
    [formData.startDate, recurrence, isRepeating]
  );

  const showWeekdayPicker =
    recurrence.frequency === "weekly" ||
    (recurrence.frequency === "custom" && recurrence.customUnit === "week");

  const customUnitLabel: Record<CustomUnit, string> = {
    day: "day(s)",
    week: "week(s)",
    month: "month(s)",
  };

  return (
    <section
      className="bg-gray-900 rounded-xl p-6 border border-gray-800"
      aria-labelledby="recurrence-heading"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
          2
        </div>
        <h2
          id="recurrence-heading"
          className="text-2xl font-bold text-white"
        >
          Recurrence
        </h2>
        <span className="ml-2 text-xs uppercase tracking-wide text-gray-500">
          Optional
        </span>
      </div>

      <p className="text-sm text-gray-400 mb-6">
        Run this event on a repeating schedule. We&apos;ll create one event per
        occurrence on the backend. Skip this step to keep it as a single event.
      </p>

      {/* Frequency picker */}
      <div className="mb-6">
        <span className="block text-sm font-medium text-gray-300 mb-3">
          Frequency
        </span>
        <div
          role="radiogroup"
          aria-label="Recurrence frequency"
          className="grid grid-cols-2 sm:grid-cols-3 gap-3"
        >
          {FREQUENCY_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              htmlFor={`recurrence-${opt.value}`}
              className={`flex flex-col gap-1 rounded-lg border px-4 py-3 cursor-pointer transition-colors ${
                recurrence.frequency === opt.value
                  ? "border-blue-500 bg-blue-950/30"
                  : "border-gray-700 bg-gray-800 hover:border-gray-600"
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id={`recurrence-${opt.value}`}
                  name="recurrence-frequency"
                  value={opt.value}
                  checked={recurrence.frequency === opt.value}
                  onChange={() => setFrequency(opt.value)}
                  className="sr-only"
                />
                <span
                  className={`w-4 h-4 rounded-full border-2 ${
                    recurrence.frequency === opt.value
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-500"
                  }`}
                  aria-hidden="true"
                />
                <span className="text-sm font-semibold text-white">
                  {opt.label}
                </span>
              </div>
              <span className="text-xs text-gray-400">{opt.description}</span>
            </label>
          ))}
        </div>
      </div>

      {isRepeating && (
        <div className="space-y-6">
          {/* Custom controls */}
          {recurrence.frequency === "custom" && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="recurrence-interval"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Repeat every
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="recurrence-interval"
                    type="number"
                    min={1}
                    max={365}
                    value={recurrence.interval}
                    onChange={(e) =>
                      update({
                        interval: Math.max(
                          1,
                          parseInt(e.target.value || "1", 10) || 1
                        ),
                      })
                    }
                    aria-invalid={!!errors["recurrence.interval"]}
                    className={`w-24 bg-gray-800 border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                      errors["recurrence.interval"]
                        ? "border-red-500"
                        : "border-gray-700"
                    }`}
                  />
                  <select
                    aria-label="Custom recurrence unit"
                    value={recurrence.customUnit}
                    onChange={(e) =>
                      update({ customUnit: e.target.value as CustomUnit })
                    }
                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="day">{customUnitLabel.day}</option>
                    <option value="week">{customUnitLabel.week}</option>
                    <option value="month">{customUnitLabel.month}</option>
                  </select>
                </div>
                {errors["recurrence.interval"] && (
                  <p role="alert" className="mt-1 text-xs text-red-400">
                    {errors["recurrence.interval"]}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Day-of-week picker (weekly + custom-week) */}
          {showWeekdayPicker && (
            <div>
              <span className="block text-sm font-medium text-gray-300 mb-2">
                Repeat on
                <span className="ml-2 text-xs text-gray-500">
                  Leave empty to use the start date&apos;s weekday
                </span>
              </span>
              <div className="flex flex-wrap gap-2">
                {WEEK_DAYS.map((d) => {
                  const selected = recurrence.daysOfWeek.includes(d);
                  return (
                    <button
                      type="button"
                      key={d}
                      onClick={() => toggleDay(d)}
                      aria-pressed={selected}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        selected
                          ? "bg-blue-600 text-white border-blue-500"
                          : "bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-500"
                      }`}
                    >
                      {dayLabel(d)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* End condition */}
          <div>
            <span className="block text-sm font-medium text-gray-300 mb-3">
              Ends
            </span>
            <div className="flex flex-wrap items-center gap-4">
              <RadioButton
                id="recurrence-end-never"
                name="recurrence-end"
                value="never"
                checked={recurrence.endType === "never"}
                onChange={() =>
                  update({ endType: "never" as RecurrenceEndType })
                }
                label="Never"
              />
              <div className="flex items-center gap-2">
                <RadioButton
                  id="recurrence-end-count"
                  name="recurrence-end"
                  value="count"
                  checked={recurrence.endType === "count"}
                  onChange={() =>
                    update({ endType: "count" as RecurrenceEndType })
                  }
                  label="After"
                />
                <input
                  type="number"
                  min={1}
                  max={365}
                  aria-label="Number of occurrences"
                  value={recurrence.count}
                  disabled={recurrence.endType !== "count"}
                  onChange={(e) =>
                    update({
                      count: Math.max(
                        1,
                        parseInt(e.target.value || "1", 10) || 1
                      ),
                    })
                  }
                  aria-invalid={!!errors["recurrence.count"]}
                  className={`w-20 bg-gray-800 border rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50 ${
                    errors["recurrence.count"]
                      ? "border-red-500"
                      : "border-gray-700"
                  }`}
                />
                <span className="text-sm text-gray-400">occurrences</span>
              </div>
              <div className="flex items-center gap-2">
                <RadioButton
                  id="recurrence-end-date"
                  name="recurrence-end"
                  value="date"
                  checked={recurrence.endType === "date"}
                  onChange={() =>
                    update({ endType: "date" as RecurrenceEndType })
                  }
                  label="On date"
                />
                <input
                  type="date"
                  aria-label="End date"
                  min={formData.startDate || undefined}
                  value={recurrence.until}
                  disabled={recurrence.endType !== "date"}
                  onChange={(e) => update({ until: e.target.value })}
                  aria-invalid={!!errors["recurrence.until"]}
                  className={`bg-gray-800 border rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50 [color-scheme:dark] ${
                    errors["recurrence.until"]
                      ? "border-red-500"
                      : "border-gray-700"
                  }`}
                />
              </div>
            </div>
            {errors["recurrence.count"] && (
              <p role="alert" className="mt-2 text-xs text-red-400">
                {errors["recurrence.count"]}
              </p>
            )}
            {errors["recurrence.until"] && (
              <p role="alert" className="mt-2 text-xs text-red-400">
                {errors["recurrence.until"]}
              </p>
            )}
          </div>

          {/* Preview */}
          <div
            aria-live="polite"
            className="rounded-lg border border-gray-700 bg-gray-800/60 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-white">
                Upcoming occurrences
              </p>
              <span className="text-xs text-gray-400">
                {describeRecurrence(recurrence)}
              </span>
            </div>
            {!formData.startDate ? (
              <p className="text-xs text-gray-500">
                Set a start date in the next step to preview occurrences.
              </p>
            ) : occurrences.length === 0 ? (
              <p className="text-xs text-gray-500">
                No occurrences match the current pattern.
              </p>
            ) : (
              <ol
                className="space-y-1.5"
                aria-label={`Next ${occurrences.length} generated dates`}
              >
                {occurrences.map((d, idx) => (
                  <li
                    key={d.toISOString()}
                    className="flex items-center gap-3 text-sm text-gray-200"
                  >
                    <span className="w-6 text-xs text-gray-500 tabular-nums">
                      #{idx + 1}
                    </span>
                    <span>{formatOccurrenceLabel(d)}</span>
                  </li>
                ))}
              </ol>
            )}
            {occurrences.length === PREVIEW_LIMIT && (
              <p className="mt-3 text-xs text-gray-500">
                Showing the next {PREVIEW_LIMIT} occurrences. Additional
                occurrences will be generated on submission.
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
