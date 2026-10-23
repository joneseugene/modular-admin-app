"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { getBrowserAuthService } from "@/platform/services/auth/auth.browser";
import { ROUTES } from "@/config/routes";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      const redirectTo = `${window.location.origin}/login`;

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
    <section className="w-full space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-medium text-gray-500">
          Modular Admin Lab
        </p>

        <h1 className="text-3xl font-semibold tracking-tight">
          Create an account
        </h1>

        <p className="text-sm text-gray-600">
          Register for an account to request access to the administration
          workspace.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="register-email" className="text-sm font-medium">
            Email address
          </label>

          <input
            id="register-email"
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

        <div className="space-y-1">
          <label
            htmlFor="register-password"
            className="text-sm font-medium"
          >
            Password
          </label>

          <input
            id="register-password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="At least 8 characters"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="confirm-password"
            className="text-sm font-medium"
          >
            Confirm password
          </label>

          <input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="w-full rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Re-enter your password"
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
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href={ROUTES.auth.login}
          className="font-medium text-gray-900 underline underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </section>
  );
}