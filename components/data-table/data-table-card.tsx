"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface DataTableCardField {
  label: string;
  value: React.ReactNode;
}

export interface DataTableCardProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  status?: React.ReactNode;
  fields?: DataTableCardField[];
  actions?: React.ReactNode;
  className?: string;
}

export function DataTableCard({
  title,
  description,
  status,
  fields = [],
  actions,
  className,
}: DataTableCardProps) {
  return (
    <article
      className={cn(
        "flex min-w-0 flex-col gap-4 rounded-xl border bg-card p-4 text-card-foreground shadow-sm",
        className,
      )}
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="break-words font-semibold leading-tight">
            {title}
          </h3>

          {description && (
            <div className="break-words text-sm text-muted-foreground">
              {description}
            </div>
          )}
        </div>

        {status && (
          <div className="shrink-0">
            {status}
          </div>
        )}
      </div>

      {fields.length > 0 && (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-t pt-3">
          {fields.map((field, index) => (
            <div key={`${field.label}-${index}`} className="min-w-0 space-y-1">
              <dt className="text-xs text-muted-foreground">
                {field.label}
              </dt>

              <dd className="break-words text-sm font-medium">
                {field.value ?? "—"}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {actions && (
        <div className="flex flex-wrap items-center justify-end gap-2 border-t pt-3">
          {actions}
        </div>
      )}
    </article>
  );
}
