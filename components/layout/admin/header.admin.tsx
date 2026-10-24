"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  LogOut,
  Menu,
  UserRound,
} from "lucide-react";

import { ROUTES } from "@/config/routes";
import { getBrowserAuthService } from "@/platform/services/auth/auth.browser";

interface AdminHeaderProps {
  title: string;
  description: string;
  onMenuClick: () => void;
  userName: string;
  userRole: string;
  profileHref?: string;
}

export function AdminHeader({
  title,
  description,
  onMenuClick,
  userName,
  userRole,
  profileHref = "/profile",
}: AdminHeaderProps) {
  const router = useRouter();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const initials =
    userName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U";

  const formattedRole =
    userRole.trim().replace(/[_-]+/g, " ") || "No role assigned";

  async function handleLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setLogoutError("");

    try {
      const result = await getBrowserAuthService().signOut();

      if (!result.success) {
        setLogoutError(
          result.error.message || "Unable to sign out. Please try again.",
        );
        setIsLoggingOut(false);
        return;
      }

      setIsDropdownOpen(false);
      router.replace(ROUTES.auth.login);
      router.refresh();
    } catch {
      setLogoutError("Unable to sign out. Please try again.");
      setIsLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-5 lg:px-6">
      <div className="flex min-w-0 items-center gap-2.5">
        <button
          type="button"
          aria-label="Open navigation"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold text-slate-900">
            {title}
          </h1>

          <p className="hidden truncate text-sm text-slate-500 sm:block">
            {description}
          </p>
        </div>
      </div>

      <div className="relative shrink-0">
        <button
          type="button"
          aria-label="Open user menu"
          aria-haspopup="menu"
          aria-expanded={isDropdownOpen}
          onClick={() => {
            setIsDropdownOpen((open) => !open);
            setLogoutError("");
          }}
          className="flex items-center gap-2 rounded-xl p-1.5 text-left transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-900">
            {initials}
          </span>

          <span className="hidden max-w-44 sm:block">
            <span className="block truncate text-sm font-semibold text-slate-900">
              {userName}
            </span>

            <span className="block truncate text-xs capitalize text-slate-500">
              {formattedRole}
            </span>
          </span>

          <ChevronDown
            size={16}
            aria-hidden="true"
            className={`hidden text-slate-500 transition-transform sm:block ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isDropdownOpen && (
          <>
            <button
              type="button"
              aria-label="Close user menu"
              tabIndex={-1}
              className="fixed inset-0 z-40 cursor-default"
              onClick={() => setIsDropdownOpen(false)}
            />

            <div
              role="menu"
              aria-label="User account menu"
              className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
            >
              <div className="border-b border-slate-100 px-4 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-900">
                    {initials}
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {userName}
                    </p>

                    <p className="mt-1 truncate text-xs capitalize text-slate-500">
                      {formattedRole}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-1 p-2">
                <Link
                  href={profileHref}
                  role="menuitem"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                >
                  <UserRound
                    size={17}
                    aria-hidden="true"
                    className="text-slate-500"
                  />
                  My Profile
                </Link>

                {logoutError && (
                  <p
                    role="alert"
                    className="px-3 py-2 text-xs text-red-600"
                  >
                    {logoutError}
                  </p>
                )}

                <button
                  type="button"
                  role="menuitem"
                  disabled={isLoggingOut}
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <LogOut size={17} aria-hidden="true" />
                  {isLoggingOut ? "Signing out..." : "Logout"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}