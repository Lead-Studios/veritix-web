"use client";

import React, { useMemo } from "react";
import { EventFormData } from "@/app/(protected)/events/create/page";
import type { CreateEventFormErrors } from "@/lib/createEventValidation";

interface DateAndTimeProps {
  formData: EventFormData;
  updateFormData: (updates: Partial<EventFormData>) => void;
  errors?: CreateEventFormErrors;
}

function getDateTimeError(
  startDate: string,
  startTime: string,
  endDate: string,
  endTime: string
): string | null {
  if (!startDate || !endDate) return null;
  const start = new Date(`${startDate}T${startTime || "00:00"}`);
  const end = new Date(`${endDate}T${endTime || "00:00"}`);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
  if (end <= start) return "End date/time must be after start date/time.";
  return null;
}

export default function DateAndTime({
  formData,
  updateFormData,
  errors = {},
}: DateAndTimeProps) {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const dateTimeError = useMemo(
    () =>
      getDateTimeError(
        formData.startDate,
        formData.startTime,
        formData.endDate,
        formData.endTime
      ),
    [formData.startDate, formData.startTime, formData.endDate, formData.endTime]
  );

  const displayError = errors.endDate || dateTimeError;

  return (
    <section className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
          2
        </div>
        <h2 className="text-2xl font-bold text-white">Date &amp; Time</h2>
      </div>

      <p className="text-xs text-gray-400 mb-4">
        All times are in your local timezone:{" "}
        <span className="text-blue-400 font-medium">{userTimezone}</span>
      </p>

      <div className="grid grid-cols-2 gap-6">
        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Start Date <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => updateFormData({ startDate: e.target.value })}
              aria-invalid={!!errors.startDate}
              className={`w-full bg-gray-800 border rounded-lg px-4 py-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [color-scheme:dark] ${errors.startDate ? "border-red-500" : "border-gray-700"}`}
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          {errors.startDate && <p role="alert" className="mt-1 text-xs text-red-400">{errors.startDate}</p>}
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            End Date <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.endDate}
              min={formData.startDate || undefined}
              onChange={(e) => updateFormData({ endDate: e.target.value })}
              aria-invalid={!!errors.endDate}
              className={`w-full bg-gray-800 border rounded-lg px-4 py-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [color-scheme:dark] ${errors.endDate ? "border-red-500" : "border-gray-700"}`}
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {/* Start Time */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Start Time <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => updateFormData({ startTime: e.target.value })}
              aria-invalid={!!errors.startTime}
              className={`w-full bg-gray-800 border rounded-lg px-4 py-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [color-scheme:dark] ${errors.startTime ? "border-red-500" : "border-gray-700"}`}
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          {errors.startTime && <p role="alert" className="mt-1 text-xs text-red-400">{errors.startTime}</p>}
        </div>

        {/* End Time */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            End Time <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => updateFormData({ endTime: e.target.value })}
              aria-invalid={!!errors.endTime}
              className={`w-full bg-gray-800 border rounded-lg px-4 py-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [color-scheme:dark] ${errors.endTime ? "border-red-500" : "border-gray-700"}`}
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          {errors.endTime && <p role="alert" className="mt-1 text-xs text-red-400">{errors.endTime}</p>}
        </div>
      </div>

      {displayError && (
        <p role="alert" className="mt-4 text-sm text-red-400">
          {displayError}
        </p>
      )}
    </section>
  );
}
