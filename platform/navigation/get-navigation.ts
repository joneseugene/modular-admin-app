import { FEATURE_LIST } from "@/config/features";

import type {
  FeatureDefinition,
  NavigationGroup,
} from "@/config/features";

const GROUP_ORDER: NavigationGroup[] = [
  "Overview",
  "Administration",
  "System",
];

export interface NavigationSection {
  group: NavigationGroup;
  items: FeatureDefinition[];
}

export function getNavigation(): NavigationSection[] {
  const visibleFeatures = FEATURE_LIST.filter(
    (feature) => feature.enabled && feature.showInSidebar,
  );

  return GROUP_ORDER.map((group) => ({
    group,
    items: visibleFeatures.filter(
      (feature) => feature.group === group,
    ),
  })).filter((section) => section.items.length > 0);
}