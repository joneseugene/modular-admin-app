"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

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
    }catch (error: unknown) {
      console.error("[ForgotPasswordForm] Recovery request failed:", error);

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
    <section className="w-full space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-medium text-gray-500">
          Modular Admin Lab
        </p>

        <h1 className="text-3xl font-semibold tracking-tight">
          Change your password
        </h1>

        <p className="text-sm text-gray-600">
          Enter the email address associated with your account.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label
            htmlFor="recovery-email"
            className="text-sm font-medium"
          >
            Email address
          </label>

          <input
            id="recovery-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="you@example.com"
          />
        </div>

        {message && (
          <p role="status" className="text-sm text-green-700">
            {message}
          </p>
        )}

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-gray-900 px-4 py-2.5 font-medium text-white disabled:opacity-60"
        >
          {isSubmitting ? "Requesting..." : "Send recovery link"}
        </button>
      </form>

      <Link
        href={ROUTES.auth.login}
        className="text-sm font-medium underline underline-offset-4"
      >
        Back to sign in
      </Link>
    </section>
  );
}