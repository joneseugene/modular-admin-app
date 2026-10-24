"use client";

import * as React from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { COUNTRIES, DEFAULT_COUNTRY_CODE, type CountryOption } from "@/lib/data/countries";

export interface CountrySelectProps {
  value?: string;
  defaultValue?: string;
  onChange?: (countryCode: string) => void;
  onBlur?: () => void;
  name?: string;
  id?: string;
  label?: string;
  description?: string;
  placeholder?: string;
  includeCallingCode?: boolean;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  countries?: CountryOption[];
  className?: string;
}

export function CountrySelect({
  value,
  defaultValue = DEFAULT_COUNTRY_CODE,
  onChange,
  onBlur,
  name,
  id,
  label,
  description,
  placeholder = "Search countries...",
  includeCallingCode = true,
  disabled = false,
  required = false,
  error,
  countries = COUNTRIES,
  className,
}: CountrySelectProps) {
  const generatedId = React.useId();
  const selectId = id ?? generatedId;
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const currentValue = value ?? internalValue;
  const selected = countries.find((country) => country.code === currentValue) ?? countries.find((country) => country.code === DEFAULT_COUNTRY_CODE) ?? countries[0];
  const errorId = `${selectId}-error`;
  const descriptionId = `${selectId}-description`;
  const filteredCountries = countries.filter((country) => `${country.name} ${country.code} ${country.callingCode}`.toLowerCase().includes(query.toLowerCase())).slice(0, 100);

  React.useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function choose(country: CountryOption) {
    setInternalValue(country.code);
    onChange?.(country.code);
    setOpen(false);
    setQuery("");
  }

  return (
    <div ref={rootRef} className={cn("relative space-y-1.5", className)}>
      {label && <label id={`${selectId}-label`} className="block text-sm font-medium text-slate-900">{label}{required && <span className="ml-1 text-red-600">*</span>}</label>}
      {description && <p id={descriptionId} className="text-sm text-slate-500">{description}</p>}
      <button
        id={selectId}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={label ? `${selectId}-label` : undefined}
        aria-describedby={[description ? descriptionId : undefined, error ? errorId : undefined].filter(Boolean).join(" ") || undefined}
        aria-invalid={Boolean(error)}
        onBlur={() => { if (!open) onBlur?.(); }}
        onClick={() => setOpen((current) => !current)}
        className={cn("flex min-h-10 w-full items-center justify-between gap-3 rounded-md border bg-white px-3 py-2 text-left text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60", error ? "border-red-500" : "border-slate-300")}
      >
        <span className="flex min-w-0 items-center gap-2"><span aria-hidden="true" className="text-lg">{selected?.flag}</span><span className="truncate">{selected?.name ?? "Select a country"}</span>{includeCallingCode && selected && <span className="shrink-0 text-slate-500">{selected.callingCode}</span>}</span>
        <ChevronDown className={cn("size-4 shrink-0 text-slate-500 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg">
          <div className="flex items-center gap-2 border-b border-slate-100 px-3"><Search className="size-4 text-slate-400" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder={placeholder} aria-label="Search countries" className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400" /></div>
          <ul role="listbox" aria-label="Countries" className="max-h-60 overflow-y-auto p-1">
            {filteredCountries.map((country) => <li key={country.code} role="option" aria-selected={country.code === currentValue}><button type="button" onClick={() => choose(country)} className={cn("flex w-full items-center gap-2 rounded px-2 py-2 text-left text-sm hover:bg-slate-100", country.code === currentValue && "bg-emerald-50 font-medium text-emerald-900")}><span aria-hidden="true" className="text-lg">{country.flag}</span><span className="min-w-0 flex-1 truncate">{country.name}</span><span className="text-slate-500">{includeCallingCode ? country.callingCode : country.code}</span></button></li>)}
            {filteredCountries.length === 0 && <li className="px-3 py-6 text-center text-sm text-slate-500">No countries found.</li>}
          </ul>
        </div>
      )}
      {name && <input type="hidden" name={name} value={currentValue} />}
      {error && <p id={errorId} role="alert" className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
