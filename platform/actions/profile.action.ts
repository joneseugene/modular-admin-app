
"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/modules/auth/get-current-profile.module";
import { profileSchema } from "@/platform/schema/profile.schema";
import { createProfileService } from "@/platform/services/data/profile.service";

export interface ProfileFormState {
  success: boolean;
  message: string;
}

const initialState: ProfileFormState = {
  success: false,
  message: "",
};

export async function updateMyProfileAction(
  _previousState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  try {
    const profile = await getCurrentProfile();

    if (!profile) {
      return {
        success: false,
        message: "Your session could not be verified. Please sign in again.",
      };
    }

    if (!profile.isActive) {
      return {
        success: false,
        message: "Your account is inactive. Contact an administrator.",
      };
    }

    const parsed = profileSchema.safeParse({
      display_name: String(formData.get("display_name") ?? ""),
      email: String(formData.get("email") ?? ""),
      designation: String(formData.get("designation") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      photo: formData.get("photo") == null
        ? null
        : String(formData.get("photo")),
    });

    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message
          ?? "Please check your profile information.",
      };
    }

    const values = parsed.data;

    const client = await createSupabaseServerClient();
    const profileService = createProfileService(client);

    const result = await profileService.update(profile.id, {
      display_name: values.display_name,
      email: values.email || null,
      designation: values.designation || null,
      phone: values.phone || null,
      photo: values.photo || null,
    });

    if (!result.success || !result.data) {
      return {
        success: false,
        message: "Unable to update your profile. Please try again.",
      };
    }

    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Your profile has been updated successfully.",
    };
  } catch (error) {
    console.error("[updateMyProfileAction]", error);

    return {
      success: false,
      message: "An unexpected error occurred while updating your profile.",
    };
  }
}
