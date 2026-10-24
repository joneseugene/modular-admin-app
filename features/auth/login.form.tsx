"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, Eye, EyeOff, ShieldCheck } from "lucide-react";

import { getBrowserAuthService } from "@/platform/services/auth/auth.browser";
import { ROUTES } from "@/config/routes";

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const result = await getBrowserAuthService().signInWithPassword(
        email.trim(),
        password,
      );

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      router.replace(ROUTES.admin.dashboard);
      router.refresh();
    } catch {
      setError(
        "Unable to sign in. Please check your connection and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-dvh w-full items-center justify-center bg-[#F8FAF7] px-5 py-10 text-[#111827] sm:px-8">
      <div className="w-full max-w-[360px]">
        {/* Brand */}
        <header className="mb-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16834A]"
            aria-label="OsusuBook home"
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-[#16834A] text-white">
              <BookOpen size={21} strokeWidth={2} />
            </span>
            <span className="text-xl font-bold tracking-tight">OsusuBook</span>
          </Link>
        </header>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Access your administration workspace.
          </p>
        </div>

        {/* Form — no card or surrounding panel */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              inputMode="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="h-12 w-full rounded-md border border-slate-300 bg-transparent px-3.5 text-base outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#16834A] focus:ring-2 focus:ring-[#16834A]/15"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <Link
                href={ROUTES.auth.forgot_password}
                className="text-sm font-medium text-[#16834A] hover:text-[#105D35] hover:underline hover:underline-offset-4"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="h-12 w-full rounded-md border border-slate-300 bg-transparent px-3.5 pr-12 text-base outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#16834A] focus:ring-2 focus:ring-[#16834A]/15"
              />

              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute right-1 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 transition hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16834A]"
              >
                {showPassword ? (
                  <EyeOff size={18} aria-hidden="true" />
                ) : (
                  <Eye size={18} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              aria-live="polite"
              className="text-sm leading-5 text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#16834A] px-4 text-sm font-semibold text-white transition hover:bg-[#105D35] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16834A] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Signing in...
              </>
            ) : (
              <>
                Sign in
                <ArrowRight size={17} aria-hidden="true" />
              </>
            )}
          </button>
        </form>

        {/* Registration link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            New to OsusuBook?{" "}
            <Link
              href={ROUTES.auth.register}
              className="font-semibold text-[#16834A] hover:text-[#105D35] hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16834A]"
            >
              Create an account
            </Link>
          </p>
        </div>

        <footer className="mt-8 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} OsusuBook
        </footer>
      </div>
    </main>
  );
}
