
import { forwardRef, useId, type TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      id,
      label,
      hint,
      error,
      required,
      className,
      containerClassName,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const hintId = `${textareaId}-hint`;
    const errorId = `${textareaId}-error`;

    const describedBy = [
      ariaDescribedBy,
      hint && !error ? hintId : undefined,
      error ? errorId : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

    return (
      <div className={cn("w-full space-y-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={textareaId}
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

        <textarea
          {...props}
          ref={ref}
          id={textareaId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            [
              "flex min-h-24 w-full rounded-lg border border-slate-300",
              "bg-white px-3 py-2 text-sm text-slate-900",
              "placeholder:text-slate-400",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-emerald-700",
              "disabled:cursor-not-allowed disabled:bg-slate-100",
              "resize-y",
            ],
            error && "border-red-500 focus-visible:ring-red-500",
            className,
          )}
        />

        {error ? (
          <p id={errorId} role="alert" className="text-sm text-red-600">
            {error}
          </p>
        ) : hint ? (
          <p id={hintId} className="text-sm text-slate-500">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
