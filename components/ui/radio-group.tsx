"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface RadioOption { label: string; value: string; description?: string; disabled?: boolean }
export interface RadioGroupProps {
  value?: string; defaultValue?: string; onChange?: (value: string) => void; onBlur?: () => void; name?: string;
  label?: string; description?: string; options: RadioOption[]; direction?: "vertical" | "horizontal";
  disabled?: boolean; required?: boolean; error?: string; className?: string;
}

export function RadioGroup({ value, defaultValue, onChange, onBlur, name, label, description, options, direction = "vertical", disabled = false, required = false, error, className }: RadioGroupProps) {
  const generatedId = React.useId();
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const selected = value !== undefined ? value : internalValue;
  const errorId = `${generatedId}-error`;
  const descriptionId = `${generatedId}-description`;
  const select = (next: string) => { if (value === undefined) setInternalValue(next); onChange?.(next); };

  return <fieldset className={cn("space-y-2", className)} aria-describedby={[description ? descriptionId : undefined, error ? errorId : undefined].filter(Boolean).join(" ") || undefined}>
    {label && <legend className="text-sm font-medium text-slate-900">{label}{required && <span className="ml-1 text-red-600">*</span>}</legend>}
    {description && <p id={descriptionId} className="text-sm text-slate-500">{description}</p>}
    <div className={cn("flex gap-3", direction === "vertical" ? "flex-col" : "flex-row flex-wrap")}>
      {options.map((option, index) => {
        const optionId = `${generatedId}-${index}`;
        return <label key={option.value} htmlFor={optionId} className={cn("flex items-start gap-2.5", disabled || option.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer")}>
          <input id={optionId} type="radio" name={name ?? generatedId} value={option.value} checked={selected === option.value} disabled={disabled || option.disabled} required={required && index === 0} onChange={() => select(option.value)} onBlur={onBlur} aria-invalid={Boolean(error)} className="mt-0.5 size-4 accent-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2" />
          <span className="min-w-0"><span className="block text-sm font-medium text-slate-900">{option.label}</span>{option.description && <span className="mt-0.5 block text-sm text-slate-500">{option.description}</span>}</span>
        </label>;
      })}
    </div>
    {error && <p id={errorId} role="alert" className="text-sm text-red-600">{error}</p>}
  </fieldset>;
}
