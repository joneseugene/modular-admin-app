"use client";

import { useController, useFormContext, type FieldValues } from "react-hook-form";
import { Switch, type SwitchProps } from "@/components/ui/switch";

type SwitchFormProps = Omit<SwitchProps, "checked" | "defaultChecked" | "onChange" | "onBlur" | "name" | "error"> & { name: string };

export function SwitchForm({ name, ...props }: SwitchFormProps) {
  const { control } = useFormContext<FieldValues>();
  const { field, fieldState } = useController({ name, control });
  return <Switch {...props} name={field.name} checked={Boolean(field.value)} onChange={field.onChange} onBlur={field.onBlur} error={fieldState.error?.message} />;
}
