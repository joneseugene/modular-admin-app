"use client";

import { useController, useFormContext, type FieldValues } from "react-hook-form";
import { RadioGroup, type RadioGroupProps } from "@/components/ui/radio-group";

type RadioGroupFormProps = Omit<RadioGroupProps, "value" | "defaultValue" | "onChange" | "onBlur" | "name" | "error"> & { name: string };

export function RadioGroupForm({ name, ...props }: RadioGroupFormProps) {
  const { control } = useFormContext<FieldValues>();
  const { field, fieldState } = useController({ name, control });
  return <RadioGroup {...props} name={field.name} value={typeof field.value === "string" ? field.value : ""} onChange={field.onChange} onBlur={field.onBlur} error={fieldState.error?.message} />;
}
