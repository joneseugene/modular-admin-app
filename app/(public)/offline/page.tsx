
import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-5 py-10">
      <section className="w-full max-w-sm rounded-3xl border bg-card p-7 text-center shadow-sm">
        <div className="mx-auto mb-5 flex size-20 items-center justify-center rounded-3xl bg-secondary text-primary">
          <svg
            viewBox="0 0 24 24"
            className="size-10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 9a15 15 0 0 1 18 0" />
            <path d="M6.5 12.5a10 10 0 0 1 11 0" />
            <path d="M10 16a4.5 4.5 0 0 1 4 0" />
            <path d="m3 3 18 18" />
            <path d="M12 20h.01" />
          </svg>
        </div>

        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          OsusuBook
        </p>

        <h1 className="text-2xl font-bold tracking-tight">
          You’re offline
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          It looks like your internet connection is unavailable.
          Reconnect to continue managing your Osusu groups and
          contributions.
        </p>

        <div className="mt-6 rounded-2xl bg-accent p-4 text-left text-sm leading-6 text-accent-foreground">
          Your private group details and financial records are
          not stored for offline access.
        </div>

        <Link
          href="/"
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:bg-[#105d35] focus-visible:outline-offset-4"
        >
          Try again
        </Link>
      </section>
    </main>
  );
}
