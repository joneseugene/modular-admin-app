"use client";

import { useController, useFormContext, type FieldValues } from "react-hook-form";
import { Checkbox, type CheckboxProps } from "@/components/ui/checkbox";

type CheckboxFormProps = Omit<CheckboxProps, "checked" | "defaultChecked" | "onChange" | "onBlur" | "name" | "error"> & { name: string };

export function CheckboxForm({ name, ...props }: CheckboxFormProps) {
  const { control } = useFormContext<FieldValues>();
  const { field, fieldState } = useController({ name, control });
  return <Checkbox {...props} name={field.name} checked={Boolean(field.value)} onChange={field.onChange} onBlur={field.onBlur} error={fieldState.error?.message} />;
}
