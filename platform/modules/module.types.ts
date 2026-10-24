
import type { LucideIcon } from "lucide-react";
import type { Permission } from "@/platform/authorization/permissions";

export type NavigationGroup =
  | "Overview"
  | "Administration"
  | "System";

export interface ModuleDefinition<
  TKey extends string = string,
> {
  /** Stable identifier used by application code. */
  key: TKey;

  /** Canonical application route. */
  path: string;

  /** Human-readable module name. */
  label: string;

  /** Short description shown in the interface. */
  description: string;

  /** Icon rendered by shared navigation components. */
  icon: LucideIcon;

  /** Navigation section containing this module. */
  group: NavigationGroup;

  /** Lower values appear first within a navigation section. */
  order: number;

  /** Whether the module is available in application configuration. */
  enabled: boolean;

  /** Whether the module appears in the sidebar. */
  showInSidebar: boolean;

  /** Whether the module appears in the header. */
  showInHeader: boolean;

  /** Capabilities required to access this module. */
  requiredPermissions: readonly Permission[];
}
