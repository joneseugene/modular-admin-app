import type {
  AuthorizationContext,
  AuthorizationResult,
} from "@/platform/authorization/authorization.types";

import type { Permission } from "@/platform/authorization/permissions";

export function hasPermission(
  context: AuthorizationContext,
  permission: Permission,
): boolean {
  return context.permissions.has(permission);
}

export function authorize(
  context: AuthorizationContext,
  permission: Permission,
): AuthorizationResult {
  const allowed = hasPermission(context, permission);

  return {
    allowed,
    permission,
    reason: allowed ? "granted" : "missing_permission",
  };
}

export function hasAllPermissions(
  context: AuthorizationContext,
  requiredPermissions: readonly Permission[],
): boolean {
  return requiredPermissions.every((permission) =>
    hasPermission(context, permission),
  );
}

export function hasAnyPermission(
  context: AuthorizationContext,
  requiredPermissions: readonly Permission[],
): boolean {
  return requiredPermissions.some((permission) =>
    hasPermission(context, permission),
  );
}