
"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AlertCircle, ShieldCheck } from "lucide-react";

import {
  roleCreateSchema,
  type Role,
  type RoleFormData,
} from "@/platform/schema/role.schema";
import { ManagementModal } from "@/components/modal";
import { RHFForm } from "@/components/form/form";
import { FormSection } from "@/components/form/form-section";
import { FormField } from "@/components/form/form-field";
import { InputForm } from "@/components/form/input.form";
import { TextareaForm } from "@/components/form/textarea.form";
import { FormActions } from "@/components/form/form-actions";
import {
  createRoleAction,
  updateRoleAction,
} from "@/platform/actions/role.action";

export interface RoleModalFeatureProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: Role | null;
  onSaved?: () => void | Promise<void>;
}

export function RoleModalFeature({
  open,
  onOpenChange,
  role = null,
  onSaved,
}: RoleModalFeatureProps) {
  const isEditing = Boolean(role);

  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<RoleFormData>({
    resolver: zodResolver(roleCreateSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { reset, formState } = form;

  useEffect(() => {
    if (!open) return;

    reset({
      name: role?.name ?? "",
      description: role?.description ?? "",
    });

    setErrorMessage("");
  }, [open, role, reset]);

  async function handleSubmit(values: RoleFormData) {
    setErrorMessage("");

    const payload = {
      name: values.name.trim(),
      description: values.description?.trim() || null,
    };

    try {
      const result =
        isEditing && role
          ? await updateRoleAction(role.id, payload)
          : await createRoleAction(payload);

      if (!result.success) {
        setErrorMessage(result.error.message);
        return;
      }

      await onSaved?.();
      onOpenChange(false);

      reset({
        name: "",
        description: "",
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving the role.",
      );
    }
  }

  return (
    <ManagementModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? "Edit role" : "Create role"}
      description={
        isEditing
          ? "Update the role's name and description."
          : "Create a role to organize access across the platform."
      }
      size="lg"
      closeOnBackdrop={!formState.isSubmitting}
      closeOnEscape={!formState.isSubmitting}
      showCloseButton={!formState.isSubmitting}
    >
      <RHFForm methods={form} onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-start gap-3 rounded-lg border border-emerald-100 bg-emerald-50/70 p-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-800">
            <ShieldCheck size={21} aria-hidden="true" />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-900">
              Role configuration
            </p>

            <p className="mt-1 text-sm leading-5 text-slate-600">
              Give the role a clear name. Its machine-readable identifier
              will be generated automatically from that name.
            </p>
          </div>
        </div>

        <FormSection
          title="Basic information"
          description="Enter the details used to identify this role."
        >
          <FormField
            name="name"
            label="Role name"
            description="The role identifier is generated automatically from this name."
            required
          >
            {({ id, invalid, describedBy }) => (
              <InputForm
                id={id}
                name="name"
                placeholder="e.g. Content Manager"
                autoComplete="off"
                aria-invalid={invalid}
                aria-describedby={describedBy}
                disabled={formState.isSubmitting}
              />
            )}
          </FormField>

          <FormField
            name="description"
            label="Description"
            description="Optional. Explain what this role is intended to do."
          >
            {({ id, invalid, describedBy }) => (
              <TextareaForm
                id={id}
                name="description"
                placeholder="Describe this role's responsibilities..."
                rows={4}
                maxLength={1000}
                aria-invalid={invalid}
                aria-describedby={describedBy}
                disabled={formState.isSubmitting}
              />
            )}
          </FormField>
        </FormSection>

        {errorMessage && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
          >
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
              aria-hidden="true"
            />
            <p>{errorMessage}</p>
          </div>
        )}

        <FormActions
          submitLabel={isEditing ? "Save changes" : "Create role"}
          submittingLabel={
            isEditing ? "Saving changes..." : "Creating role..."
          }
          cancelLabel="Cancel"
          onCancel={() => onOpenChange(false)}
          disabled={!formState.isDirty || formState.isSubmitting}
        />
      </RHFForm>
    </ManagementModal>
  );
}
