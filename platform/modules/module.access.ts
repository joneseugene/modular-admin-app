import type { AuthorizationContext } from "@/platform/authorization/authorization.types";
import { hasAllPermissions } from "@/platform/authorization/authorize";
import type { FeatureDefinition } from "@/config/features";

export type ModuleAccessReason =
  | "granted"
  | "module_disabled"
  | "missing_permission";

export interface ModuleAccessResult {
  allowed: boolean;
  moduleKey: FeatureDefinition["key"];
  reason: ModuleAccessReason;
}

export function resolveModuleAccess(
  module: FeatureDefinition,
  context: AuthorizationContext,
): ModuleAccessResult {
  if (!module.enabled) {
    return {
      allowed: false,
      moduleKey: module.key,
      reason: "module_disabled",
    };
  }

  const allowed = hasAllPermissions(
    context,
    module.requiredPermissions,
  );

  return {
    allowed,
    moduleKey: module.key,
    reason: allowed ? "granted" : "missing_permission",
  };
}