
"use client";

import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      id,
      label,
      hint,
      error,
      required,
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

    const describedBy = [
      hint ? hintId : undefined,
      error ? errorId : undefined,
      props["aria-describedby"],
    ]
      .filter(Boolean)
      .join(" ") || undefined;

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

        <input
          {...props}
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "block w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900",
            "placeholder:text-slate-400",
            "outline-none transition focus:ring-2 focus:ring-emerald-600/20",
            "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70",
            error
              ? "border-red-500 focus:border-red-500"
              : "border-slate-300 focus:border-emerald-600",
            className,
          )}
        />

        {hint && !error && (
          <p id={hintId} className="text-xs text-slate-500">
            {hint}
          </p>
        )}

        {error && (
          <p id={errorId} role="alert" className="text-xs text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
