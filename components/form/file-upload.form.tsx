"use client";

import { useController, useFormContext, type FieldValues } from "react-hook-form";
import { FileUpload, type FileUploadProps } from "@/components/ui/file-upload";

type FileUploadFormProps = Omit<FileUploadProps, "value" | "defaultValue" | "onChange" | "onBlur" | "name" | "error"> & { name: string };

export function FileUploadForm({ name, ...props }: FileUploadFormProps) {
  const { control } = useFormContext<FieldValues>();
  const { field, fieldState } = useController({ name, control });
  return <FileUpload {...props} name={field.name} value={Array.isArray(field.value) ? field.value as File[] : []} onChange={field.onChange} onBlur={field.onBlur} error={fieldState.error?.message} />;
}
