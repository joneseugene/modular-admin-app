
import Link from "next/link";

export const metadata = {
  title: "You're offline | OsusuBook",
  description: "Reconnect to continue using OsusuBook.",
};

export default function OfflinePage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-slate-50 px-5 py-10">
      <section className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="size-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 9a15 15 0 0 1 18 0M6.5 12.5a9.5 9.5 0 0 1 11 0M10 16a4 4 0 0 1 4 0M12 20h.01M3 3l18 18"
            />
          </svg>
        </div>

        <h1 className="mt-5 text-xl font-semibold text-slate-900">
          You're offline
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Check your internet connection and try again. For your security,
          account information and administration pages are not stored for
          offline access.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-emerald-800 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-900"
        >
          Try again
        </Link>
      </section>
    </main>
  );
}
