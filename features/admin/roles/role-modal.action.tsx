"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Role } from "@/platform/schema/role.schema";
import { RoleModalFeature } from "./role-modal";

interface RoleModalActionProps {
  role?: Role | null;
  label?: string;
  disabled?: boolean;
}

export function RoleModalAction({
  role = null,
  label,
  disabled = false,
}: RoleModalActionProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isRefreshing, startTransition] = useTransition();

  const isEditing = Boolean(role);

  function handleSaved() {
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <>
      <Button
        type="button"
        variant={isEditing ? "outline" : "primary"}
        size="md"
        disabled={disabled || isRefreshing}
        leftIcon={
          isEditing ? (
            <Pencil size={16} aria-hidden="true" />
          ) : (
            <Plus size={17} aria-hidden="true" />
          )
        }
        onClick={() => setOpen(true)}
      >
        {label ?? (isEditing ? "Edit role" : "Add role")}
      </Button>

      <RoleModalFeature
        open={open}
        onOpenChange={setOpen}
        role={role}
        onSaved={handleSaved}
      />
    </>
  );
}