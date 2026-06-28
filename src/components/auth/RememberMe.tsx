"use client";

interface Props { checked: boolean; onChange: (v: boolean) => void; }

export default function RememberMe({ checked, onChange }: Props) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-600">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-gray-300 accent-primary" />
      Remember me
    </label>
  );
}
