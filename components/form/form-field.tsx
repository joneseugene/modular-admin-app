
"use client";

import type { ReactNode } from "react";
import {
  useFormContext,
  type FieldValues,
} from "react-hook-form";

import { cn } from "@/lib/utils";

export interface FormFieldRenderProps {
  id: string;
  invalid: boolean;
  describedBy?: string;
}

export interface FormFieldProps {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  children:
    | ReactNode
    | ((props: FormFieldRenderProps) => ReactNode);
}

function toId(name: string) {
  return name.replace(/[^a-zA-Z0-9_-]/g, "-");
}

export function FormField({
  name,
  label,
  description,
  required = false,
  className,
  labelClassName,
  children,
}: FormFieldProps) {
  const { getFieldState, formState } =
    useFormContext<FieldValues>();

  const fieldState = getFieldState(name, formState);
  const errorMessage = fieldState.error?.message;
  const invalid = Boolean(fieldState.error);

  const id = `field-${toId(name)}`;
  const descriptionId = description
    ? `${id}-description`
    : undefined;
  const errorId = invalid ? `${id}-error` : undefined;

  const describedBy =
    [descriptionId, errorId].filter(Boolean).join(" ") ||
    undefined;

  const renderProps: FormFieldRenderProps = {
    id,
    invalid,
    describedBy,
  };

  return (
    <div className={cn("min-w-0 space-y-2", className)}>
      <label
        htmlFor={id}
        className={cn(
          "block text-sm font-medium leading-none",
          invalid && "text-destructive",
          labelClassName,
        )}
      >
        {label}
        {required && (
          <span
            className="ml-1 text-destructive"
            aria-hidden="true"
          >
            *
          </span>
        )}
      </label>

      {description && (
        <p
          id={descriptionId}
          className="text-sm text-muted-foreground"
        >
          {description}
        </p>
      )}

      {typeof children === "function"
        ? children(renderProps)
        : children}

      {invalid && (
        <p
          id={errorId}
          role="alert"
          className="text-sm text-destructive"
        >
          {String(errorMessage ?? "This field is invalid.")}
        </p>
      )}
    </div>
  );
}
