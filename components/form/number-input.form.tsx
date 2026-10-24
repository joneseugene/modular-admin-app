"use client";

import { useController, useFormContext, type FieldValues } from "react-hook-form";
import { NumberInput, type NumberInputProps } from "@/components/ui/number-input";

type NumberInputFormProps = Omit<NumberInputProps, "value" | "defaultValue" | "onChange" | "onBlur" | "name" | "error"> & { name: string };

export function NumberInputForm({ name, ...props }: NumberInputFormProps) {
  const { control } = useFormContext<FieldValues>();
  const { field, fieldState } = useController({ name, control });
  const value = typeof field.value === "number" ? field.value : undefined;
  return <NumberInput {...props} name={field.name} value={value} onChange={field.onChange} onBlur={field.onBlur} error={fieldState.error?.message} />;
}
