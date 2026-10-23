import {
  Blocks,
  LayoutDashboard,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

import { ROUTES } from "@/config/routes";

export type FeatureKey =
  | "dashboard"
  | "users"
  | "roles"
  | "features";

export type NavigationGroup =
  | "Overview"
  | "Administration"
  | "System";

export interface FeatureDefinition {
  key: FeatureKey;
  path: string;
  label: string;
  description: string;
  icon: LucideIcon;
  group: NavigationGroup;
  order: number;
  enabled: boolean;
  showInSidebar: boolean;
  showInHeader: boolean;
}

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
  },
} satisfies Record<FeatureKey, FeatureDefinition>;

export const FEATURE_LIST: FeatureDefinition[] = Object.values(
  FEATURES,
).sort((a, b) => a.order - b.order);