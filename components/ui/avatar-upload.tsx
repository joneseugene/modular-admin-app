"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Camera } from "lucide-react";

import { Avatar, type AvatarSize } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface AvatarUploadProps {
  value?: string | null;
  name?: string | null;
  onFileChange: (file: File | null) => void;
  onValueChange?: (value: string | null) => void;
  size?: AvatarSize;
  accept?: string;
  maxSizeMB?: number;
  disabled?: boolean;
  className?: string;
}

export function AvatarUpload({
  value,
  name,
  onFileChange,
  onValueChange,
  size = "2xl",
  accept = "image/png,image/jpeg,image/webp,image/avif",
  maxSizeMB = 5,
  disabled = false,
  className,
}: AvatarUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(value ?? null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPreview(value ?? null);
  }, [value]);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  function openFilePicker() {
    if (!disabled) {
      inputRef.current?.click();
    }
  }

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const input = event.currentTarget;
    const file = input.files?.[0];

    if (!file) return;

    setError(null);

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Choose a JPEG, PNG, WebP, or AVIF image.");
      input.value = "";
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Image must be ${maxSizeMB} MB or smaller.`);
      input.value = "";
      return;
    }

    const nextPreview = URL.createObjectURL(file);

    setPreview(nextPreview);
    onFileChange(file);
    onValueChange?.(nextPreview);

    // Allow selecting the same file again later.
    input.value = "";
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative w-fit">
        <button
          type="button"
          onClick={openFilePicker}
          disabled={disabled}
          aria-label={name ? `Change ${name} photo` : "Change profile photo"}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            "group relative block rounded-full",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-ring focus-visible:ring-offset-4",
            "disabled:cursor-not-allowed disabled:opacity-60",
          )}
        >
          <Avatar
            src={preview}
            name={name}
            size={size}
            className={cn(
              "border border-border transition-opacity",
              "group-hover:opacity-85",
            )}
          />

          <span
            aria-hidden="true"
            className={cn(
              "absolute bottom-0 right-0 flex size-8 items-center",
              "justify-center rounded-full border-2 border-background",
              "bg-primary text-primary-foreground shadow-sm",
              "transition-colors group-hover:bg-primary/90",
            )}
          >
            <Camera className="size-4" />
          </span>
        </button>

        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled}
          className="sr-only"
          tabIndex={-1}
          aria-label="Select profile photo"
        />
      </div>

      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="max-w-48 text-sm text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}