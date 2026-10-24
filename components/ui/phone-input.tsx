"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface PhoneCountry { label: string; code: string; dialCode: string }
export const PHONE_COUNTRIES: PhoneCountry[] = [
  { label: "Sierra Leone", code: "SL", dialCode: "+232" },
  { label: "Liberia", code: "LR", dialCode: "+231" },
  { label: "Guinea", code: "GN", dialCode: "+224" },
  { label: "Ghana", code: "GH", dialCode: "+233" },
  { label: "Nigeria", code: "NG", dialCode: "+234" },
  { label: "United Kingdom", code: "GB", dialCode: "+44" },
  { label: "United States", code: "US", dialCode: "+1" },
];

export interface PhoneInputProps {
  value?: string; defaultValue?: string; onChange?: (internationalNumber: string) => void; onBlur?: () => void;
  name?: string; id?: string; label?: string; description?: string; placeholder?: string;
  defaultCountryCode?: string; countries?: PhoneCountry[]; disabled?: boolean; required?: boolean; error?: string; className?: string;
}

const digitsOnly = (value: string) => value.replace(/\D/g, "");

export function PhoneInput({ value, defaultValue, onChange, onBlur, name, id, label, description, placeholder = "76 123456", defaultCountryCode = "+232", countries = PHONE_COUNTRIES, disabled = false, required = false, error, className }: PhoneInputProps) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const initialValue = value ?? defaultValue ?? "";
  const initialCountry = countries.find((country) => initialValue.startsWith(country.dialCode));
  const [dialCode, setDialCode] = React.useState(initialCountry?.dialCode ?? defaultCountryCode);
  const [localDigits, setLocalDigits] = React.useState(() => digitsOnly(initialCountry ? initialValue.slice(initialCountry.dialCode.length) : initialValue.replace(/^\+/, "")));
  const isControlled = value !== undefined;
  const errorId = `${inputId}-error`;
  const descriptionId = `${inputId}-description`;

  React.useEffect(() => {
    if (value === undefined) return;
    const country = countries.find((item) => value.startsWith(item.dialCode));
    if (country) {
      setDialCode(country.dialCode);
      setLocalDigits(digitsOnly(value.slice(country.dialCode.length)));
    } else {
      setLocalDigits(digitsOnly(value.replace(/^\+/, "")));
    }
  }, [value, countries]);

  const emit = (nextDialCode: string, nextDigits: string) => onChange?.(nextDigits ? `${nextDialCode}${nextDigits}` : "");
  const changeDigits = (input: string) => {
    const next = digitsOnly(input).slice(0, 15);
    if (!isControlled) setLocalDigits(next);
    emit(dialCode, next);
  };
  const changeDialCode = (next: string) => {
    if (!isControlled) setDialCode(next);
    emit(next, localDigits);
  };
  const currentDigits = localDigits;
  const currentDialCode = dialCode;

  return <div className={cn("space-y-1.5", className)}>
    {label && <label htmlFor={inputId} className="block text-sm font-medium text-slate-900">{label}{required && <span className="ml-1 text-red-600">*</span>}</label>}
    {description && <p id={descriptionId} className="text-sm text-slate-500">{description}</p>}
    <div className={cn("flex min-h-10 overflow-hidden rounded-md border bg-white shadow-sm transition focus-within:ring-2 focus-within:ring-emerald-600 focus-within:ring-offset-1", error ? "border-red-500" : "border-slate-300", disabled && "bg-slate-50 opacity-60")}>
      <select aria-label="Country calling code" value={currentDialCode} disabled={disabled} onChange={(event) => changeDialCode(event.target.value)} className="max-w-36 border-r border-slate-200 bg-slate-50 px-2 text-sm text-slate-800 outline-none disabled:cursor-not-allowed">
        {countries.map((country) => <option key={`${country.code}-${country.dialCode}`} value={country.dialCode}>{country.code} ({country.dialCode})</option>)}
      </select>
      <input id={inputId} type="tel" inputMode="tel" autoComplete="tel-national" value={currentDigits} placeholder={placeholder} disabled={disabled} required={required} onChange={(event) => changeDigits(event.target.value)} onBlur={onBlur} aria-invalid={Boolean(error)} aria-describedby={[description ? descriptionId : undefined, error ? errorId : undefined].filter(Boolean).join(" ") || undefined} className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed" />
    </div>
    {name && <input type="hidden" name={name} value={currentDigits ? `${currentDialCode}${currentDigits}` : ""} />}
    {error && <p id={errorId} role="alert" className="text-sm text-red-600">{error}</p>}
  </div>;
}
