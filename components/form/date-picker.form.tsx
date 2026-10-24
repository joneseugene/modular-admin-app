
"use client";

import {
  useController,
  useFormContext,
  type FieldValues,
} from "react-hook-form";

import {
  DatePicker,
  type DatePickerProps,
} from "@/components/ui/date-picker";

type DatePickerFormProps = Omit<
  DatePickerProps,
  | "name"
  | "value"
  | "defaultValue"
  | "onChange"
  | "onBlur"
  | "error"
> & {
  name: string;
};

export function DatePickerForm({
  name,
  ...props
}: DatePickerFormProps) {
  const { control } = useFormContext<FieldValues>();

  const { field, fieldState } = useController({
    name,
    control,
  });

  return (
    <DatePicker
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
