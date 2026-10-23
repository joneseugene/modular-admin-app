"use client";

import { Menu } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  description: string;
  onMenuClick: () => void;
}

export function AdminHeader({
  title,
  description,
  onMenuClick,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label="Open navigation"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
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

      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-800">
            Administrator
          </p>
          <p className="text-xs text-slate-500">Local development</p>
        </div>

        <div
          aria-label="Administrator profile"
          className="flex size-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-900"
        >
          A
        </div>
      </div>
    </header>
  );
}