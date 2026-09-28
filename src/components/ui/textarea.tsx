"use client";

import {
  Control,
  useController,
  FieldValues,
  FieldPath,
} from "react-hook-form";
import { cn } from "../../lib/cn";

type FormTextareaProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  showCharCount?: boolean;
} & Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "name" | "disabled" | "placeholder" | "rows" | "maxLength"
>;

export const Textarea = <TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  label,
  placeholder,
  disabled = false,
  rows = 4,
  maxLength,
  showCharCount = false,
  className,
  ...restProps
}: FormTextareaProps<TFieldValues>) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const currentLength = (field.value as string)?.length ?? 0;
  const isNearLimit = maxLength !== undefined && currentLength >= maxLength * 0.85;

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
            "rounded-md border bg-[#EEF2FF] px-3 py-2 transition",
            "focus-within:ring-1 focus-within:ring-primary-black mt-4 mb-2",
            error
              ? "border-red-500 focus-within:ring-red-500"
              : "border-[#CCCCCCCC]",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          <textarea
            {...field}
            {...restProps}
            id={name}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            maxLength={maxLength}
            aria-invalid={!!error}
            aria-describedby={
              showCharCount && maxLength !== undefined
                ? `${name}-char-count`
                : undefined
            }
            className={cn(
              "w-full resize-y bg-transparent text-sm text-gray-900 placeholder-gray-500 outline-none",
              disabled && "cursor-not-allowed",
              className,
            )}
          />
        </div>

        <div className="flex items-start justify-between gap-2">
          {error ? (
            <p className="text-xs text-red-600" role="alert">
              {error.message}
            </p>
          ) : (
            <span />
          )}

          {showCharCount && maxLength !== undefined && (
            <p
              id={`${name}-char-count`}
              className={cn(
                "text-xs tabular-nums",
                isNearLimit ? "text-amber-500" : "text-gray-400",
                currentLength >= maxLength && "text-red-500",
              )}
              aria-live="polite"
            >
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
