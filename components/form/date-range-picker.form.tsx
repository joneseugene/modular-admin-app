"use client";

import { useController, useFormContext, type FieldValues } from "react-hook-form";
import { DateRangePicker, type DateRangePickerProps, type DateRangeValue } from "@/components/ui/date-range-picker";

type DateRangePickerFormProps = Omit<DateRangePickerProps, "value" | "defaultValue" | "onChange" | "onBlur" | "name" | "error"> & { name: string };

export function DateRangePickerForm({ name, ...props }: DateRangePickerFormProps) {
  const { control } = useFormContext<FieldValues>();
  const { field, fieldState } = useController({ name, control });
  const value = field.value as DateRangeValue | undefined;
  return <DateRangePicker {...props} name={field.name} value={value && typeof value === "object" ? value : { from: "", to: "" }} onChange={field.onChange} onBlur={field.onBlur} error={fieldState.error?.message} />;
}
