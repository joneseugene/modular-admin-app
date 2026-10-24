
"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type InputHTMLAttributes,
  type KeyboardEvent,
} from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";

export interface SearchableSelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface SearchableSelectProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | "value"
    | "defaultValue"
    | "onChange"
    | "type"
    | "role"
    | "readOnly"
  > {
  options: SearchableSelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  hint?: string;
  error?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  loading?: boolean;
  clearable?: boolean;
  onSearchChange?: (query: string) => void;
  containerClassName?: string;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  label,
  hint,
  error,
  placeholder = "Select an option",
  searchPlaceholder = "Search options...",
  emptyMessage = "No options found.",
  loading = false,
  clearable = false,
  onSearchChange,
  containerClassName,
  id,
  disabled,
  required,
  className,
  onBlur,
  onFocus,
  ...inputProps
}: SearchableSelectProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const listboxId = `${inputId}-listbox`;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [internalValue, setInternalValue] = useState(value ?? "");

  const selectedValue = value !== undefined ? value : internalValue;

  const selectedOption = options.find(
    (option) => option.value === selectedValue,
  );

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    if (!normalizedQuery) return options;

    return options.filter((option) => {
      const searchableText =
        `${option.label} ${option.description ?? ""}`.toLocaleLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [options, query]);

  const enabledOptions = filteredOptions.filter(
    (option) => !option.disabled,
  );

  const activeOption = enabledOptions[activeIndex];

  const describedBy = [
    inputProps["aria-describedby"],
    hint && !error ? hintId : undefined,
    error ? errorId : undefined,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  useEffect(() => {
    function handleOutsidePointerDown(event: PointerEvent) {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setQuery("");
      }
    }

    document.addEventListener("pointerdown", handleOutsidePointerDown);

    return () => {
      document.removeEventListener(
        "pointerdown",
        handleOutsidePointerDown,
      );
    };
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, options]);

  function openDropdown() {
    if (disabled) return;

    setQuery("");
    setActiveIndex(0);
    setOpen(true);
  }

  function selectOption(option: SearchableSelectOption) {
    if (option.disabled) return;

    setInternalValue(option.value);
    onChange?.(option.value);
    setQuery("");
    setOpen(false);
    inputRef.current?.blur();
  }

  function clearSelection() {
    setInternalValue("");
    onChange?.("");
    setQuery("");
    setOpen(false);
    inputRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (!open) {
        openDropdown();
        return;
      }

      setActiveIndex((current) =>
        enabledOptions.length
          ? (current + 1) % enabledOptions.length
          : 0,
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (!open) {
        openDropdown();
        return;
      }

      setActiveIndex((current) =>
        enabledOptions.length
          ? (current - 1 + enabledOptions.length) %
            enabledOptions.length
          : 0,
      );
    }

    if (event.key === "Enter" && open) {
      event.preventDefault();

      if (activeOption) selectOption(activeOption);
    }

    if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
      setQuery("");
    }
  }

  return (
    <div
      ref={rootRef}
      className={cn("w-full space-y-1.5", containerClassName)}
    >
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
        <div
          className={cn(
            "flex h-10 w-full items-center rounded-lg border bg-white",
            "transition-colors",
            "focus-within:border-emerald-700 focus-within:ring-2",
            "focus-within:ring-emerald-700/20",
            error ? "border-red-500" : "border-slate-300",
            disabled && "cursor-not-allowed bg-slate-100 opacity-70",
          )}
        >
          {open ? (
            <Search
              size={16}
              aria-hidden="true"
              className="ml-3 shrink-0 text-slate-400"
            />
          ) : null}

          <input
            {...inputProps}
            ref={inputRef}
            id={inputId}
            type="text"
            role="combobox"
            autoComplete="off"
            value={open ? query : selectedOption?.label ?? ""}
            placeholder={open ? searchPlaceholder : placeholder}
            disabled={disabled}
            required={required && !selectedValue}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            aria-expanded={open}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={
              open && activeOption
                ? `${listboxId}-${activeOption.value}`
                : undefined
            }
            onFocus={(event) => {
              onFocus?.(event);
            }}
            onBlur={onBlur}
            onClick={() => {
              if (!open) openDropdown();
            }}
            onChange={(event) => {
              const nextQuery = event.target.value;

              setQuery(nextQuery);
              setOpen(true);
              onSearchChange?.(nextQuery);
            }}
            onKeyDown={handleKeyDown}
            className={cn(
              "h-full min-w-0 flex-1 bg-transparent px-3 text-sm",
              "text-slate-900 outline-none placeholder:text-slate-400",
              "disabled:cursor-not-allowed",
              open && "pl-2",
              className,
            )}
          />

          {clearable && selectedValue && !disabled && (
            <button
              type="button"
              aria-label="Clear selection"
              onClick={clearSelection}
              className="mr-1 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={15} />
            </button>
          )}

          <button
            type="button"
            tabIndex={-1}
            aria-label={open ? "Close options" : "Open options"}
            disabled={disabled}
            onClick={() => {
              if (open) {
                setOpen(false);
                setQuery("");
              } else {
                openDropdown();
                inputRef.current?.focus();
              }
            }}
            className="mr-2 rounded-md p-1 text-slate-400 hover:text-slate-700 disabled:cursor-not-allowed"
          >
            <ChevronDown
              size={16}
              className={cn("transition-transform", open && "rotate-180")}
            />
          </button>
        </div>

        {open && !disabled && (
          <div
            className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg"
          >
            <ul
              id={listboxId}
              role="listbox"
              aria-label={label ?? placeholder}
              aria-busy={loading}
              className="max-h-60 overflow-y-auto p-1.5"
            >
              {loading ? (
                <li
                  role="status"
                  className="px-3 py-6 text-center text-sm text-slate-500"
                >
                  Loading options...
                </li>
              ) : filteredOptions.length === 0 ? (
                <li className="px-3 py-6 text-center text-sm text-slate-500">
                  {emptyMessage}
                </li>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = option.value === selectedValue;
                  const isActive =
                    !option.disabled && option.value === activeOption?.value;

                  return (
                    <li
                      key={option.value}
                      id={`${listboxId}-${option.value}`}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={option.disabled || undefined}
                      onPointerMove={() => {
                        if (option.disabled) return;

                        const index = enabledOptions.findIndex(
                          (item) => item.value === option.value,
                        );

                        setActiveIndex(index);
                      }}
                      onPointerDown={(event) => {
                        // Keep focus on the input until selection completes.
                        event.preventDefault();
                      }}
                      onClick={() => selectOption(option)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2.5",
                        "text-sm transition-colors",
                        option.disabled
                          ? "cursor-not-allowed opacity-40"
                          : "cursor-pointer",
                        isActive && "bg-slate-100",
                        isSelected
                          ? "font-medium text-emerald-900"
                          : "text-slate-700",
                      )}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block">{option.label}</span>

                        {option.description && (
                          <span className="mt-0.5 block text-xs font-normal text-slate-500">
                            {option.description}
                          </span>
                        )}
                      </span>

                      {isSelected && (
                        <Check
                          size={16}
                          aria-hidden="true"
                          className="shrink-0 text-emerald-800"
                        />
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}
      </div>

      {error ? (
        <p id={errorId} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-sm text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
