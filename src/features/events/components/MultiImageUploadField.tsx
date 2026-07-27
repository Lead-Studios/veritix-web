"use client";

import React, { useState, useCallback, useId } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { X, GripVertical, ImagePlus } from "lucide-react";

const MAX_IMAGES = 6;
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export interface UploadedImage {
  /** Stable key for React list rendering */
  key: string;
  /** URL returned by the server (or a data-URL preview before upload) */
  url: string;
  /** Original file object, present only before the upload completes */
  file?: File;
  /** Preview data-URL for display */
  preview: string;
  uploading: boolean;
  error?: string;
}

interface MultiImageUploadFieldProps {
  /** Called whenever the ordered list of uploaded URLs changes */
  onChange: (urls: string[]) => void;
  /** Optional event ID used for the upload endpoint */
  eventId?: string;
}

let _keyCounter = 0;
function nextKey() {
  return `img-${++_keyCounter}`;
}

export function MultiImageUploadField({
  onChange,
  eventId,
}: MultiImageUploadFieldProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragSourceIndex, setDragSourceIndex] = useState<number | null>(null);
  const dropzoneId = useId();

  // Notify parent whenever images change
  const notify = useCallback(
    (next: UploadedImage[]) => {
      onChange(next.filter((i) => i.url && !i.uploading).map((i) => i.url));
    },
    [onChange],
  );

  const uploadFile = useCallback(
    async (file: File, key: string) => {
      if (!eventId) {
        // No event ID yet — store preview only, parent will upload later
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages((prev) => {
            const next = prev.map((img) =>
              img.key === key
                ? { ...img, url: reader.result as string, uploading: false }
                : img,
            );
            notify(next);
            return next;
          });
        };
        reader.readAsDataURL(file);
        return;
      }

      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await fetch(`/api/events/${eventId}/images`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error(`Upload failed (${res.status})`);
        const { imageUrl } = (await res.json()) as { imageUrl: string };

        setImages((prev) => {
          const next = prev.map((img) =>
            img.key === key ? { ...img, url: imageUrl, uploading: false } : img,
          );
          notify(next);
          return next;
        });
      } catch (err) {
        setImages((prev) =>
          prev.map((img) =>
            img.key === key
              ? {
                  ...img,
                  uploading: false,
                  error:
                    err instanceof Error ? err.message : "Upload failed",
                }
              : img,
          ),
        );
      }
    },
    [eventId, notify],
  );

  const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      const remaining = MAX_IMAGES - images.length;
      if (remaining <= 0) return;

      const toAdd = accepted.slice(0, remaining);

      const newEntries: UploadedImage[] = toAdd.map((file) => ({
        key: nextKey(),
        url: "",
        file,
        preview: URL.createObjectURL(file),
        uploading: true,
      }));

      setImages((prev) => [...prev, ...newEntries]);

      newEntries.forEach((entry) => {
        if (entry.file) uploadFile(entry.file, entry.key);
      });

      if (rejected.length > 0) {
        // Silently ignore rejections for now; could show a toast
      }
    },
    [images.length, uploadFile],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
    },
    maxSize: MAX_SIZE_BYTES,
    multiple: true,
    disabled: images.length >= MAX_IMAGES,
  });

  const removeImage = (key: string) => {
    setImages((prev) => {
      const next = prev.filter((img) => img.key !== key);
      notify(next);
      return next;
    });
  };

  // ── Drag-and-drop reordering ──────────────────────────────────────────────
  const handleDragStart = (index: number) => {
    setDragSourceIndex(index);
  };

  const handleDragEnter = (index: number) => {
    setDragOverIndex(index);
  };

  const handleDrop = (dropIndex: number) => {
    if (dragSourceIndex === null || dragSourceIndex === dropIndex) {
      setDragOverIndex(null);
      setDragSourceIndex(null);
      return;
    }

    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragSourceIndex, 1);
      next.splice(dropIndex, 0, moved);
      notify(next);
      return next;
    });

    setDragOverIndex(null);
    setDragSourceIndex(null);
  };

  const handleDragEnd = () => {
    setDragOverIndex(null);
    setDragSourceIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Thumbnails grid */}
      {images.length > 0 && (
        <ul
          className="grid grid-cols-3 gap-3"
          aria-label="Uploaded images — drag to reorder"
        >
          {images.map((img, index) => (
            <li
              key={img.key}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(index)}
              onDragEnd={handleDragEnd}
              className={`relative rounded-xl overflow-hidden border-2 transition-all cursor-grab active:cursor-grabbing ${
                dragOverIndex === index
                  ? "border-[#4D21FF] scale-105"
                  : "border-white/10"
              } ${dragSourceIndex === index ? "opacity-50" : "opacity-100"}`}
              aria-label={`Image ${index + 1}${index === 0 ? " (cover)" : ""}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.preview}
                alt={`Upload preview ${index + 1}`}
                className="w-full aspect-square object-cover"
              />

              {/* Cover badge */}
              {index === 0 && (
                <span className="absolute bottom-1 left-1 rounded px-1.5 py-0.5 text-[10px] font-bold bg-[#4D21FF] text-white">
                  Cover
                </span>
              )}

              {/* Upload spinner */}
              {img.uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                  <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}

              {/* Error overlay */}
              {img.error && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-red-900/70 rounded-xl px-2 text-center"
                  title={img.error}
                >
                  <span className="text-xs text-red-200 line-clamp-3">{img.error}</span>
                </div>
              )}

              {/* Drag handle */}
              <button
                type="button"
                className="absolute top-1 left-1 p-1 rounded bg-black/40 text-white/60 hover:text-white cursor-grab"
                aria-hidden="true"
                tabIndex={-1}
              >
                <GripVertical className="w-3 h-3" />
              </button>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeImage(img.key)}
                className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white hover:bg-red-600 transition-colors"
                aria-label={`Remove image ${index + 1}`}
              >
                <X className="w-3 h-3" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Drop zone — hidden when limit reached */}
      {images.length < MAX_IMAGES && (
        <div
          {...getRootProps()}
          id={dropzoneId}
          className={`w-full p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-[#4D21FF] bg-[#4D21FF]/10"
              : "border-white/20 hover:border-white/40"
          }`}
        >
          <input {...getInputProps()} aria-labelledby={dropzoneId} />
          <div className="flex flex-col items-center gap-2 text-white/60">
            <ImagePlus className="w-8 h-8" />
            <p className="text-sm font-medium">
              {isDragActive
                ? "Drop images here…"
                : `Drag & drop or click to add images (${images.length}/${MAX_IMAGES})`}
            </p>
            <p className="text-xs text-white/40">PNG, JPG, WEBP — max 5 MB each</p>
          </div>
        </div>
      )}

      {images.length >= MAX_IMAGES && (
        <p className="text-xs text-white/40 text-center">
          Maximum of {MAX_IMAGES} images reached. Remove one to add another.
        </p>
      )}
    </div>
  );
}
