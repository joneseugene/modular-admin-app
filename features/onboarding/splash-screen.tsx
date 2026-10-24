
"use client";

import { BookOpen, Sparkles } from "lucide-react";

export function SplashScreen() {
  return (
    <main
      aria-label="Loading OsusuBook"
      className="safe-area-top safe-area-bottom flex min-h-dvh items-center justify-center overflow-hidden bg-[#16834A] px-6 text-white"
    >
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        <div className="relative mb-7 flex size-28 items-center justify-center rounded-[2rem] bg-white shadow-2xl shadow-black/15">
          <BookOpen
            aria-hidden="true"
            className="size-14 text-[#16834A]"
            strokeWidth={1.8}
          />

          <span className="absolute -right-2 -top-2 flex size-10 items-center justify-center rounded-full border-4 border-[#16834A] bg-[#F4C542] text-[#111827]">
            <Sparkles className="size-5" aria-hidden="true" />
          </span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight">
          OsusuBook
        </h1>

        <p className="mt-2 text-sm text-white/80">
          Your savings. Your people. Your progress.
        </p>

        <div
          className="mt-12 h-1.5 w-36 overflow-hidden rounded-full bg-white/20"
          role="progressbar"
          aria-label="Loading"
        >
          <div className="h-full w-2/3 animate-pulse rounded-full bg-[#F4C542]" />
        </div>

        <p className="mt-4 text-xs text-white/65">
          Making group savings simpler.
        </p>
      </div>
    </main>
  );
}
