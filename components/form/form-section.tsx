
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface FormSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function FormSection({
  title,
  description,
  children,
  className,
  contentClassName,
}: FormSectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className="text-base font-semibold tracking-tight">
              {title}
            </h3>
          )}

          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}

      <div className={cn("space-y-4", contentClassName)}>
        {children}
      </div>
    </section>
  );
}
