import type { Permission } from "@/platform/authorization/permissions";

export interface AuthorizationContext {
  userId: string;
  permissions: ReadonlySet<Permission>;
}

export interface AuthorizationResult {
  allowed: boolean;
  permission: Permission;
  reason: "granted" | "missing_permission";
}