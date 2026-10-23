"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { FEATURE_LIST } from "@/config/features";
import { Sidebar } from "./sidebar.admin";
import { AdminHeader } from "./header.admin";

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentFeature = FEATURE_LIST.find(
    (feature) => feature.path === pathname,
  );

  const title = currentFeature?.label ?? "Administration";
  const description =
    currentFeature?.description ??
    "Manage your application from one place.";

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="min-h-screen lg:pl-72">
        <AdminHeader
          title={title}
          description={description}
          onMenuClick={() => setMobileOpen(true)}
        />

        <main id="main-content" className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}