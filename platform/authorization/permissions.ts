
export const PERMISSIONS = {
  dashboard: {
    view: "dashboard.view",
  },
  users: {
    view: "users.view",
    create: "users.create",
    update: "users.update",
    delete: "users.delete",
  },
  roles: {
    view: "roles.view",
    create: "roles.create",
    update: "roles.update",
    delete: "roles.delete",
    managePermissions: "roles.manage_permissions",
  },
  features: {
    view: "features.view",
    update: "features.update",
  },
} as const;

type PermissionGroups = typeof PERMISSIONS;

export type Permission = {
  [Group in keyof PermissionGroups]:
    PermissionGroups[Group][keyof PermissionGroups[Group]];
}[keyof PermissionGroups];

export const PERMISSION_LIST: Permission[] = Object.values(
  PERMISSIONS,
).flatMap((group) => Object.values(group));
