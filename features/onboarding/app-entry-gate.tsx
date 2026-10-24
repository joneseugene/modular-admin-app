
"use client";

import * as React from "react";

import { OnboardingScreen } from "./onboarding-screen";
import { SplashScreen } from "./splash-screen";
import {
  hasCompletedOnboarding,
  saveOnboardingPreference,
} from "./onboarding-storage";

const SPLASH_DURATION_MS = 1500;

type EntryStage = "splash" | "onboarding" | "app";

interface AppEntryGateProps {
  children: React.ReactNode;
}

export function AppEntryGate({
  children,
}: AppEntryGateProps) {
  const [stage, setStage] =
    React.useState<EntryStage>("splash");

  React.useEffect(() => {
    let cancelled = false;

    const timer = window.setTimeout(() => {
      if (cancelled) return;

      setStage(
        hasCompletedOnboarding() ? "app" : "onboarding",
      );
    }, SPLASH_DURATION_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  const handleOnboardingComplete = React.useCallback(
    (skipNextTime: boolean) => {
      saveOnboardingPreference(skipNextTime);
      setStage("app");
    },
    [],
  );

  if (stage === "splash") {
    return <SplashScreen />;
  }

  if (stage === "onboarding") {
    return (
      <OnboardingScreen
        onComplete={handleOnboardingComplete}
      />
    );
  }

  return <>{children}</>;
}
