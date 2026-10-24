
import "server-only";

import { redirect } from "next/navigation";

import type { Permission } from "@/platform/authorization/permissions";
import { requirePermission } from "./require-permission";
import type { ServerAuthorizationContext } from "./get-server-auth-context";
import { ROUTES } from "@/config/routes";

export async function requirePagePermission(
  permission: Permission,
): Promise<ServerAuthorizationContext> {
  const result = await requirePermission(permission);

  if (!result.success) {
    switch (result.reason) {
      case "unauthenticated":
        redirect(ROUTES.auth.login);

      case "inactive_account":
      case "missing_permission":
        redirect(ROUTES.forbidden);

      case "authorization_error":
        throw new Error(
          `Unable to verify authorization: ${
            result.error?.message ?? "Unknown authorization error."
          }`,
        );
    }
  }

  return result.context;
}
