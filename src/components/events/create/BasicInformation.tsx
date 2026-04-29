"use client";

import React from "react";
import { EventFormData } from "@/app/(protected)/events/create/page";
import ImageUpload from "../ui/ImageUpload";
import type { CreateEventFormErrors } from "@/lib/createEventValidation";

interface BasicInformationProps {
  formData: EventFormData;
  updateFormData: (updates: Partial<EventFormData>) => void;
  errors?: CreateEventFormErrors;
}

export default function BasicInformation({
  formData,
  updateFormData,
  errors = {},
}: BasicInformationProps) {
  const handleCoverImageChange = (file: File | null) => {
    updateFormData({ coverImage: file });
  };

  return (
    <section className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
          1
        </div>
        <h2 className="text-2xl font-bold text-white">Basic Information</h2>
      </div>

      <div className="space-y-6">
        {/* Event Title */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Event Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => updateFormData({ title: e.target.value })}
            placeholder="Give your event a catchy title"
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? "error-title" : undefined}
            className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${errors.title ? "border-red-500" : "border-gray-700"}`}
          />
          {errors.title && (
            <p id="error-title" role="alert" className="mt-1 text-xs text-red-400">{errors.title}</p>
          )}
        </div>

        {/* Event Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Event Description <span className="text-red-400">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
            placeholder="Describe your event in details"
            rows={4}
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? "error-description" : undefined}
            className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none ${errors.description ? "border-red-500" : "border-gray-700"}`}
          />
          {errors.description && (
            <p id="error-description" role="alert" className="mt-1 text-xs text-red-400">{errors.description}</p>
          )}
        </div>

        {/* Event Cover Image */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Event Cover Image <span className="text-red-400">*</span>
          </label>
          <ImageUpload
            file={formData.coverImage}
            onChange={handleCoverImageChange}
            aspectRatio="wide"
            recommendedSize="1920 x 630 pixels"
          />
          {errors.coverImage && (
            <p role="alert" className="mt-1 text-xs text-red-400">{errors.coverImage}</p>
          )}
        </div>

        {/* Event Gallery */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Event Gallery (Optional)
          </label>
          <div className="grid grid-cols-3 gap-4">
            {[0, 1, 2].map((index) => (
              <ImageUpload
                key={index}
                file={formData.gallery[index] || null}
                onChange={(file) => {
                  const newGallery = [...formData.gallery];
                  if (file) {
                    newGallery[index] = file;
                  } else {
                    newGallery.splice(index, 1);
                  }
                  updateFormData({ gallery: newGallery });
                }}
                aspectRatio="square"
                size="small"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
