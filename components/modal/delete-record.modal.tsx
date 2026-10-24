
"use client";

import { useState } from "react";
import { AlertTriangle, LoaderCircle, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export type DeleteReasonMode = "hidden" | "optional" | "required";

export interface DeleteRecordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recordName: string;
  title?: string;
  description?: string;
  confirmLabel?: string;
  reasonMode?: DeleteReasonMode;
  reasonLabel?: string;
  reasonPlaceholder?: string;
  onConfirm: (reason?: string) => Promise<void> | void;
}

export function DeleteRecordModal({
  open,
  onOpenChange,
  recordName,
  title = "Delete record",
  description,
  confirmLabel = "Delete",
  reasonMode = "hidden",
  reasonLabel = "Reason for deletion",
  reasonPlaceholder = "Explain why this record is being deleted...",
  onConfirm,
}: DeleteRecordModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const reasonRequired = reasonMode === "required";
  const showReason = reasonMode !== "hidden";

  function handleOpenChange(nextOpen: boolean) {
    if (isDeleting) return;

    onOpenChange(nextOpen);

    if (!nextOpen) {
      setReason("");
      setError("");
    }
  }

  async function handleConfirm() {
    const trimmedReason = reason.trim();

    if (reasonRequired && !trimmedReason) {
      setError("A reason is required before this record can be deleted.");
      return;
    }

    setError("");
    setIsDeleting(true);

    try {
      await onConfirm(
        showReason && trimmedReason ? trimmedReason : undefined,
      );

      setReason("");
      onOpenChange(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete this record. Please try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="w-[calc(100vw-2rem)] max-w-md"
        onPointerDownOutside={(event) => {
          if (isDeleting) event.preventDefault();
        }}
        onEscapeKeyDown={(event) => {
          if (isDeleting) event.preventDefault();
        }}
      >
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="size-5" />
            </div>

            <div className="space-y-1">
              <DialogTitle>{title}</DialogTitle>

              <DialogDescription>
                {description ??
                  `Are you sure you want to delete "${recordName}"? This action may not be reversible.`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {showReason && (
          <div className="space-y-2 py-2">
            <label
              htmlFor="delete-record-reason"
              className="text-sm font-medium"
            >
              {reasonLabel}
              {reasonRequired && (
                <span className="ml-1 text-destructive" aria-hidden="true">
                  *
                </span>
              )}
              {!reasonRequired && (
                <span className="ml-1 text-muted-foreground">
                  (optional)
                </span>
              )}
            </label>

            <Textarea
              id="delete-record-reason"
              value={reason}
              onChange={(event) => {
                setReason(event.target.value);
                if (error) setError("");
              }}
              placeholder={reasonPlaceholder}
              disabled={isDeleting}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "delete-record-error" : undefined}
              rows={3}
              maxLength={1000}
            />

            <p className="text-xs text-muted-foreground">
              {reason.length}/1000 characters
            </p>
          </div>
        )}

        {error && (
          <p
            id="delete-record-error"
            role="alert"
            className={cn("text-sm text-destructive")}
          >
            {error}
          </p>
        )}

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <LoaderCircle className="mr-2 size-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 size-4" />
            )}
            {isDeleting ? "Deleting..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
