
"use client";

import { useFormContext, type FieldValues } from "react-hook-form";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FormActionsProps {
  submitLabel?: string;
  submittingLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  disabled?: boolean;
  className?: string;
  align?: "start" | "end" | "between";
}

export function FormActions({
  submitLabel = "Save changes",
  submittingLabel = "Saving...",
  cancelLabel = "Cancel",
  onCancel,
  disabled = false,
  className,
  align = "end",
}: FormActionsProps) {
  const { formState } = useFormContext<FieldValues>();
  const isSubmitting = formState.isSubmitting;

  const alignment = {
    start: "justify-start",
    end: "justify-end",
    between: "justify-between",
  }[align];

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 border-t border-border pt-4",
        alignment,
        className,
      )}
    >
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {cancelLabel}
        </Button>
      )}

      <Button
        type="submit"
        disabled={disabled || isSubmitting}
      >
        {isSubmitting && (
          <LoaderCircle className="mr-2 size-4 animate-spin" />
        )}
        {isSubmitting ? submittingLabel : submitLabel}
      </Button>
    </div>
  );
}
