
import { describe, expect, it } from "vitest";

import {
  authorize,
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
} from "@/platform/authorization/authorize";

import type { AuthorizationContext } from "@/platform/authorization/authorization.types";

import { PERMISSIONS } from "@/platform/authorization/permissions";

const adminContext: AuthorizationContext = {
  userId: "test-admin",
  permissions: new Set([
    PERMISSIONS.dashboard.view,
    PERMISSIONS.users.view,
    PERMISSIONS.users.create,
    PERMISSIONS.roles.view,
  ]),
};

describe("authorization service", () => {
  it("grants a permission the user has", () => {
    expect(
      hasPermission(adminContext, PERMISSIONS.users.view),
    ).toBe(true);
  });

  it("denies a permission the user does not have", () => {
    expect(
      hasPermission(adminContext, PERMISSIONS.users.delete),
    ).toBe(false);
  });

  it("returns a structured authorization result", () => {
    expect(
      authorize(adminContext, PERMISSIONS.users.create),
    ).toEqual({
      allowed: true,
      permission: PERMISSIONS.users.create,
      reason: "granted",
    });
  });

  it("explains why access was denied", () => {
    expect(
      authorize(adminContext, PERMISSIONS.users.delete),
    ).toEqual({
      allowed: false,
      permission: PERMISSIONS.users.delete,
      reason: "missing_permission",
    });
  });

  it("requires every permission for hasAllPermissions", () => {
    expect(
      hasAllPermissions(adminContext, [
        PERMISSIONS.users.view,
        PERMISSIONS.users.create,
      ]),
    ).toBe(true);

    expect(
      hasAllPermissions(adminContext, [
        PERMISSIONS.users.view,
        PERMISSIONS.users.delete,
      ]),
    ).toBe(false);
  });

  it("requires at least one permission for hasAnyPermission", () => {
    expect(
      hasAnyPermission(adminContext, [
        PERMISSIONS.users.delete,
        PERMISSIONS.roles.view,
      ]),
    ).toBe(true);

    expect(
      hasAnyPermission(adminContext, [
        PERMISSIONS.users.delete,
        PERMISSIONS.features.update,
      ]),
    ).toBe(false);
  });

  it("treats an empty all-permissions requirement as satisfied", () => {
    expect(hasAllPermissions(adminContext, [])).toBe(true);
  });

  it("treats an empty any-permissions requirement as unsatisfied", () => {
    expect(hasAnyPermission(adminContext, [])).toBe(false);
  });
});
