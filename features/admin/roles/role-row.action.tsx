"use client";

import { useState } from "react";
import { MoreVertical, ShieldCheck, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import type { Role } from "@/platform/schema/role.schema";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RoleModalFeature } from "./role-modal";
import { deleteRoleAction } from "@/platform/actions/role.action";
import { DeleteRecordModal } from "@/components/modal";

interface RoleRowActionsProps {
  role: Role;
}

export function RoleRowActions({ role }: RoleRowActionsProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  async function handleDelete() {
    const result = await deleteRoleAction(role.id);

    if (!result.success) {
      throw new Error(result.error.message);
    }

    setDeleteOpen(false);
    router.refresh();
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Actions for ${role.name}`}
          title="Role actions"
        >
          <MoreVertical className="size-5" aria-hidden="true" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem
            onClick={() => {
              router.push(`/roles/${role.id}`);
            }}
          >
            <ShieldCheck className="mr-2 size-4" aria-hidden="true" />
            View Permissions
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              setEditOpen(true);
            }}
          >
            <Pencil className="mr-2 size-4" aria-hidden="true" />
            Edit Role
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            disabled={role.is_system}
            onClick={() => {
              if (!role.is_system) {
                setDeleteOpen(true);
              }
            }}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 size-4" aria-hidden="true" />
            Delete Role
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RoleModalFeature
        open={editOpen}
        onOpenChange={setEditOpen}
        role={role}
        onSaved={() => {
          setEditOpen(false);
          router.refresh();
        }}
      />

      <DeleteRecordModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        recordName={role.name}
        title="Delete role"
        description={`Are you sure you want to delete "${role.name}"? Users or permissions associated with this role may be affected.`}
        confirmLabel="Delete role"
        reasonMode="hidden"
        onConfirm={handleDelete}
      />
    </>
  );
}
