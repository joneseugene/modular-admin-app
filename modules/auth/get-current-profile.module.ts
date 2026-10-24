
import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createProfileService } from "@/platform/services/data/profile.service";
import { createAuthService } from "@/platform/services/auth/auth.service";

export async function getCurrentProfile() {
  const client = await createSupabaseServerClient();

  const authService = createAuthService(client);
  const authResult = await authService.getCurrentUser();

  if (!authResult.success || !authResult.data) {
    return null;
  }

  const userId = authResult.data.userId;

  const profileService = createProfileService(client);
  const profileResult = await profileService.getById(userId);

  if (!profileResult.success || !profileResult.data) {
    return null;
  }

  const profile = profileResult.data;

  const {
    data: assignments,
    error: assignmentsError,
  } = await client
    .from("user_roles")
    .select("role_id")
    .eq("user_id", userId);

  if (assignmentsError) {
    throw new Error("Unable to retrieve the user's assigned roles.");
  }

  const roleIds = [
    ...new Set(
      (assignments ?? []).map((assignment) => assignment.role_id),
    ),
  ];

  let roleNames: string[] = [];

  if (roleIds.length > 0) {
    const { data: roles, error: rolesError } = await client
      .from("roles")
      .select("name, slug")
      .in("id", roleIds);

    if (rolesError) {
      throw new Error("Unable to retrieve role details.");
    }

    roleNames = (roles ?? []).map((role) => role.name);
  }

  return {
    id: profile.id,
    displayName:
      profile.display_name?.trim() ||
      authResult.data.email ||
      "User",
    email: profile.email,
    designation: profile.designation,
    phone: profile.phone,
    photo: profile.photo,
    isActive: profile.is_active,
    roles: roleNames,
    roleLabel: roleNames.join(", ") || "No role assigned",
  };
}
