
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { FEATURE_LIST } from "@/config/features";
import { Sidebar } from "./sidebar.admin";
import { AdminHeader } from "./header.admin";
import { ROUTES } from "@/config/routes";

interface AdminShellClientProps {
  children: React.ReactNode;
  userName: string;
  userRole: string;
}

export function AdminShellClient({
  children,
  userName,
  userRole,
}: AdminShellClientProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentFeature = mounted
    ? FEATURE_LIST.find((feature) => feature.path === pathname)
    : undefined;

  const title = currentFeature?.label ?? "Administration";
  const description =
    currentFeature?.description ??
    "Manage your application from one place.";

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        pathname={mounted ? pathname : null}
      />

      <div className="min-h-screen lg:pl-60">
        <AdminHeader
          title={title}
          description={description}
          onMenuClick={() => setMobileOpen(true)}
          userName={userName}
          userRole={userRole}
          profileHref={ROUTES.admin.profile}
        />

        <main id="main-content" className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
