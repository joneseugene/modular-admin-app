"use client";

import { useController, useFormContext, type FieldValues } from "react-hook-form";
import { CountrySelect, type CountrySelectProps } from "@/components/ui/country-select";

type CountrySelectFormProps = Omit<CountrySelectProps, "value" | "defaultValue" | "onChange" | "onBlur" | "name" | "error"> & { name: string };

export function CountrySelectForm({ name, ...props }: CountrySelectFormProps) {
  const { control } = useFormContext<FieldValues>();
  const { field, fieldState } = useController({ name, control });
  return <CountrySelect {...props} name={field.name} value={typeof field.value === "string" ? field.value : "SL"} onChange={field.onChange} onBlur={field.onBlur} error={fieldState.error?.message} />;
}
