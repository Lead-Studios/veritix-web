"use client";
import { useState, useRef } from "react";

interface Props { currentUrl?: string; onUploaded?: (url: string) => void; }

export default function AvatarUpload({ currentUrl, onUploaded }: Props) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    const form = new FormData();
    form.append("avatar", file);
    const token = localStorage.getItem("auth_token") ?? "";
    const res = await fetch("/api/auth/avatar", { method: "POST", headers: { Authorization:  }, body: form });
    if (res.ok) { const { url } = await res.json(); onUploaded?.(url); }
    setUploading(false);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div onClick={() => ref.current?.click()}
        className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 cursor-pointer border-2 border-primary">
        {preview ? <img src={preview} alt="Avatar" className="w-full h-full object-cover" /> : <span className="flex items-center justify-center h-full text-gray-400 text-xs">Upload</span>}
      </div>
      <input ref={ref} type="file" accept="image/*" className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
      {uploading && <p className="text-xs text-gray-500">Uploading...</p>}
    </div>
  );
}
