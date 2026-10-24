"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { getBrowserAuthService } from "@/platform/services/auth/auth.browser";
import { ROUTES } from "@/config/routes";

type RecoveryStatus = "checking" | "ready" | "invalid" | "complete";

export function ChangePasswordForm() {
  const router = useRouter();

  const [status, setStatus] = useState<RecoveryStatus>("checking");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

        {/* Checking recovery session */}
        {status === "checking" && (
          <section className="space-y-4">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#E8F3E9] text-[#16834A]">
              <LockKeyhole size={22} aria-hidden="true" />
            </div>

            <h1 className="text-2xl font-semibold tracking-tight">
              Verifying recovery link
            </h1>

            <p role="status" className="text-sm leading-6 text-slate-500">
              Please wait while we verify your recovery session.
            </p>

            <div className="h-1 w-full overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-[#16834A]" />
            </div>
          </section>
        )}

        {/* Invalid or expired recovery session */}
        {status === "invalid" && (
          <section className="space-y-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <LockKeyhole size={22} aria-hidden="true" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Recovery link unavailable
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                This link may have expired or already been used. Request a
                new recovery link to continue.
              </p>
            </div>

            <Link
              href={ROUTES.auth.forgot_password}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#16834A] px-4 text-sm font-semibold text-white transition hover:bg-[#105D35] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16834A] focus-visible:ring-offset-2"
            >
              Request a new link
              <ArrowRight size={17} aria-hidden="true" />
            </Link>

            <Link
              href={ROUTES.auth.login}
              className="flex items-center justify-center gap-2 text-sm font-medium text-slate-600 transition hover:text-[#16834A]"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Back to sign in
            </Link>
          </section>
        )}

        {/* Successful password update */}
        {status === "complete" && (
          <section className="space-y-5">
            <div className="flex size-12 items-center justify-center rounded-full bg-[#E8F3E9] text-[#16834A]">
              <CheckCircle2 size={26} aria-hidden="true" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Password updated
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Your password has been updated successfully. You can now sign
                in using your new password.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.replace(ROUTES.auth.login)}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#16834A] px-4 text-sm font-semibold text-white transition hover:bg-[#105D35] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16834A] focus-visible:ring-offset-2"
            >
              Return to sign in
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          </section>
        )}

        {/* Change password form */}
        {status === "ready" && (
          <>
            <div className="mb-8">
              <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-[#E8F3E9] text-[#16834A]">
                <LockKeyhole size={22} aria-hidden="true" />
              </div>

              <h1 className="text-2xl font-semibold tracking-tight">
                Choose a new password
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Create a strong password with at least 8 characters to secure
                your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium text-slate-700"
                >
                  New password
                </label>

                <div className="relative">
                  <input
                    id="new-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    minLength={8}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your new password"
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

                <p className="text-xs text-slate-500">
                  Use at least 8 characters.
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirm-new-password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Confirm new password
                </label>

                <div className="relative">
                  <input
                    id="confirm-new-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    minLength={8}
                    required
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="Re-enter your new password"
                    className="h-12 w-full rounded-md border border-slate-300 bg-transparent px-3.5 pr-12 text-base outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#16834A] focus:ring-2 focus:ring-[#16834A]/15"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((visible) => !visible)
                    }
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
                    Updating password...
                  </>
                ) : (
                  <>
                    Update password
                    <ArrowRight size={17} aria-hidden="true" />
                  </>
                )}
              </button>
            </form>

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
          </>
        )}

        <footer className="mt-8 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} OsusuBook
        </footer>
      </div>
    </main>
  );
}