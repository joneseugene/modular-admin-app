"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import {
  updateMyProfileAction,
  type ProfileFormState,
} from "@/platform/actions/profile.action";

import { RHFForm } from "@/components/form/form";
import { FormActions } from "@/components/form/form-actions";
import { AvatarUploadForm } from "@/components/form/avatar-upload.form";
import { ProfileForm } from "./profile.form";

import {
  profileSchema,
  type ProfileFormValues,
} from "@/platform/schema/profile.schema";

import { uploadProfilePhoto } from "@/platform/services/data/upload-photo.action";

interface ProfileFeatureProps {
  id: string;
  displayName: string;
  email?: string | null;
  designation?: string | null;
  roleLabel: string;
  phone: string;
  photo?: string | null;
}

const initialState: ProfileFormState = {
  success: false,
  message: "",
};

export function ProfileFeature({
  id,
  displayName,
  email = "",
  designation = "",
  roleLabel,
  phone,
  photo = null,
}: ProfileFeatureProps) {
  const router = useRouter();
  const [state, setState] = useState<ProfileFormState>(initialState);

  const methods = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onBlur",
    defaultValues: {
      display_name: displayName,
      email: email ?? "",
      designation: designation ?? "",
      phone: phone ?? "",
      photo: photo ?? null,
      photoFile: null,
    },
  });

  const {
    reset,
    getValues,
    watch,
    formState: { isDirty, isSubmitting },
  } = methods;

  const currentDisplayName = watch("display_name");
  const currentEmail = watch("email");
  const currentDesignation = watch("designation");

  async function onSubmit(values: ProfileFormValues) {
    setState(initialState);

    try {
      let savedPhoto = values.photo ?? null;

      if (values.photoFile instanceof File) {
        const uploaded = await uploadProfilePhoto(id, values.photoFile);
        savedPhoto = uploaded.publicUrl;
      }

      const formData = new FormData();

      formData.set("display_name", values.display_name);
      formData.set("email", values.email);
      formData.set("designation", values.designation);
      formData.set("phone", values.phone);
      formData.set("photo", savedPhoto ?? "");

      const result = await updateMyProfileAction(initialState, formData);

      setState(result);

      if (result.success) {
        reset({
          ...getValues(),
          photo: savedPhoto,
          photoFile: null,
        });

        router.refresh();
      }
    } catch (error) {
      setState({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to update your profile. Please try again.",
      });
    }
  }

  return (
    <RHFForm
      methods={methods}
      onSubmit={onSubmit}
      className="max-w-3xl space-y-8"
    >
      <section
        aria-labelledby="profile-identity-heading"
        className="flex flex-col gap-4 border-b border-slate-200 pb-7 sm:flex-row sm:items-center"
      >
        <AvatarUploadForm
          name="photo"
          fileName="photoFile"
          displayName={currentDisplayName || displayName}
          size="2xl"
        />

        <div className="min-w-0 flex-1">
          <h2
            id="profile-identity-heading"
            className="truncate text-xl font-semibold text-slate-900"
          >
            {currentDisplayName?.trim() || displayName}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {currentDesignation?.trim() || roleLabel}
          </p>

          {currentEmail && (
            <p className="mt-1 truncate text-sm text-slate-500">
              {currentEmail}
            </p>
          )}
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800">
          <span className="size-2 rounded-full bg-emerald-600" />
          Active account
        </div>
      </section>

      <section aria-labelledby="personal-information-heading">
        <ProfileForm />
      </section>

      {state.message && (
        <p
          role={state.success ? "status" : "alert"}
          className={
            state.success
              ? "rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
              : "rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive"
          }
        >
          {state.message}
        </p>
      )}

      <FormActions
        submitLabel="Save changes"
        submittingLabel="Saving changes..."
        disabled={!isDirty || isSubmitting}
      />
    </RHFForm>
  );
}
