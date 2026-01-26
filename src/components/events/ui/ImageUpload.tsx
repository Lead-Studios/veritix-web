"use client";

import React, { useRef } from "react";

interface ImageUploadProps {
  file: File | null;
  onChange: (file: File | null) => void;
  aspectRatio?: "wide" | "square";
  size?: "normal" | "small";
  recommendedSize?: string;
}

export default function ImageUpload({
  file,
  onChange,
  aspectRatio = "square",
  size = "normal",
  recommendedSize,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  const heightClass =
    size === "small"
      ? "h-24"
      : aspectRatio === "wide"
      ? "h-48"
      : "h-48";

  return (
    <div
      className={`relative border-2 border-dashed border-gray-700 rounded-lg ${heightClass} ${
        aspectRatio === "wide" ? "w-full" : "w-full"
      } cursor-pointer hover:border-blue-600 transition-colors overflow-hidden`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {file ? (
        <div className="relative w-full h-full group">
          <img
            src={URL.createObjectURL(file)}
            alt="Upload preview"
            className="w-full h-full object-cover"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <svg
            className="w-8 h-8 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-sm text-center px-4">
            Drag or drop an image, or browse
          </p>
          {recommendedSize && (
            <p className="text-xs text-gray-600 mt-1">
              Recommended size: {recommendedSize}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
