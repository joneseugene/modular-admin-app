"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { getBrowserAuthService } from "@/platform/services/auth/auth.browser";
import { ROUTES } from "@/config/routes";

type RecoveryStatus = "checking" | "ready" | "invalid" | "complete";

export function ChangePasswordForm() {
  const router = useRouter();

  const [status, setStatus] = useState<RecoveryStatus>("checking");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkRecoverySession() {
      try {
        const result = await getBrowserAuthService().getCurrentUser();

        if (cancelled) return;

        if (!result.success || !result.data) {
          setStatus("invalid");
          return;
        }

        setStatus("ready");
      } catch {
        if (!cancelled) {
          setStatus("invalid");
        }
      }
    }

    void checkRecoverySession();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

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
      const result = await getBrowserAuthService().updatePassword(password);

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      setPassword("");
      setConfirmPassword("");
      setStatus("complete");
    } catch {
      setError("Unable to update your password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (status === "checking") {
    return (
      <section className="w-full space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Verifying recovery link
        </h1>
        <p role="status" className="text-sm text-gray-600">
          Please wait while we verify your link.
        </p>
      </section>
    );
  }

  if (status === "invalid") {
    return (
      <section className="w-full space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">
          Recovery link unavailable
        </h1>
        <p className="text-sm text-gray-600">
          This link may have expired or already been used. Request a new
          recovery link to continue.
        </p>
        <Link
          href={ROUTES.auth.forgot_password}
          className="inline-block text-sm font-medium underline underline-offset-4"
        >
          Request a new link
        </Link>
      </section>
    );
  }

  if (status === "complete") {
    return (
      <section className="w-full space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">
          Password updated
        </h1>
        <p className="text-sm text-gray-600">
          Your password has been updated successfully.
        </p>
        <button
          type="button"
          onClick={() => router.replace(ROUTES.auth.login)}
          className="w-full rounded-lg bg-gray-900 px-4 py-2.5 font-medium text-white"
        >
          Return to sign in
        </button>
      </section>
    );
  }

  return (
    <section className="w-full space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Choose a new password
        </h1>
        <p className="text-sm text-gray-600">
          Use at least 8 characters for your new password.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="new-password" className="text-sm font-medium">
            New password
          </label>
          <input
            id="new-password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="confirm-new-password" className="text-sm font-medium">
            Confirm new password
          </label>
          <input
            id="confirm-new-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="w-full rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-gray-400"
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
          {isSubmitting ? "Updating password..." : "Update password"}
        </button>
      </form>
    </section>
  );
}
