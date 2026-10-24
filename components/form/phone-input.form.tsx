"use client";

import { useController, useFormContext, type FieldValues } from "react-hook-form";
import { PhoneInput, type PhoneInputProps } from "@/components/ui/phone-input";

type PhoneInputFormProps = Omit<PhoneInputProps, "value" | "defaultValue" | "onChange" | "onBlur" | "name" | "error"> & { name: string };

export function PhoneInputForm({ name, ...props }: PhoneInputFormProps) {
  const { control } = useFormContext<FieldValues>();
  const { field, fieldState } = useController({ name, control });
  return <PhoneInput {...props} name={field.name} value={typeof field.value === "string" ? field.value : ""} onChange={field.onChange} onBlur={field.onBlur} error={fieldState.error?.message} />;
}
