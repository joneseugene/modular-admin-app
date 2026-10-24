"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NumberInputProps {
  value?: number | null;
  defaultValue?: number | null;
  onChange?: (value: number | undefined) => void;
  onBlur?: () => void;
  name?: string;
  id?: string;
  label?: string;
  description?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  showSteppers?: boolean;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
  inputClassName?: string;
}

export function NumberInput({
  value,
  defaultValue,
  onChange,
  onBlur,
  name,
  id,
  label,
  description,
  placeholder,
  min,
  max,
  step = 1,
  precision,
  showSteppers = false,
  disabled = false,
  required = false,
  error,
  className,
  inputClassName,
}: NumberInputProps) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const [internalValue, setInternalValue] = React.useState<number | undefined>(defaultValue ?? undefined);
  const currentValue = value === null ? undefined : value ?? internalValue;
  const errorId = `${inputId}-error`;
  const descriptionId = `${inputId}-description`;

  function emit(nextValue: number | undefined) {
    if (nextValue !== undefined && !Number.isFinite(nextValue)) return;
    if (nextValue !== undefined && min !== undefined && nextValue < min) nextValue = min;
    if (nextValue !== undefined && max !== undefined && nextValue > max) nextValue = max;
    if (nextValue !== undefined && precision !== undefined) {
      const factor = 10 ** precision;
      nextValue = Math.round(nextValue * factor) / factor;
    }
    setInternalValue(nextValue);
    onChange?.(nextValue);
  }

  function adjust(direction: -1 | 1) {
    const next = (currentValue ?? 0) + step * direction;
    emit(Number(next.toFixed(precision ?? 8)));
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <label htmlFor={inputId} className="block text-sm font-medium text-slate-900">{label}{required && <span className="ml-1 text-red-600">*</span>}</label>}
      {description && <p id={descriptionId} className="text-sm text-slate-500">{description}</p>}
      <div className={cn("flex min-h-10 overflow-hidden rounded-md border bg-white shadow-sm focus-within:ring-2 focus-within:ring-emerald-600 focus-within:ring-offset-1", error ? "border-red-500" : "border-slate-300", disabled && "bg-slate-50 opacity-60")}>
        {showSteppers && <button type="button" aria-label="Decrease value" disabled={disabled || (currentValue !== undefined && min !== undefined && currentValue <= min)} onClick={() => adjust(-1)} className="px-2 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"><Minus className="size-4" /></button>}
        <input
          id={inputId}
          type="number"
          inputMode={precision && precision > 0 ? "decimal" : "numeric"}
          name={name}
          value={currentValue ?? ""}
          placeholder={placeholder}
          min={min}
          max={max}
          step={precision !== undefined ? 10 ** -precision : step}
          disabled={disabled}
          required={required}
          onChange={(event) => {
            const raw = event.currentTarget.value;
            if (raw === "") {
              emit(undefined);
              return;
            }
            const parsed = event.currentTarget.valueAsNumber;
            if (Number.isFinite(parsed)) {
              setInternalValue(parsed);
              onChange?.(parsed);
            }
          }}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={[description ? descriptionId : undefined, error ? errorId : undefined].filter(Boolean).join(" ") || undefined}
          className={cn("min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed", showSteppers && "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none", inputClassName)}
        />
        {showSteppers && <button type="button" aria-label="Increase value" disabled={disabled || (currentValue !== undefined && max !== undefined && currentValue >= max)} onClick={() => adjust(1)} className="px-2 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"><Plus className="size-4" /></button>}
      </div>
      {error && <p id={errorId} role="alert" className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
