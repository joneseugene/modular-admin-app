
"use client";

import {
  forwardRef,
  useId,
  useRef,
  type InputHTMLAttributes,
} from "react";
import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DatePickerProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "defaultValue" | "onChange"
  > {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
  minDate?: string;
  maxDate?: string;
}

function toIsoDate(value?: string): string {
  if (!value) return "";

  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return "";

  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
}

function toDisplayDate(value: string): string {
  if (!value) return "";

  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return "";

  return `${day}/${month}/${year}`;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  function DatePicker(
    {
      id,
      value = "",
      onChange,
      label,
      hint,
      error,
      required,
      disabled,
      className,
      containerClassName,
      minDate,
      maxDate,
      placeholder = "dd/mm/yyyy",
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const calendarRef = useRef<HTMLInputElement>(null);
    const hintId = `${inputId}-hint`;
    const errorId = `${inputId}-error`;

    const describedBy =
      [
        hint ? hintId : undefined,
        error ? errorId : undefined,
        props["aria-describedby"],
      ]
        .filter(Boolean)
        .join(" ") || undefined;

    function handleTextChange(nextValue: string) {
      // Format digits progressively as dd/mm/yyyy.
      const digits = nextValue.replace(/\D/g, "").slice(0, 8);

      let formatted = digits;
      if (digits.length > 4) {
        formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
      } else if (digits.length > 2) {
        formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
      }

      onChange?.(formatted);
    }

    function openCalendar() {
      const calendar = calendarRef.current;
      if (!calendar) return;

      try {
        if (typeof calendar.showPicker === "function") {
          calendar.showPicker();
        } else {
          calendar.focus();
          calendar.click();
        }
      } catch {
        calendar.focus();
        calendar.click();
      }
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
          <input
            {...props}
            ref={ref}
            id={inputId}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder={placeholder}
            value={value}
            required={required}
            disabled={disabled}
            maxLength={10}
            onChange={(event) => handleTextChange(event.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className={cn(
              "block w-full rounded-lg border bg-white py-2 pl-3 pr-11 text-sm text-slate-900",
              "placeholder:text-slate-400 outline-none transition",
              "focus:ring-2 focus:ring-emerald-600/20",
              "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70",
              error
                ? "border-red-500 focus:border-red-500"
                : "border-slate-300 focus:border-emerald-600",
              className,
            )}
          />

          <button
            type="button"
            onClick={openCalendar}
            disabled={disabled}
            aria-label="Open calendar"
            className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-emerald-700 disabled:cursor-not-allowed"
          >
            <CalendarDays className="size-4" aria-hidden="true" />
          </button>

          <input
            ref={calendarRef}
            type="date"
            tabIndex={-1}
            aria-hidden="true"
            value={toIsoDate(value)}
            min={toIsoDate(minDate)}
            max={toIsoDate(maxDate)}
            disabled={disabled}
            onChange={(event) => {
              onChange?.(toDisplayDate(event.target.value));
            }}
            className="pointer-events-none absolute bottom-0 right-10 size-px opacity-0"
          />
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

DatePicker.displayName = "DatePicker";
