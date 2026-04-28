"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import Image from "next/image";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const MIN_WIDTH = 400;
const MIN_HEIGHT = 400;

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
  const [error, setError] = useState<string | null>(null);

  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file]
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const validate = (f: File): Promise<string | null> =>
    new Promise((resolve) => {
      if (!ACCEPTED_TYPES.includes(f.type)) {
        return resolve(`Unsupported file type. Use JPEG, PNG, WebP, or GIF.`);
      }
      if (f.size > MAX_SIZE_BYTES) {
        return resolve(`File too large. Maximum size is ${MAX_SIZE_MB} MB.`);
      }
      const url = URL.createObjectURL(f);
      const img = new window.Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        if (img.width < MIN_WIDTH || img.height < MIN_HEIGHT) {
          resolve(
            `Image too small. Minimum dimensions are ${MIN_WIDTH}×${MIN_HEIGHT} px.`
          );
        } else {
          resolve(null);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve("Could not read image dimensions.");
      };
      img.src = url;
    });

  const handleFile = async (f: File) => {
    const msg = await validate(f);
    if (msg) {
      setError(msg);
      onChange(null);
    } else {
      setError(null);
      onChange(f);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
    // reset so the same file can be re-selected after removal
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleClick = () => inputRef.current?.click();

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setError(null);
    onChange(null);
  };

  const heightClass = size === "small" ? "h-24" : "h-48";

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg ${heightClass} w-full cursor-pointer transition-colors overflow-hidden ${
          error
            ? "border-red-500 hover:border-red-400"
            : "border-gray-700 hover:border-blue-600"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={handleFileChange}
          className="hidden"
        />

        {file ? (
          <div className="relative w-full h-full group">
            <Image
              src={previewUrl!}
              alt="Upload preview"
              fill
              unoptimized
              className="object-cover"
              sizes="100vw"
            />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove image"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-center px-4">Drag or drop an image, or browse</p>
            <p className="text-xs text-gray-600 mt-1">
              JPEG, PNG, WebP, GIF · max {MAX_SIZE_MB} MB · min {MIN_WIDTH}×{MIN_HEIGHT} px
            </p>
            {recommendedSize && (
              <p className="text-xs text-gray-600 mt-0.5">Recommended: {recommendedSize}</p>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
