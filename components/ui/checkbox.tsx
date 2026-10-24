"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  onBlur?: () => void;
  name?: string;
  id?: string;
  label?: string;
  description?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
}

export function Checkbox({ checked, defaultChecked, onChange, onBlur, name, id, label, description, disabled = false, required = false, error, className }: CheckboxProps) {
  const generatedId = React.useId();
  const checkboxId = id ?? generatedId;
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked ?? false);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;
  const errorId = `${checkboxId}-error`;
  const descriptionId = `${checkboxId}-description`;
  const toggle = () => { const next = !isChecked; if (!isControlled) setInternalChecked(next); onChange?.(next); };

  return <div className={cn("space-y-1.5", className)}>
    <div className="flex items-start gap-2.5">
      <button id={checkboxId} type="button" role="checkbox" aria-checked={isChecked} aria-invalid={Boolean(error)} aria-describedby={[description ? descriptionId : undefined, error ? errorId : undefined].filter(Boolean).join(" ") || undefined} disabled={disabled} onBlur={onBlur} onClick={toggle} className={cn("mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", isChecked ? "border-emerald-700 bg-emerald-700 text-white" : "border-slate-300 bg-white", error && "border-red-500")}>
        {isChecked && <Check className="size-3" strokeWidth={3} />}
      </button>
      {(label || description) && <div className="min-w-0">
        {label && <label htmlFor={checkboxId} onClick={(event) => { event.preventDefault(); if (!disabled) toggle(); }} className={cn("block text-sm font-medium text-slate-900", disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer")}>{label}{required && <span className="ml-1 text-red-600">*</span>}</label>}
        {description && <p id={descriptionId} className="mt-0.5 text-sm text-slate-500">{description}</p>}
      </div>}
    </div>
    {name && <input type="hidden" name={name} value={String(isChecked)} />}
    {error && <p id={errorId} role="alert" className="text-sm text-red-600">{error}</p>}
  </div>;
}
