"use client";

import * as React from "react";
import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DateRangeValue { from: string; to: string }
export interface DateRangePickerProps {
  value?: DateRangeValue; defaultValue?: DateRangeValue; onChange?: (value: DateRangeValue) => void; onBlur?: () => void;
  name?: string; label?: string; description?: string; fromLabel?: string; toLabel?: string;
  minDate?: string; maxDate?: string; disabled?: boolean; required?: boolean; error?: string; className?: string;
}

export function DateRangePicker({ value, defaultValue = { from: "", to: "" }, onChange, onBlur, name, label = "Date range", description, fromLabel = "From", toLabel = "To", minDate, maxDate, disabled = false, required = false, error, className }: DateRangePickerProps) {
  const generatedId = React.useId();
  const [internalValue, setInternalValue] = React.useState<DateRangeValue>(defaultValue);
  const current = value ?? internalValue;
  const fromId = `${generatedId}-from`;
  const toId = `${generatedId}-to`;
  const errorId = `${generatedId}-error`;
  const update = (next: DateRangeValue) => { if (value === undefined) setInternalValue(next); onChange?.(next); };
  const fieldClass = cn("min-w-0 flex-1 bg-transparent py-2 text-sm text-slate-900 outline-none disabled:cursor-not-allowed");
  const wrapperClass = cn("flex min-h-10 items-center gap-2 rounded-md border bg-white px-3 shadow-sm focus-within:ring-2 focus-within:ring-emerald-600 focus-within:ring-offset-1", error ? "border-red-500" : "border-slate-300", disabled && "bg-slate-50 opacity-60");

  return <div className={cn("space-y-2", className)}>
    {label && <p className="text-sm font-medium text-slate-900">{label}{required && <span className="ml-1 text-red-600">*</span>}</p>}
    {description && <p className="text-sm text-slate-500">{description}</p>}
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="space-y-1.5"><label htmlFor={fromId} className="block text-sm text-slate-700">{fromLabel}</label><div className={wrapperClass}><CalendarDays aria-hidden="true" className="size-4 shrink-0 text-slate-400" /><input id={fromId} type="date" value={current.from} min={minDate} max={current.to || maxDate} disabled={disabled} required={required} onChange={(event) => update({ ...current, from: event.target.value })} onBlur={onBlur} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} className={fieldClass} /></div></div>
      <div className="space-y-1.5"><label htmlFor={toId} className="block text-sm text-slate-700">{toLabel}</label><div className={wrapperClass}><CalendarDays aria-hidden="true" className="size-4 shrink-0 text-slate-400" /><input id={toId} type="date" value={current.to} min={current.from || minDate} max={maxDate} disabled={disabled} required={required} onChange={(event) => update({ ...current, to: event.target.value })} onBlur={onBlur} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} className={fieldClass} /></div></div>
    </div>
    {name && <><input type="hidden" name={`${name}.from`} value={current.from} /><input type="hidden" name={`${name}.to`} value={current.to} /></>}
    {error && <p id={errorId} role="alert" className="text-sm text-red-600">{error}</p>}
  </div>;
}
