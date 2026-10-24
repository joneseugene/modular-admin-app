import { describe, expect, it } from "vitest";

import { FEATURES } from "@/config/features";
import { PERMISSIONS } from "@/platform/authorization/permissions";

import type { AuthorizationContext } from "@/platform/authorization/authorization.types";
import { resolveModuleAccess } from "@/platform/modules/module.access";

const context: AuthorizationContext = {
  userId: "test-user",
  permissions: new Set([
    PERMISSIONS.dashboard.view,
    PERMISSIONS.users.view,
    PERMISSIONS.roles.view,
  ]),
};

describe("module access resolver", () => {
  it("allows an enabled module when all required permissions exist", () => {
    expect(resolveModuleAccess(FEATURES.users, context)).toEqual({
      allowed: true,
      moduleKey: "users",
      reason: "granted",
    });
  });

  it("denies a module when a required permission is missing", () => {
    expect(resolveModuleAccess(FEATURES.features, context)).toEqual({
      allowed: false,
      moduleKey: "features",
      reason: "missing_permission",
    });
  });

  it("denies a disabled module even when it has no required permissions", () => {
    const disabledDashboard = {
      ...FEATURES.dashboard,
      enabled: false,
    };

    expect(
      resolveModuleAccess(disabledDashboard, context),
    ).toEqual({
      allowed: false,
      moduleKey: "dashboard",
      reason: "module_disabled",
    });
  });

  it("allows an enabled module with no required permissions", () => {
    expect(resolveModuleAccess(FEATURES.dashboard, context)).toEqual({
      allowed: true,
      moduleKey: "dashboard",
      reason: "granted",
    });
  });
});