"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { getBrowserAuthService } from "@/platform/services/auth/auth.browser";
import { ROUTES } from "@/config/routes";

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      setError("Unable to sign in. Please try again.");
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
          Sign in
        </h1>

        <p className="text-sm text-gray-600">
          Sign in to access your administration workspace.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Enter your password"
          />
        </div>

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
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="text-sm text-gray-600">
        Forgot your password?{" "}
        <Link
          href={ROUTES.auth.forgot_password}
          className="font-medium text-gray-900 underline underline-offset-4"
        >
          Set Password
        </Link>
      </p>
    </section>
  );
}