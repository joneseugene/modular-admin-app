"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface CurrencyInputProps {
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  id?: string;
  label?: string;
  description?: string;
  currency?: string;
  locale?: string;
  decimals?: number;
  min?: number;
  max?: number;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
}

function cleanAmount(value: string, decimals: number): string {
  const normalized = value.replace(/,/g, "").replace(/[^\d.-]/g, "");
  const negative = normalized.startsWith("-");
  const unsigned = normalized.replace(/-/g, "");
  const [whole = "", ...fractionParts] = unsigned.split(".");
  const fraction = fractionParts.join("").slice(0, decimals);
  const safeWhole = whole.replace(/^0+(?=\d)/, "");
  const result = `${negative ? "-" : ""}${safeWhole || "0"}${fractionParts.length ? `.${fraction}` : ""}`;
  return result;
}

function formatAmount(value: string, currency: string, locale: string, decimals: number): string {
  if (!value || value === "-" || value.endsWith(".")) return value;
  const amount = Number(value);
  if (!Number.isFinite(amount)) return value;
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(decimals)}`;
  }
}

export function CurrencyInput({ value, defaultValue, onChange, onBlur, name, id, label, description, currency = "SLE", locale = "en-SL", decimals = 2, min, max, placeholder = "0.00", disabled = false, required = false, error, className }: CurrencyInputProps) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const initialValue = String(value ?? defaultValue ?? "");
  const [rawValue, setRawValue] = React.useState(initialValue);
  const [isFocused, setIsFocused] = React.useState(false);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? String(value ?? "") : rawValue;
  const errorId = `${inputId}-error`;
  const descriptionId = `${inputId}-description`;

  React.useEffect(() => {
    if (isControlled) setRawValue(String(value ?? ""));
  }, [isControlled, value]);

  const displayValue = isFocused ? currentValue : formatAmount(currentValue, currency, locale, decimals);

  const handleChange = (next: string) => {
    const cleaned = cleanAmount(next, decimals);
    if (!isControlled) setRawValue(cleaned);
    onChange?.(cleaned);
  };

  const handleBlur = () => {
    setIsFocused(false);
    const numeric = Number(currentValue);
    if (currentValue !== "" && Number.isFinite(numeric)) {
      let bounded = numeric;
      if (min !== undefined) bounded = Math.max(min, bounded);
      if (max !== undefined) bounded = Math.min(max, bounded);
      const normalized = bounded.toFixed(decimals);
      if (!isControlled) setRawValue(normalized);
      onChange?.(normalized);
    }
    onBlur?.();
  };

  return <div className={cn("space-y-1.5", className)}>
    {label && <label htmlFor={inputId} className="block text-sm font-medium text-slate-900">{label}{required && <span className="ml-1 text-red-600">*</span>}</label>}
    {description && <p id={descriptionId} className="text-sm text-slate-500">{description}</p>}
    <div className={cn("flex min-h-10 items-center rounded-md border bg-white shadow-sm transition focus-within:ring-2 focus-within:ring-emerald-600 focus-within:ring-offset-1", error ? "border-red-500" : "border-slate-300", disabled && "bg-slate-50 opacity-60")}>
      <input id={inputId} type="text" inputMode="decimal" autoComplete="off" value={displayValue} placeholder={placeholder} disabled={disabled} required={required} onFocus={() => setIsFocused(true)} onChange={(event) => handleChange(event.target.value)} onBlur={handleBlur} aria-invalid={Boolean(error)} aria-describedby={[description ? descriptionId : undefined, error ? errorId : undefined].filter(Boolean).join(" ") || undefined} className="min-w-0 flex-1 rounded-md bg-transparent px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed" />
    </div>
    {name && <input type="hidden" name={name} value={currentValue} />}
    {error && <p id={errorId} role="alert" className="text-sm text-red-600">{error}</p>}
  </div>;
}
