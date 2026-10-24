"use client";

import { useController, useFormContext, type FieldValues } from "react-hook-form";
import { CurrencyInput, type CurrencyInputProps } from "@/components/ui/currency-input";

type CurrencyInputFormProps = Omit<CurrencyInputProps, "value" | "defaultValue" | "onChange" | "onBlur" | "name" | "error"> & { name: string };

export function CurrencyInputForm({ name, ...props }: CurrencyInputFormProps) {
  const { control } = useFormContext<FieldValues>();
  const { field, fieldState } = useController({ name, control });
  return <CurrencyInput {...props} name={field.name} value={typeof field.value === "string" || typeof field.value === "number" ? field.value : ""} onChange={field.onChange} onBlur={field.onBlur} error={fieldState.error?.message} />;
}
