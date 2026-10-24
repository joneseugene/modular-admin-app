import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  ShieldCheck,
  Sprout,
  UsersRound,
  WalletCards,
} from "lucide-react";

import { ROUTES } from "@/config/routes";

const features = [
  {
    icon: ShieldCheck,
    title: "Keep your records together",
    description:
      "Digital records help protect your group's information if a paper notebook is lost, stolen, damaged by fire, or affected by flooding.",
  },
  {
    icon: ClipboardCheck,
    title: "Track contributions",
    description:
      "Keep a clearer record of who has paid, how much has been contributed, and what is still due.",
  },
  {
    icon: BellRing,
    title: "Keep everyone informed",
    description:
      "Help members stay up to date with their Osusu contributions and payment records as group features become available.",
  },
];

const steps = [
  {
    number: "01",
    icon: UsersRound,
    title: "The Master creates a group",
    description:
      "The person managing the Osusu starts a group and adds its members.",
  },
  {
    number: "02",
    icon: ClipboardCheck,
    title: "Contributions are recorded",
    description:
      "The Master records payments so the group has a clearer record of its savings.",
  },
  {
    number: "03",
    icon: CheckCircle2,
    title: "Records stay organised",
    description:
      "The group can refer to its records and keep track of contributions more easily.",
  },
];

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-[#F8FAF7] text-[#111827]">
      {/* Simple navigation */}
      <header className="mx-auto flex min-h-18 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href="/welcome"
          aria-label="OsusuBook welcome page"
          className="flex items-center gap-2.5"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-[#16834A] text-white">
            <BookOpen size={22} aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-tight">
            Osusu<span className="text-[#16834A]">Book</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href={ROUTES.auth.login}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-[#105D35] hover:bg-[#E8F3E9]"
          >
            Sign in
          </Link>

          <Link
            href={ROUTES.auth.register}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#16834A] px-4 text-sm font-semibold text-white transition hover:bg-[#105D35]"
          >
            Get started
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </header>

      {/* Main welcome card */}
      <section className="px-4 pb-10 pt-3 sm:px-8 sm:pb-14 sm:pt-5">
        <div className="relative mx-auto flex min-h-[390px] max-w-6xl flex-col items-center justify-center overflow-hidden rounded-[2rem] bg-[#16834A] px-6 py-14 text-center text-white shadow-xl shadow-[#105D35]/10 sm:min-h-[450px] sm:px-12 sm:py-20">
          {/* Decorative background shapes */}
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-20 size-64 rounded-full bg-white/5"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-32 -left-20 size-80 rounded-full bg-[#105D35]/35"
          />
          <div
            aria-hidden="true"
            className="absolute right-[15%] top-[18%] size-3 rounded-full bg-[#F4C542]"
          />

          <div className="relative z-10 flex max-w-2xl flex-col items-center">
            <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-white text-[#16834A] shadow-lg shadow-black/10 sm:size-20 sm:rounded-3xl">
              <BookOpen
                size={38}
                strokeWidth={1.8}
                aria-hidden="true"
                className="sm:hidden"
              />
              <BookOpen
                size={46}
                strokeWidth={1.8}
                aria-hidden="true"
                className="hidden sm:block"
              />
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
              Osusu Book
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-white/90 sm:text-lg sm:leading-8">
              Your Osusu, organised in one place. Keep track of contributions,
              manage your group’s records, and save together with greater peace
              of mind.
            </p>

            <Link
              href={ROUTES.auth.register}
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#F4C542] px-6 py-3 text-sm font-bold text-[#111827] shadow-sm transition hover:bg-[#ffda68] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#16834A]"
            >
              Get started with OsusuBook
              <ArrowRight size={17} aria-hidden="true" />
            </Link>

            <p className="mt-4 text-xs font-medium text-white/75 sm:text-sm">
              Made for Osusu groups in Sierra Leone
            </p>
          </div>
        </div>
      </section>

      {/* Introductory section */}
      <section className="px-5 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#E8F3E9] text-[#16834A]">
            <Sprout size={25} aria-hidden="true" />
          </div>

          <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
            Saving together should feel simpler.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
            Osusu is built on people coming together to save and support one
            another. OsusuBook helps Osusu Masters keep records organised
            without depending entirely on a paper notebook.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section
        id="why-osusubook"
        className="border-y border-[#E6EDE5] bg-white px-5 py-12 sm:px-8 sm:py-16"
      >
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#16834A]">
              Why OsusuBook?
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              Everything starts with better records.
            </h2>
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-[#E6EDE5] bg-[#F8FAF7] p-5 sm:p-6"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-[#E8F3E9] text-[#16834A]">
                    <Icon size={23} aria-hidden="true" />
                  </div>

                  <h3 className="mt-5 text-base font-bold">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="px-5 py-12 sm:px-8 sm:py-16"
      >
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#16834A]">
              Simple steps
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              How it works
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              You do not need to be a technology expert. Start with the person
              who manages your Osusu group.
            </p>
          </div>

          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  className="rounded-2xl border border-[#E1E9DF] bg-white p-5 sm:p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#16834A]">
                      STEP {step.number}
                    </span>
                    <span className="flex size-11 items-center justify-center rounded-xl bg-[#E8F3E9] text-[#16834A]">
                      <Icon size={22} aria-hidden="true" />
                    </span>
                  </div>

                  <h3 className="mt-5 font-bold">{step.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Future vision */}
      <section className="px-5 pb-12 sm:px-8 sm:pb-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 rounded-2xl bg-[#E8F3E9] p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold sm:text-2xl">
              More possibilities for the future.
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
              In the future, a member’s Osusu payment history may help build a
              credit profile that could support access to suitable loans.
              This is a future goal, not a promise of credit.
            </p>
          </div>

          <div className="flex size-14 shrink-0 items-center justify-center self-start rounded-2xl bg-white text-[#16834A] md:size-16 md:self-center">
            <WalletCards size={29} aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* Final call to action */}
      <section className="px-5 pb-12 sm:px-8 sm:pb-16">
        <div className="mx-auto max-w-6xl rounded-2xl bg-[#105D35] px-6 py-10 text-center text-white sm:px-10 sm:py-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to start?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/85 sm:text-base">
            Bring your Osusu records together and make it easier to keep track
            of your group’s contributions.
          </p>

          <Link
            href={ROUTES.auth.register}
            className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#F4C542] px-6 py-3 text-sm font-bold text-[#111827] transition hover:bg-[#ffda68]"
          >
            Create your account
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E6EDE5] bg-white px-5 py-6 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <Link href="/welcome" className="flex items-center gap-2">
            <BookOpen
              size={19}
              className="text-[#16834A]"
              aria-hidden="true"
            />
            <span className="font-bold">
              Osusu<span className="text-[#16834A]">Book</span>
            </span>
          </Link>

          <p className="text-xs text-slate-500">
            Built for Osusu groups in Sierra Leone.
          </p>

          <Link
            href={ROUTES.auth.login}
            className="text-sm font-semibold text-[#16834A] hover:text-[#105D35]"
          >
            Already registered? Sign in
          </Link>
        </div>
      </footer>
    </main>
  );
}