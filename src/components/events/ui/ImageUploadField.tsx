"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';

interface ImageUploadFieldProps {
  onUploadComplete: (imageUrl: string) => void;
  eventId?: string;
}

export function ImageUploadField({ onUploadComplete, eventId }: ImageUploadFieldProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [fallback, setFallback] = useState(false);
  const [manualUrl, setManualUrl] = useState('');

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    setError(null);
    if (rejectedFiles.length > 0) {
      const message = rejectedFiles.map(({ file, errors }) => 
        `${file.name}: ${errors.map(e => e.message).join(', ')}`
      ).join('; ');
      setError(`Invalid file(s): ${message}`);
      return;
    }
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
  });

  const handleUpload = useCallback(async () => {
    if (!file) return;
    if (!eventId) {
      setError("Event ID is missing. Please save a draft first.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/api/events/${eventId}/image`, true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        setUploadProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      setUploading(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);
        onUploadComplete(response.imageUrl);
        setFile(null);
        setPreview(null);
      } else {
        setError(`Upload failed: ${xhr.statusText}. You can provide a URL below.`);
        setFallback(true);
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      setError('Upload failed due to a network error. You can provide a URL below.');
      setFallback(true);
    };

    const formData = new FormData();
    formData.append('image', file);
    xhr.send(formData);
  }, [file, eventId, onUploadComplete]);

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setError(null);
  };

  const handleManualUrlSubmit = () => {
    if (manualUrl.trim()) {
      onUploadComplete(manualUrl.trim());
      setFallback(false);
      setError(null);
    }
  };

  if (preview && file) {
    return (
      <div className="relative">
        <img src={preview} alt="Preview" className="w-full h-auto rounded-lg" />
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center rounded-lg">
            <div className="w-3/4 bg-gray-700 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
            </div>
            <p className="text-white mt-2">{Math.round(uploadProgress)}%</p>
          </div>
        )}
        {!uploading && (
          <div className="absolute top-2 right-2 flex gap-2">
            <button onClick={handleUpload} className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm">Upload</button>
            <button onClick={handleRemove} className="bg-red-600 text-white px-3 py-1 rounded-md text-sm">Remove</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`w-full p-6 border-2 border-dashed rounded-lg text-center cursor-pointer
          ${isDragActive ? 'border-blue-500 bg-blue-900 bg-opacity-20' : 'border-gray-600 hover:border-gray-500'}
          ${error ? 'border-red-500' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center">
          <svg className="w-10 h-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h10a4 4 0 014 4v5a4 4 0 01-4 4H7z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m-3-3h6"></path></svg>
          <p className="text-gray-400">
            {isDragActive ? 'Drop the image here...' : "Drag 'n' drop an image here, or click to select"}
          </p>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      {fallback && (
        <div className="mt-4">
          <p className="text-sm text-amber-400">Or provide an external image URL:</p>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              placeholder="https://example.com/image.png"
              className="flex-grow bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button onClick={handleManualUrlSubmit} className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm">Submit URL</button>
          </div>
        </div>
      )}
    </div>
  );
}