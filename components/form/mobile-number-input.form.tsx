"use client";

import { useController, useFormContext, type FieldValues } from "react-hook-form";
import { MobileNumberInput, type MobileNumberInputProps } from "@/components/ui/mobile-number-input";

type MobileNumberInputFormProps = Omit<MobileNumberInputProps, "value" | "defaultValue" | "onChange" | "onBlur" | "name" | "error"> & { name: string };

export function MobileNumberInputForm({ name, ...props }: MobileNumberInputFormProps) {
  const { control } = useFormContext<FieldValues>();
  const { field, fieldState } = useController({ name, control });
  return <MobileNumberInput {...props} name={field.name} value={typeof field.value === "string" ? field.value : ""} onChange={field.onChange} onBlur={field.onBlur} error={fieldState.error?.message} />;
}
