
import { describe, expect, it } from "vitest";

import { getNavigation } from "@/platform/navigation/get-navigation";
import { PERMISSIONS } from "@/platform/authorization/permissions";

import type { AuthorizationContext } from "@/platform/authorization/authorization.types";

const fullAccessContext: AuthorizationContext = {
  userId: "full-access-user",
  permissions: new Set(Object.values(PERMISSIONS).flatMap(Object.values)),
};

const limitedAccessContext: AuthorizationContext = {
  userId: "limited-access-user",
  permissions: new Set([
    PERMISSIONS.dashboard.view,
    PERMISSIONS.users.view,
  ]),
};

describe("getNavigation", () => {
  it("includes accessible modules for a user with full permissions", () => {
    const navigation = getNavigation(fullAccessContext);
    const keys = navigation.flatMap((section) =>
      section.items.map((item) => item.key),
    );

    expect(keys).toEqual(["dashboard", "users", "roles", "features"]);
  });

  it("excludes modules when the user lacks required permissions", () => {
    const navigation = getNavigation(limitedAccessContext);
    const keys = navigation.flatMap((section) =>
      section.items.map((item) => item.key),
    );

    expect(keys).toEqual(["dashboard", "users"]);
  });

  it("omits navigation groups that have no accessible modules", () => {
    const navigation = getNavigation(limitedAccessContext);

    expect(navigation.map((section) => section.group)).toEqual([
      "Overview",
      "Administration",
    ]);
  });
});
