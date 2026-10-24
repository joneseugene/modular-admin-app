"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  ShieldCheck,
  UserRoundPlus,
} from "lucide-react";

import { getBrowserAuthService } from "@/platform/services/auth/auth.browser";
import { ROUTES } from "@/config/routes";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const redirectTo = `${window.location.origin}${ROUTES.auth.login}`;

      const result = await getBrowserAuthService().signUp(
        email.trim(),
        password,
        redirectTo,
      );

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      if (result.data.needsEmailConfirmation) {
        setMessage(
          "Your registration was submitted. Check your email for a confirmation link before signing in.",
        );
      } else {
        setMessage(
          "Your account was created. You can now sign in, subject to administrator access approval.",
        );
      }

      setPassword("");
      setConfirmPassword("");
    } catch {
      setError("Unable to register. Please try again.");
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
          <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-[#E8F3E9] text-[#16834A]">
            <UserRoundPlus size={22} aria-hidden="true" />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Register to request access to the OsusuBook administration
            workspace.
          </p>
        </div>

        {/* Registration form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="register-email"
              className="block text-sm font-medium text-slate-700"
            >
              Email address
            </label>

            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
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
            <label
              htmlFor="register-password"
              className="block text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="register-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                minLength={8}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
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

            <p className="text-xs text-slate-500">Use at least 8 characters.</p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-slate-700"
            >
              Confirm password
            </label>

            <div className="relative">
              <input
                id="confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                minLength={8}
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter your password"
                className="h-12 w-full rounded-md border border-slate-300 bg-transparent px-3.5 pr-12 text-base outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#16834A] focus:ring-2 focus:ring-[#16834A]/15"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((visible) => !visible)}
                aria-label={
                  showConfirmPassword
                    ? "Hide confirmation password"
                    : "Show confirmation password"
                }
                aria-pressed={showConfirmPassword}
                className="absolute right-1 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 transition hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16834A]"
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} aria-hidden="true" />
                ) : (
                  <Eye size={18} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {message && (
            <p
              role="status"
              aria-live="polite"
              className="rounded-md bg-[#E8F3E9] px-3.5 py-3 text-sm leading-5 text-[#105D35]"
            >
              {message}
            </p>
          )}

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
                Creating account...
              </>
            ) : (
              <>
                Create account
                <ArrowRight size={17} aria-hidden="true" />
              </>
            )}
          </button>
        </form>

        {/* Sign in link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href={ROUTES.auth.login}
              className="font-medium text-[#16834A] hover:text-[#105D35] hover:underline hover:underline-offset-4"
            >
              Sign in
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
