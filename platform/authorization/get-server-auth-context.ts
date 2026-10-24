
import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  PERMISSION_LIST,
  type Permission,
} from "@/platform/authorization/permissions";
import type { AuthorizationContext } from "@/platform/authorization/authorization.types";
import {
  failure,
  success,
  type ServiceResult,
} from "../services/result.types";

export interface ServerAuthorizationContext
  extends AuthorizationContext {
  isActive: boolean;
  roles: readonly string[];
}

function normalizeError(error: {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
}) {
  return {
    message: error.message,
    ...(error.code ? { code: error.code } : {}),
    ...(error.details ? { details: error.details } : {}),
    ...(error.hint ? { hint: error.hint } : {}),
  };
}

function emptyContext(
  userId: string,
  isActive: boolean,
): ServerAuthorizationContext {
  return {
    userId,
    isActive,
    roles: [],
    permissions: new Set<Permission>(),
  };
}

export async function getServerAuthorizationContext(): Promise<
  ServiceResult<ServerAuthorizationContext | null>
> {
  try {
    const client = await createSupabaseServerClient();

    // Verify the authenticated user on the server.
    const {
      data: { user },
      error: authError,
    } = await client.auth.getUser();

    if (authError) {
  if (authError.message === "Auth session missing!") {
    return success(null);
  }

  return failure(normalizeError(authError));
}

    // No authenticated user.
    if (!user) {
      return success(null);
    }

    // Load the user's profile and check whether the account is active.
    const { data: profile, error: profileError } = await client
      .from("profiles")
      .select("is_active")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      return failure(normalizeError(profileError));
    }

    // Missing or inactive profiles receive no roles or permissions.
    if (!profile || !profile.is_active) {
      return success(emptyContext(user.id, false));
    }

    // Find the roles assigned to this user.
    const { data: userRoles, error: userRolesError } = await client
      .from("user_roles")
      .select("role_id")
      .eq("user_id", user.id);

    if (userRolesError) {
      return failure(normalizeError(userRolesError));
    }

    const roleIds = [
      ...new Set((userRoles ?? []).map((assignment) => assignment.role_id)),
    ];

    if (roleIds.length === 0) {
      return success(emptyContext(user.id, true));
    }

    // Resolve role names and the permissions granted to those roles.
    const [rolesResult, rolePermissionsResult] = await Promise.all([
      client.from("roles").select("id, slug").in("id", roleIds),
      client
        .from("role_permissions")
        .select("permission_id")
        .in("role_id", roleIds),
    ]);

    if (rolesResult.error) {
      return failure(normalizeError(rolesResult.error));
    }

    if (rolePermissionsResult.error) {
      return failure(normalizeError(rolePermissionsResult.error));
    }

    const permissionIds = [
      ...new Set(
        (rolePermissionsResult.data ?? []).map(
          (assignment) => assignment.permission_id,
        ),
      ),
    ];

    if (permissionIds.length === 0) {
      return success({
        userId: user.id,
        isActive: true,
        roles: (rolesResult.data ?? []).map((role) => role.slug),
        permissions: new Set<Permission>(),
      });
    }

    // Load permission keys and accept only permissions recognized by
    // this application's typed permission registry.
    const { data: permissionRows, error: permissionsError } = await client
      .from("permissions")
      .select("key")
      .in("id", permissionIds);

    if (permissionsError) {
      return failure(normalizeError(permissionsError));
    }

    const knownPermissions = new Set<string>(PERMISSION_LIST);
    const permissions = new Set<Permission>();

    for (const row of permissionRows ?? []) {
      if (knownPermissions.has(row.key)) {
        permissions.add(row.key as Permission);
      }
    }

    return success({
      userId: user.id,
      isActive: true,
      roles: (rolesResult.data ?? []).map((role) => role.slug),
      permissions,
    });
  } catch (error) {
    return failure({
      message:
        error instanceof Error
          ? error.message
          : "Unable to load authorization context.",
    });
  }
}
