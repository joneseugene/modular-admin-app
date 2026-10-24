"use client";

import {
  useController,
  useFormContext,
  type FieldValues,
} from "react-hook-form";

import { Input, type InputProps } from "@/components/ui/input";

export type InputFormProps = Omit<
  InputProps,
  | "name"
  | "value"
  | "defaultValue"
  | "onChange"
  | "onBlur"
  | "error"
> & {
  name: string;
  onValueChange?: (value: string) => void;
};

export function InputForm({
  name,
  onValueChange,
  ...props
}: InputFormProps) {
  const { control } = useFormContext<FieldValues>();

  const { field, fieldState } = useController({
    name,
    control,
  });

  return (
    <Input
      {...props}
      name={field.name}
      ref={field.ref}
      value={field.value ?? ""}
      onChange={(event) => {
        field.onChange(event);
        onValueChange?.(event.target.value);
      }}
      onBlur={field.onBlur}
      error={fieldState.error?.message}
    />
  );
}