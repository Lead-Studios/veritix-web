import { Control, useController } from "react-hook-form";
import { cn } from "../lib/cn";
import usePasswordToggle from "../hooks/usePasswordToggle";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import Link from "next/link";

type FormInputProps = {
  name: string;
  control: Control<any>;
  label?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  showForgotPassword?: boolean
};

export const Input = ({
  name,
  control,
  label,
  placeholder,
  type = "text",
  disabled = false,
  icon,
  showForgotPassword
}: FormInputProps) => {
  const { showPassword, handleClickShowPassword } = usePasswordToggle()

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const isPassword = type === "password";

  return (
    <div className="w-full space-y-3">
      {label && (
        <div className="flex justify-between">
          <label
            htmlFor={name}

          >
            {label}
          </label>

          {(isPassword && showForgotPassword) && <Link href="/forgot-password">Forgot Password?</Link>}
        </div>
      )}

      <div>
        <div
          className={cn(
            "flex items-center gap-2 rounded-md border bg-[#EEF2FF] px-3 py-2 transition",
            "focus-within:ring-1 focus-within:ring-primary-black mt-4 mb-2",
            error
              ? "border-red-500 focus-within:ring-red-500"
              : "border-[#CCCCCCCC]",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {icon && (
            <span className="flex h-6 w-6 items-center justify-center text-gray-400">
              {icon}
            </span>
          )}

          <input
            {...field}
            id={name}
            type={isPassword && showPassword ? "text" : type}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={!!error}
            className={cn(
              "w-full bg-transparent text-sm text-gray-900 placeholder-gray-500 outline-none",
              disabled && "cursor-not-allowed"
            )}
          />

          {isPassword && (
            <button
              type="button"
              onClick={handleClickShowPassword}
              disabled={disabled}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}
            </button>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-600">{error.message}</p>
        )}
      </div>

    </div>
  );
};
