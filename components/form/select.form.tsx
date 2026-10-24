"use client";

import {
  useController,
  useFormContext,
  type FieldValues,
} from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

interface SelectFormProps {
  name: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
  required?: boolean;
}

export function SelectForm({
  name,
  options,
  placeholder = "Select an option",
  disabled = false,
  className,
  contentClassName,
  required = false,
}: SelectFormProps) {
  const { control } = useFormContext<FieldValues>();

  const { field, fieldState } = useController({
    name,
    control,
  });

  const error = fieldState.error?.message;

  return (
    <div className="w-full space-y-1.5">
      <Select
        name={field.name}
        value={field.value == null ? "" : String(field.value)}
        onValueChange={field.onChange}
        disabled={disabled}
        required={required}
      >
        <SelectTrigger
          ref={field.ref}
          onBlur={field.onBlur}
          className={className}
          aria-invalid={Boolean(error)}
          aria-required={required}
          aria-describedby={error ? `${name}-error` : undefined}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent className={contentClassName}>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && (
        <p
          id={`${name}-error`}
          className="text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
