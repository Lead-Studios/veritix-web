"use client"

import { useState } from "react"

export default function ImageUpload({ value, onChange }) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      handleFile(file)
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      handleFile(file)
    }
  }

  const handleFile = (file) => {
    // In a real app, you would upload the file to a server
    // For this demo, we'll create a local URL
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        onChange(e.target.result)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div
      className={`mt-2 border-2 border-dashed rounded-md p-4 text-center ${
        isDragging ? "border-[#6366f1] bg-[#6366f1]/10" : "border-[#1e293b]"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {value ? (
        <div className="relative">
          <img
            src={value || "/placeholder.svg"}
            alt="Uploaded image"
            className="mx-auto h-40 object-cover rounded-md"
          />
          <button
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-xs"
          >
            ✕
          </button>
        </div>
      ) : (
        <div className="py-4">
          <UploadIcon className="mx-auto h-10 w-10 text-gray-400" />
          <p className="mt-2 text-sm text-gray-400">Drag and drop an image, or click to browse</p>
          <p className="mt-1 text-xs text-gray-500">Recommended size: 1200 x 630 pixels</p>
        </div>
      )}
      <input type="file" accept="image/*" className="hidden" id="image-upload" onChange={handleFileChange} />
      {!value && (
        <label
          htmlFor="image-upload"
          className="mt-2 inline-block px-4 py-2 bg-[#1e293b] text-white rounded-md text-sm cursor-pointer"
        >
          Select Image
        </label>
      )}
    </div>
  )
}

function UploadIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  )
}
