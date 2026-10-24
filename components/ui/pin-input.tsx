
"use client";

import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
} from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PinInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | "type"
    | "value"
    | "defaultValue"
    | "onChange"
    | "maxLength"
  > {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  hint?: string;
  error?: string;
  length?: 4 | 6;
  showToggle?: boolean;
  containerClassName?: string;
}

export const PinInput = forwardRef<HTMLInputElement, PinInputProps>(
  function PinInput(
    {
      id,
      value = "",
      onChange,
      label = "PIN",
      hint,
      error,
      length = 4,
      showToggle = true,
      required,
      disabled,
      className,
      containerClassName,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hintId = `${inputId}-hint`;
    const errorId = `${inputId}-error`;
    const [visible, setVisible] = useState(false);

    const describedBy =
      [
        hint ? hintId : undefined,
        error ? errorId : undefined,
        props["aria-describedby"],
      ]
        .filter(Boolean)
        .join(" ") || undefined;

    function handleChange(nextValue: string) {
      onChange?.(nextValue.replace(/\D/g, "").slice(0, length));
    }

    return (
      <div className={cn("w-full space-y-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700"
          >
            {label}
            {required && (
              <span className="ml-1 text-red-600" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
            <LockKeyhole className="size-4" aria-hidden="true" />
          </div>

          <input
            {...props}
            ref={ref}
            id={inputId}
            type={visible ? "text" : "password"}
            inputMode="numeric"
            autoComplete="new-password"
            pattern="[0-9]*"
            maxLength={length}
            value={value}
            onChange={(event) => handleChange(event.target.value)}
            required={required}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className={cn(
              "block w-full rounded-lg border bg-white py-2.5 pl-10 pr-11 text-base tracking-[0.35em] text-slate-900",
              "outline-none transition placeholder:tracking-normal",
              "focus:ring-2 focus:ring-emerald-600/20",
              "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70",
              error
                ? "border-red-500 focus:border-red-500"
                : "border-slate-300 focus:border-emerald-600",
              className,
            )}
            placeholder={"•".repeat(length)}
          />

          {showToggle && (
            <button
              type="button"
              onClick={() => setVisible((current) => !current)}
              disabled={disabled}
              aria-label={visible ? "Hide PIN" : "Show PIN"}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-800 disabled:opacity-50"
            >
              {visible ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          )}
        </div>

        {hint && !error && (
          <p id={hintId} className="text-xs text-slate-500">
            {hint}
          </p>
        )}

        {error && (
          <p id={errorId} role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  },
);

PinInput.displayName = "PinInput";
