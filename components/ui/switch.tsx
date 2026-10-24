"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps {
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
  size?: "sm" | "md";
}

export function Switch({ checked, defaultChecked, onChange, onBlur, name, id, label, description, disabled = false, required = false, error, className, size = "md" }: SwitchProps) {
  const generatedId = React.useId();
  const switchId = id ?? generatedId;
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked ?? false);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;
  const errorId = `${switchId}-error`;
  const descriptionId = `${switchId}-description`;
  const toggle = () => {
    const next = !isChecked;
    if (!isControlled) setInternalChecked(next);
    onChange?.(next);
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-start gap-3">
        <button id={switchId} type="button" role="switch" aria-checked={isChecked} aria-invalid={Boolean(error)} aria-describedby={[description ? descriptionId : undefined, error ? errorId : undefined].filter(Boolean).join(" ") || undefined} disabled={disabled} onBlur={onBlur} onClick={toggle} className={cn("relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", size === "sm" ? "h-5 w-9" : "h-6 w-11", isChecked ? "bg-emerald-700" : "bg-slate-300", error && "ring-1 ring-red-500")}>
          <span className={cn("pointer-events-none inline-block rounded-full bg-white shadow-sm transition-transform", size === "sm" ? "size-4" : "size-5", isChecked ? (size === "sm" ? "translate-x-4" : "translate-x-5") : "translate-x-0.5")} />
        </button>
        {(label || description) && <div className="min-w-0">
          {label && <label htmlFor={switchId} onClick={(event) => { event.preventDefault(); if (!disabled) toggle(); }} className={cn("block text-sm font-medium text-slate-900", disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer")}>{label}{required && <span className="ml-1 text-red-600">*</span>}</label>}
          {description && <p id={descriptionId} className="mt-0.5 text-sm text-slate-500">{description}</p>}
        </div>}
      </div>
      {name && <input type="hidden" name={name} value={String(isChecked)} />}
      {error && <p id={errorId} role="alert" className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
