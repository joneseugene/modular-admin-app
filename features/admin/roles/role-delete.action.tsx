
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Role } from "@/platform/schema/role.schema";
import { DeleteRecordModal } from "@/components/modal";
import { deleteRoleAction } from "@/platform/actions/role.action";

interface RoleDeleteActionProps {
  role: Pick<Role, "id" | "name" | "is_system">;
}

export function RoleDeleteAction({ role }: RoleDeleteActionProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (role.is_system) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled
        title="System roles cannot be deleted"
        aria-label={`${role.name} is a system role and cannot be deleted`}
      >
        <Trash2 className="size-4" aria-hidden="true" />
      </Button>
    );
  }

  async function handleDelete() {
    await new Promise<void>((resolve, reject) => {
      startTransition(async () => {
        try {
          const result = await deleteRoleAction(role.id);

          if (!result.success) {
            reject(
              new Error(
                "message" in result && typeof result.message === "string"
                  ? result.message
                  : "Unable to delete this role. Please try again.",
              ),
            );
            return;
          }

          setOpen(false);
          router.refresh();
          resolve();
        } catch (error) {
          reject(
            error instanceof Error
              ? error
              : new Error("Unable to delete this role. Please try again."),
          );
        }
      });
    });
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        title="Delete role"
        aria-label={`Delete ${role.name}`}
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="size-4" aria-hidden="true" />
      </Button>

      <DeleteRecordModal
        open={open}
        onOpenChange={setOpen}
        recordName={role.name}
        title="Delete role"
        description={`Are you sure you want to delete the "${role.name}" role? Users or permissions associated with this role may be affected.`}
        confirmLabel="Delete role"
        reasonMode="hidden"
        onConfirm={handleDelete}
      />
    </>
  );
}
