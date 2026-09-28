"use client";

import {
  Control,
  useController,
  FieldValues,
  FieldPath,
} from "react-hook-form";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/cn";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

type FormSelectProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
} & Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "name" | "disabled" | "placeholder"
>;

export const Select = <TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  options,
  label,
  placeholder,
  disabled = false,
  className,
  ...restProps
}: FormSelectProps<TFieldValues>) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <div className="w-full space-y-3">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium">
          {label}
        </label>
      )}
      <div>
        <div
          className={cn(
            "relative flex items-center rounded-md border bg-[#EEF2FF] transition",
            "focus-within:ring-1 focus-within:ring-primary-black mt-4 mb-2",
            error
              ? "border-red-500 focus-within:ring-red-500"
              : "border-[#CCCCCCCC]",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          <select
            {...field}
            {...restProps}
            id={name}
            disabled={disabled}
            aria-invalid={!!error}
            className={cn(
              "w-full appearance-none bg-transparent px-3 py-2 text-sm text-gray-900 outline-none",
              "placeholder-gray-500",
              disabled && "cursor-not-allowed",
              !field.value && "text-gray-500",
              className,
            )}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
              >
                {opt.label}
              </option>
            ))}
          </select>

          {/* Chevron icon - pointer-events-none so the select still receives clicks */}
          <span className="pointer-events-none absolute right-3 flex items-center text-gray-400">
            <ChevronDown size={16} />
          </span>
        </div>
        {error && (
          <p className="text-xs text-red-600" role="alert">
            {error.message}
          </p>
        )}
      </div>
    </div>
  );
};
