
export const ONBOARDING_STORAGE_KEY =
  "osusubook:onboarding-completed";

export function hasCompletedOnboarding(): boolean {
  try {
    return (
      window.localStorage.getItem(ONBOARDING_STORAGE_KEY) ===
      "true"
    );
  } catch {
    return false;
  }
}

export function saveOnboardingPreference(
  skipNextTime: boolean,
): void {
  try {
    if (skipNextTime) {
      window.localStorage.setItem(
        ONBOARDING_STORAGE_KEY,
        "true",
      );
    } else {
      window.localStorage.removeItem(
        ONBOARDING_STORAGE_KEY,
      );
    }
  } catch {
    // The app should remain usable when browser storage is unavailable.
  }
}
