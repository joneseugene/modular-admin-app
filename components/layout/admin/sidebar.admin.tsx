"use client";

import Link from "next/link";
import { X } from "lucide-react";

import { getNavigation } from "@/platform/navigation/get-navigation";
import type { AuthorizationContext } from "@/platform/authorization/authorization.types";
import { PERMISSIONS } from "@/platform/authorization/permissions";

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
  pathname: string | null;
}

/**
 * Temporary development-only authorization context.
 *
 * Replace this with the authenticated user's permissions
 * when Supabase authorization is implemented.
 */
const DEMO_AUTHORIZATION_CONTEXT: AuthorizationContext = {
  userId: "demo-admin",
  permissions: new Set([
    PERMISSIONS.dashboard.view,
    PERMISSIONS.users.view,
    PERMISSIONS.roles.view,
  ]),
};

export function Sidebar({ mobileOpen, onClose, pathname }: SidebarProps) {
  const sections = getNavigation(DEMO_AUTHORIZATION_CONTEXT);

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-60 flex-col",
          "border-r border-slate-200 bg-white",
          "transition-transform duration-200 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center gap-2.5"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-800 text-sm font-bold text-white">
              MA
            </span>

            <span>
              <span className="block text-sm font-semibold text-slate-900">
                Modular Admin
              </span>
              <span className="block text-xs text-slate-500">
                Administration platform
              </span>
            </span>
          </Link>

          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav
          aria-label="Main navigation"
          className="flex-1 space-y-7 overflow-y-auto px-3 py-6"
        >
          {sections.map((section) => (
            <section key={section.group}>
              <h2 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                {section.group}
              </h2>

              <ul className="space-y-1">
                {pathname !== null &&
                  section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;

                    return (
                      <li key={item.key}>
                        <Link
                          href={item.path}
                          onClick={onClose}
                          aria-current={isActive ? "page" : undefined}
                          className={[
                            "flex items-center gap-3 rounded-lg px-3 py-2.5",
                            "text-sm font-medium transition-colors",
                            isActive
                              ? "bg-emerald-50 text-emerald-900"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                          ].join(" ")}
                        >
                          <Icon size={18} aria-hidden="true" />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </section>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <p className="text-xs text-slate-500">OsusuBook</p>
          <p className="mt-1 text-xs text-slate-400">Development environment</p>
        </div>
      </aside>
    </>
  );
}
