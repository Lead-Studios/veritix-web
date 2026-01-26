"use client";

import React from "react";

interface RadioButtonProps {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

export default function RadioButton({
  id,
  name,
  value,
  checked,
  onChange,
  label,
}: RadioButtonProps) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-2 cursor-pointer group"
    >
      <div className="relative">
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div
          className={`w-5 h-5 rounded-full border-2 transition-colors ${
            checked
              ? "border-blue-600 bg-blue-600"
              : "border-gray-600 bg-transparent group-hover:border-gray-500"
          }`}
        >
          {checked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
          )}
        </div>
      </div>
      <span
        className={`text-sm ${
          checked ? "text-white font-medium" : "text-gray-400"
        }`}
      >
        {label}
      </span>
    </label>
  );
}
