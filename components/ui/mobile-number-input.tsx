"use client";

import * as React from "react";
import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";
import { cn } from "@/lib/utils";
import { COUNTRIES, DEFAULT_COUNTRY_CODE, getCountry } from "@/lib/data/countries";
import { CountrySelect } from "@/components/ui/country-select";

export interface MobileNumberInputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (internationalNumber: string) => void;
  onBlur?: () => void;
  name?: string;
  id?: string;
  label?: string;
  description?: string;
  placeholder?: string;
  defaultCountry?: CountryCode;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  validateNumber?: boolean;
  className?: string;
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function MobileNumberInput({
  value,
  defaultValue,
  onChange,
  onBlur,
  name,
  id,
  label,
  description,
  placeholder,
  defaultCountry = DEFAULT_COUNTRY_CODE,
  disabled = false,
  required = false,
  error,
  validateNumber = false,
  className,
}: MobileNumberInputProps) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const initialValue = value ?? defaultValue ?? "";
  const [countryCode, setCountryCode] = React.useState<CountryCode>(() => {
    const parsed = initialValue ? parsePhoneNumberFromString(initialValue) : undefined;
    return parsed?.country ?? defaultCountry;
  });
  const [nationalDigits, setNationalDigits] = React.useState(() => {
    const parsed = initialValue ? parsePhoneNumberFromString(initialValue) : undefined;
    return parsed?.nationalNumber ?? onlyDigits(initialValue);
  });
  const country = getCountry(countryCode);
  const errorId = `${inputId}-error`;
  const descriptionId = `${inputId}-description`;

  React.useEffect(() => {
    if (value === undefined) return;
    if (!value) {
      setNationalDigits("");
      return;
    }
    const parsed = parsePhoneNumberFromString(value);
    if (parsed) {
      setCountryCode(parsed.country ?? defaultCountry);
      setNationalDigits(parsed.nationalNumber);
    } else {
      setNationalDigits(onlyDigits(value));
    }
  }, [value, defaultCountry]);

  function emit(digits: string, nextCountryCode = countryCode) {
    const selectedCountry = getCountry(nextCountryCode);
    onChange?.(digits ? `${selectedCountry.callingCode}${digits}` : "");
  }

  function handleCountryChange(code: string) {
    const nextCode = code as CountryCode;
    setCountryCode(nextCode);
    emit(nationalDigits, nextCode);
  }

  function handleNumberChange(raw: string) {
    let digits = onlyDigits(raw);
    const parsed = parsePhoneNumberFromString(`+${digits}`);
    if (raw.trim().startsWith("+" ) && parsed?.country) {
      setCountryCode(parsed.country);
      setNationalDigits(parsed.nationalNumber);
      onChange?.(parsed.number);
      return;
    }
    digits = digits.slice(0, 15);
    setNationalDigits(digits);
    emit(digits);
  }

  const internationalValue = nationalDigits ? `${country.callingCode}${nationalDigits}` : "";
  const parsedValue = internationalValue ? parsePhoneNumberFromString(internationalValue) : undefined;
  const validationMessage = validateNumber && internationalValue && (!parsedValue || !parsedValue.isValid())
    ? "Enter a valid phone number for the selected country."
    : undefined;
  const visibleError = error ?? validationMessage;

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <label htmlFor={inputId} className="block text-sm font-medium text-slate-900">{label}{required && <span className="ml-1 text-red-600">*</span>}</label>}
      {description && <p id={descriptionId} className="text-sm text-slate-500">{description}</p>}
      <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-2">
        <CountrySelect
          value={countryCode}
          onChange={handleCountryChange}
          disabled={disabled}
          includeCallingCode
          className="min-w-0"
        />
        <input
          id={inputId}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          value={nationalDigits}
          placeholder={placeholder ?? (countryCode === "SL" ? "76 123456" : "Phone number")}
          disabled={disabled}
          required={required}
          onChange={(event) => handleNumberChange(event.target.value)}
          onBlur={onBlur}
          aria-invalid={Boolean(visibleError)}
          aria-describedby={[description ? descriptionId : undefined, visibleError ? errorId : undefined].filter(Boolean).join(" ") || undefined}
          className={cn("min-h-10 min-w-0 rounded-md border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60", visibleError ? "border-red-500" : "border-slate-300")}
        />
      </div>
      <p className="text-xs text-slate-500">Saved in international format, e.g. {country.callingCode}…</p>
      {name && <input type="hidden" name={name} value={internationalValue} />}
      {visibleError && <p id={errorId} role="alert" className="text-sm text-red-600">{visibleError}</p>}
    </div>
  );
}
