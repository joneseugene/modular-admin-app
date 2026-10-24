import {
  Blocks,
  LayoutDashboard,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import type { ModuleDefinition } from "@/platform/modules/module.types";
import { ROUTES } from "@/config/routes";
import { PERMISSIONS } from "@/platform/authorization/permissions";

export type FeatureKey =
  | "dashboard"
  | "users"
  | "roles"
  | "features"
  | "profile";

export type FeatureDefinition = ModuleDefinition<FeatureKey>;

export const FEATURES = {
  dashboard: {
    key: "dashboard",
    path: ROUTES.admin.dashboard,
    label: "Dashboard",
    description: "Overview of your application",
    icon: LayoutDashboard,
    group: "Overview",
    order: 1,
    enabled: true,
    showInSidebar: true,
    showInHeader: false,
    requiredPermissions: [],
  },

  users: {
    key: "users",
    path: ROUTES.admin.users,
    label: "Users",
    description: "Manage application users",
    icon: Users,
    group: "Administration",
    order: 2,
    enabled: true,
    showInSidebar: true,
    showInHeader: false,
    requiredPermissions: [PERMISSIONS.users.view],
  },

  roles: {
    key: "roles",
    path: ROUTES.admin.roles,
    label: "Roles & Permissions",
    description: "Manage access policies",
    icon: ShieldCheck,
    group: "Administration",
    order: 3,
    enabled: true,
    showInSidebar: true,
    showInHeader: false,
    requiredPermissions: [PERMISSIONS.roles.view],
  },

  features: {
    key: "features",
    path: ROUTES.admin.features,
    label: "Feature Registry",
    description: "Inspect registered application modules",
    icon: Blocks,
    group: "System",
    order: 4,
    enabled: true,
    showInSidebar: true,
    showInHeader: false,
    requiredPermissions: [PERMISSIONS.features.view],
  },

  profile: {
    key: "profile",
    path: "/profile",
    label: "My Profile",
    description: "View and update your account profile.",
    icon: User,
    group: "Administration",
    order: 100,
    enabled: true,
    showInSidebar: false,
    showInHeader: false,
    requiredPermissions: [],
  },
} satisfies Record<FeatureKey, FeatureDefinition>;

export const FEATURE_LIST: FeatureDefinition[] = Object.values(FEATURES).sort(
  (a, b) => a.order - b.order,
);
