"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { getBrowserAuthService } from "@/platform/services/auth/auth.browser";
import { ROUTES } from "@/config/routes";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      const redirectUrl = new URL(
        "/api/callback",
        window.location.origin,
      );

      redirectUrl.searchParams.set(
        "next",
        ROUTES.auth.change_password,
      );

      const result =
        await getBrowserAuthService().requestPasswordReset(
          email.trim(),
          redirectUrl.toString(),
        );

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      setMessage(
        "If an account matches that email, a password-recovery link will be sent. Check your inbox and spam folder.",
      );
    } catch (error: unknown) {
      console.error(
        "[ForgotPasswordForm] Recovery request failed:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to request a recovery email. Please try again.",
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

            <span className="text-xl font-bold tracking-tight">
              OsusuBook
            </span>
          </Link>
        </header>

        {/* Heading */}
        <div className="mb-8">
          <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-[#E8F3E9] text-[#16834A]">
            <Mail size={22} aria-hidden="true" />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">
            Forgot password?
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Enter the email address associated with your account. We&apos;ll
            send you a link to reset your password.
          </p>
        </div>

        {/* Recovery form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="recovery-email"
              className="block text-sm font-medium text-slate-700"
            >
              Email address
            </label>

            <input
              id="recovery-email"
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
                Sending recovery link...
              </>
            ) : (
              <>
                Send recovery link
                <ArrowRight size={17} aria-hidden="true" />
              </>
            )}
          </button>
        </form>

        {/* Security note */}
        <div className="mt-8">
          <p className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck
              size={15}
              className="text-[#16834A]"
              aria-hidden="true"
            />
            Secure password recovery
          </p>
        </div>

        {/* Back to login */}
        <div className="mt-8 text-center">
          <Link
            href={ROUTES.auth.login}
            className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-slate-600 transition hover:text-[#16834A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16834A]"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to sign in
          </Link>
        </div>

        <footer className="mt-8 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} OsusuBook
        </footer>
      </div>
    </main>
  );
}