
"use client";

import {
  useController,
  useFormContext,
  type FieldValues,
} from "react-hook-form";

import {
  Textarea,
  type TextareaProps,
} from "@/components/ui/textarea";

type TextareaFormProps = Omit<
  TextareaProps,
  | "name"
  | "value"
  | "defaultValue"
  | "onChange"
  | "onBlur"
  | "error"
> & {
  name: string;
};

export function TextareaForm({
  name,
  ...props
}: TextareaFormProps) {
  const { control } = useFormContext<FieldValues>();

  const { field, fieldState } = useController({
    name,
    control,
  });

  return (
    <Textarea
      {...props}
      name={field.name}
      ref={field.ref}
      value={field.value ?? ""}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={fieldState.error?.message}
    />
  );
}
