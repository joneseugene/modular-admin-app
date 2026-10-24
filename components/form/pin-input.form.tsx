
"use client";

import {
  useController,
  useFormContext,
  type FieldValues,
} from "react-hook-form";

import {
  PinInput,
  type PinInputProps,
} from "@/components/ui/pin-input";

type PinInputFormProps = Omit<
  PinInputProps,
  | "name"
  | "value"
  | "defaultValue"
  | "onChange"
  | "onBlur"
  | "error"
> & {
  name: string;
};

export function PinInputForm({
  name,
  ...props
}: PinInputFormProps) {
  const { control } = useFormContext<FieldValues>();

  const { field, fieldState } = useController({
    name,
    control,
  });

  return (
    <PinInput
      {...props}
      name={field.name}
      ref={field.ref}
      value={typeof field.value === "string" ? field.value : ""}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={fieldState.error?.message}
    />
  );
}
