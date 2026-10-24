
import { FEATURE_LIST } from "@/config/features";
import type { AuthorizationContext } from "@/platform/authorization/authorization.types";
import type {
  ModuleDefinition,
  NavigationGroup,
} from "@/platform/modules/module.types";
import { resolveModuleAccess } from "../modules/module.access";

const GROUP_ORDER: readonly NavigationGroup[] = [
  "Overview",
  "Administration",
  "System",
];

export interface NavigationSection {
  group: NavigationGroup;
  items: ModuleDefinition[];
}

export function getNavigation(
  context: AuthorizationContext,
): NavigationSection[] {
  const visibleFeatures = FEATURE_LIST.filter((feature) => {
    if (!feature.showInSidebar) {
      return false;
    }

    return resolveModuleAccess(feature, context).allowed;
  });

  return GROUP_ORDER
    .map((group) => ({
      group,
      items: visibleFeatures.filter(
        (feature) => feature.group === group,
      ),
    }))
    .filter((section) => section.items.length > 0);
}
