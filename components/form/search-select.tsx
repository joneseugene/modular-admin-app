
"use client";

import {
  useController,
  useFormContext,
  type FieldValues,
} from "react-hook-form";

import {
  SearchableSelect,
  type SearchableSelectProps,
} from "@/components/ui/search-select";

type SearchableSelectFormProps = Omit<
  SearchableSelectProps,
  | "name"
  | "value"
  | "defaultValue"
  | "onChange"
  | "onBlur"
  | "error"
> & {
  name: string;
};

export function SearchableSelectForm({
  name,
  ...props
}: SearchableSelectFormProps) {
  const { control } = useFormContext<FieldValues>();

  const { field, fieldState } = useController({
    name,
    control,
  });

  return (
    <SearchableSelect
      {...props}
      name={field.name}
      value={field.value ?? ""}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={fieldState.error?.message}
    />
  );
}
