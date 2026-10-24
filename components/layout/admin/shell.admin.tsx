
import { redirect } from "next/navigation";

import { ROUTES } from "@/config/routes";
import { getCurrentProfile } from "@/modules/auth/get-current-profile.module";
import { AdminShellClient } from "./shell.admin.client";

interface AdminShellProps {
  children: React.ReactNode;
}

export async function AdminShell({ children }: AdminShellProps) {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect(ROUTES.auth.login);
  }

  if (!profile.isActive) {
    redirect(ROUTES.auth.login);
  }

  return (
    <AdminShellClient
      userName={profile.displayName}
      userRole={profile.roleLabel}
    >
      {children}
    </AdminShellClient>
  );
}
