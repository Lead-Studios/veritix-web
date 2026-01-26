"use client";

import React, { useRef } from "react";
import { EventFormData } from "@/app/(protected)/events/create/page";
import ImageUpload from "../ui/ImageUpload";

interface BasicInformationProps {
  formData: EventFormData;
  updateFormData: (updates: Partial<EventFormData>) => void;
}

export default function BasicInformation({
  formData,
  updateFormData,
}: BasicInformationProps) {
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleCoverImageChange = (file: File | null) => {
    updateFormData({ coverImage: file });
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      updateFormData({ gallery: [...formData.gallery, ...files] });
    }
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
            Event Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => updateFormData({ title: e.target.value })}
            placeholder="Give your event a catchy title"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>

        {/* Event Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Event Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
            placeholder="Describe your event in details"
            rows={4}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
          />
        </div>

        {/* Event Cover Image */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Event Cover Image
          </label>
          <ImageUpload
            file={formData.coverImage}
            onChange={handleCoverImageChange}
            aspectRatio="wide"
            recommendedSize="1920 x 630 pixels"
          />
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
