"use client";

import React from "react";
import { EventFormData } from "@/app/(protected)/events/create/page";
import RadioButton from "../ui/RadioButton";
import type { CreateEventFormErrors } from "@/lib/createEventValidation";

interface LocationProps {
  formData: EventFormData;
  updateFormData: (updates: Partial<EventFormData>) => void;
  errors?: CreateEventFormErrors;
}

export default function Location({ formData, updateFormData, errors = {} }: LocationProps) {
  const needsVenue = formData.eventType !== "online";
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
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Venue Name {needsVenue && <span className="text-red-400">*</span>}
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

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Address
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => updateFormData({ address: e.target.value })}
            placeholder="Enter full address"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>

        {/* City, State, Zip Code */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              City {needsVenue && <span className="text-red-400">*</span>}
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

        {/* Map Placeholder */}
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
      </div>
    </section>
  );
}
