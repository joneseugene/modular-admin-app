
"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ManagementModalSize =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "full";

export interface ManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: ManagementModalSize;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  contentClassName?: string;
  bodyClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
}

const sizeClasses: Record<ManagementModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "h-[100dvh] max-h-[100dvh] w-screen max-w-none rounded-none p-0 sm:rounded-none",
};

export function ManagementModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "md",
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  contentClassName,
  bodyClassName,
  headerClassName,
  footerClassName,
}: ManagementModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        onPointerDownOutside={(event) => {
          if (!closeOnBackdrop) event.preventDefault();
        }}
        onEscapeKeyDown={(event) => {
          if (!closeOnEscape) event.preventDefault();
        }}
        className={cn(
          "flex w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden p-0",
          "max-h-[90dvh]",
          sizeClasses[size],
          size === "full" && "h-[100dvh] max-h-[100dvh] w-screen",
          contentClassName,
        )}
      >
        <DialogHeader
          className={cn(
            "shrink-0 border-b px-5 py-4 text-left sm:px-6",
            size === "full" && "px-4 sm:px-8",
            headerClassName,
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 space-y-1">
              <DialogTitle className="text-lg font-semibold">
                {title}
              </DialogTitle>

              {description && (
                <DialogDescription>
                  {description}
                </DialogDescription>
              )}
            </div>

            {showCloseButton && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="-mr-2 -mt-1 shrink-0"
                aria-label="Close dialog"
                onClick={() => onOpenChange(false)}
              >
                <X className="size-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div
          className={cn(
            "min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6",
            size === "full" && "px-4 py-5 sm:px-8 sm:py-6",
            bodyClassName,
          )}
        >
          {children}
        </div>

        {footer && (
          <div
            className={cn(
              "shrink-0 border-t bg-background px-5 py-4 sm:px-6",
              size === "full" && "px-4 sm:px-8",
              footerClassName,
            )}
          >
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
