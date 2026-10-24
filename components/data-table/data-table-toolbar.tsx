
"use client";

import * as React from "react";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface DataTableToolbarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  searchDebounceMs?: number;
  actions?: React.ReactNode;
  isLoading?: boolean;
}

export function DataTableToolbar({
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search records...",
  searchDebounceMs = 300,
  actions,
  isLoading = false,
}: DataTableToolbarProps) {
  const [value, setValue] = React.useState(searchValue);

  React.useEffect(() => {
    setValue(searchValue);
  }, [searchValue]);

  React.useEffect(() => {
    if (!onSearchChange || value.trim() === searchValue.trim()) {
      return;
    }

    const timeoutId = setTimeout(() => {
      onSearchChange(value.trim());
    }, searchDebounceMs);

    return () => clearTimeout(timeoutId);
  }, [value, searchValue, onSearchChange, searchDebounceMs]);

  const handleClear = () => {
    setValue("");
    onSearchChange?.("");
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
      <div className="flex w-full items-center gap-2 sm:w-auto">
        <div className="relative min-w-0 flex-1 sm:w-72 sm:flex-none">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />

          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9 pr-9"
            disabled={isLoading}
            aria-label="Search records"
          />

          {value.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 size-7 -translate-y-1/2"
              onClick={handleClear}
              aria-label="Clear search"
              disabled={isLoading}
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          )}
        </div>

        {actions && (
          <div className="flex shrink-0 items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
