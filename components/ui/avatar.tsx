
"use client";

import { useState } from "react";
import { UserRound } from "lucide-react";

import { cn } from "@/lib/utils";

export type AvatarSize = "sm" | "md" | "lg" | "xl" | "2xl";

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string | null;
  fallback?: string;
  size?: AvatarSize;
  className?: string;
  imageClassName?: string;
  onClick?: () => void;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
  xl: "size-16 text-lg",
  "2xl": "size-24 text-2xl",
};

function getInitials(name?: string | null): string {
  if (!name?.trim()) return "";

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function Avatar({
  src,
  alt,
  name,
  fallback,
  size = "md",
  className,
  imageClassName,
  onClick,
}: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);

  const initials = fallback ?? getInitials(name);
  const showImage = Boolean(src) && !imageFailed;

  return (
    <span
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      aria-label={onClick ? `Avatar${name ? ` for ${name}` : ""}` : undefined}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden",
        "rounded-full bg-muted text-muted-foreground font-semibold",
        "select-none",
        onClick && "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        sizeClasses[size],
        className,
      )}
    >
      {showImage ? (
        <img
          src={src!}
          alt={alt ?? (name ? `${name}'s profile picture` : "Profile picture")}
          className={cn("size-full object-cover", imageClassName)}
          onError={() => setImageFailed(true)}
        />
      ) : initials ? (
        <span aria-hidden="true">{initials}</span>
      ) : (
        <UserRound
          aria-hidden="true"
          className="size-1/2"
          strokeWidth={1.7}
        />
      )}
    </span>
  );
}
