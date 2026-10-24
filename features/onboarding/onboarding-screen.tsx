
"use client";

import * as React from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { ONBOARDING_SLIDES } from "./onboarding-slides";

interface OnboardingScreenProps {
  onComplete: (skipNextTime: boolean) => void;
}

export function OnboardingScreen({
  onComplete,
}: OnboardingScreenProps) {
  const [slideIndex, setSlideIndex] = React.useState(0);
  const [skipNextTime, setSkipNextTime] = React.useState(false);

  const slide = ONBOARDING_SLIDES[slideIndex];
  const SlideIcon = slide.Icon;
  const isLastSlide =
    slideIndex === ONBOARDING_SLIDES.length - 1;

  const goNext = () => {
    if (isLastSlide) {
      onComplete(skipNextTime);
      return;
    }

    setSlideIndex((current) => current + 1);
  };

  const goBack = () => {
    setSlideIndex((current) => Math.max(0, current - 1));
  };

  return (
    <main className="safe-area-top safe-area-bottom flex min-h-dvh flex-col bg-[#F8FAF5] text-[#111827]">
      <header className="mx-auto flex w-full max-w-lg items-center justify-between px-5 pb-4 pt-5 sm:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#16834A] text-white">
            <BookOpen className="size-5" aria-hidden="true" />
          </div>

          <span className="text-base font-extrabold tracking-tight">
            OsusuBook
          </span>
        </div>

        <button
          type="button"
          onClick={() => onComplete(skipNextTime)}
          className="touch-target rounded-full px-3 text-sm font-semibold text-slate-500 transition hover:bg-black/5 hover:text-[#111827]"
        >
          Skip
        </button>
      </header>

      <section
        aria-labelledby="onboarding-title"
        className="mx-auto flex w-full max-w-lg flex-1 flex-col px-5 pb-5 sm:px-8"
      >
        <div className="relative mt-2 flex min-h-[245px] flex-1 flex-col items-center justify-center overflow-hidden rounded-[2rem] bg-[#E8F3E9] px-6 py-8 text-center">
          <div className="absolute -right-12 -top-12 size-36 rounded-full bg-[#F4C542]/45" />
          <div className="absolute -bottom-16 -left-10 size-40 rounded-full bg-[#16834A]/10" />

          <div className="relative flex size-28 items-center justify-center rounded-[2rem] border border-white/80 bg-white shadow-lg shadow-[#105D35]/10">
            <SlideIcon
              aria-hidden="true"
              className="size-12 text-[#16834A]"
              strokeWidth={1.7}
            />

            <span className="absolute -bottom-2 -right-2 flex size-9 items-center justify-center rounded-full border-4 border-[#E8F3E9] bg-[#F4C542] text-sm font-extrabold text-[#111827]">
              {slide.number}
            </span>
          </div>

          <div className="relative mt-6 flex flex-wrap justify-center gap-2">
            {slide.highlights.map((highlight) => (
              <span
                key={highlight}
                className="rounded-full border border-[#16834A]/10 bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#105D35]"
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>

        <div className="pb-3 pt-7">
          <p className="text-xs font-extrabold tracking-[0.18em] text-[#16834A]">
            {slide.eyebrow}
          </p>

          <h1
            id="onboarding-title"
            className="mt-3 max-w-md text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl"
          >
            {slide.title}
          </h1>

          <p className="mt-4 max-w-md text-base leading-7 text-slate-600">
            {slide.description}
          </p>
        </div>

        <div
          className="mt-4 flex items-center justify-center gap-2 py-3"
          aria-label={`Slide ${slideIndex + 1} of ${ONBOARDING_SLIDES.length}`}
        >
          {ONBOARDING_SLIDES.map((item, index) => (
            <span
              key={item.number}
              aria-current={index === slideIndex ? "step" : undefined}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === slideIndex
                  ? "w-8 bg-[#16834A]"
                  : "w-2 bg-[#16834A]/20"
              }`}
            />
          ))}
        </div>

        <div className="mt-2 rounded-2xl border border-[#DCE5DA] bg-white p-4">
          <Checkbox
            id="skip-onboarding-next-time"
            checked={skipNextTime}
            onChange={setSkipNextTime}
            label="Don't show this again"
            description="Open OsusuBook directly next time on this browser."
          />
        </div>

        <div className="mt-5 flex items-center gap-3 pb-2">
          {slideIndex > 0 && (
            <button
              type="button"
              onClick={goBack}
              aria-label="Previous onboarding slide"
              className="touch-target flex items-center justify-center rounded-2xl border border-[#DCE5DA] bg-white px-4 text-[#111827] transition hover:bg-[#EDF1E9]"
            >
              <ArrowLeft className="size-5" />
            </button>
          )}

          <button
            type="button"
            onClick={goNext}
            className="touch-target flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#16834A] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#16834A]/15 transition hover:bg-[#105D35] active:scale-[0.99]"
          >
            {isLastSlide ? (
              <>
                <CheckCircle2 className="size-5" />
                Get started
              </>
            ) : (
              <>
                Next
                <ArrowRight className="size-5" />
              </>
            )}
          </button>
        </div>

        <p className="pb-1 pt-3 text-center text-xs text-slate-400">
          A simpler way to save together.
        </p>
      </section>
    </main>
  );
}
