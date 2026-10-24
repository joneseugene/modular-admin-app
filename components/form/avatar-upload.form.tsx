"use client";

import {
  useController,
  useFormContext,
  type FieldValues,
} from "react-hook-form";

import {
  AvatarUpload,
  type AvatarUploadProps,
} from "@/components/ui/avatar-upload";

type AvatarUploadFormProps = Omit<
  AvatarUploadProps,
  "value" | "name" | "onFileChange" | "onValueChange"
> & {
  name: string;
  fileName?: string;
  displayName?: string | null;
};

export function AvatarUploadForm({
  name,
  fileName = `${name}File`,
  displayName,
  ...props
}: AvatarUploadFormProps) {
  const { control } = useFormContext<FieldValues>();

  const { field, fieldState } = useController({
    name,
    control,
  });

  const { field: fileField } = useController({
    name: fileName,
    control,
    defaultValue: null,
  });

  return (
    <div className="space-y-2">
      <AvatarUpload
        {...props}
        name={displayName}
        value={typeof field.value === "string" ? field.value : null}
        onFileChange={(file) => {
          fileField.onChange(file);
        }}
        onValueChange={(value) => {
          if (value === null) {
            field.onChange(null);
            fileField.onChange(null);
          }
        }}
      />

      {fieldState.error?.message && (
        <p role="alert" className="text-sm text-destructive">
          {fieldState.error.message}
        </p>
      )}
    </div>
  );
}