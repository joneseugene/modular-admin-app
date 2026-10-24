
import "server-only";

import { authorize } from "@/platform/authorization/authorize";
import type { AuthorizationContext, AuthorizationResult } from "@/platform/authorization/authorization.types";
import type { Permission } from "@/platform/authorization/permissions";
import type { ServerAuthorizationContext } from "./get-server-auth-context";
import { getServerAuthorizationContext } from "./get-server-auth-context";
import type { ServiceError } from "../services/result.types";

export type PermissionGuardResult =
  | {
      success: true;
      context: ServerAuthorizationContext;
      authorization: AuthorizationResult;
    }
  | {
      success: false;
      reason:
        | "unauthenticated"
        | "inactive_account"
        | "missing_permission"
        | "authorization_error";
      error?: ServiceError;
    };

export async function requirePermission(
  permission: Permission,
): Promise<PermissionGuardResult> {
  const result = await getServerAuthorizationContext();

  if (!result.success) {
    return {
      success: false,
      reason: "authorization_error",
      error: result.error,
    };
  }

  if (!result.data) {
    return {
      success: false,
      reason: "unauthenticated",
    };
  }

  if (!result.data.isActive) {
    return {
      success: false,
      reason: "inactive_account",
    };
  }

  // Explicitly adapt the richer server context to the authorization contract.
  const authorizationContext: AuthorizationContext = {
    userId: result.data.userId,
    permissions: result.data.permissions,
  };

  const authorization = authorize(authorizationContext, permission);

  if (!authorization.allowed) {
    return {
      success: false,
      reason: "missing_permission",
    };
  }

  return {
    success: true,
    context: result.data,
    authorization,
  };
}
