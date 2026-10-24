
"use client";

import * as React from "react";

import { SplashScreen } from "./splash-screen";

const SPLASH_DURATION_MS = 1500;

interface AppEntryGateProps {
  children: React.ReactNode;
}

export function AppEntryGate({ children }: AppEntryGateProps) {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, SPLASH_DURATION_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
