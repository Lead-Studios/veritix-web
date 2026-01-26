"use client";

import React from "react";
import { EventFormData } from "@/app/(protected)/events/create/page";

interface DateAndTimeProps {
  formData: EventFormData;
  updateFormData: (updates: Partial<EventFormData>) => void;
}

export default function DateAndTime({
  formData,
  updateFormData,
}: DateAndTimeProps) {
  return (
    <section className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
          2
        </div>
        <h2 className="text-2xl font-bold text-white">Date & Time</h2>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Start Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => updateFormData({ startDate: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [color-scheme:dark]"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            End Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => updateFormData({ endDate: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [color-scheme:dark]"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        {/* Start Time */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Start Time
          </label>
          <div className="relative">
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => updateFormData({ startTime: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [color-scheme:dark]"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* End Time */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            End Time
          </label>
          <div className="relative">
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => updateFormData({ endTime: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [color-scheme:dark]"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
