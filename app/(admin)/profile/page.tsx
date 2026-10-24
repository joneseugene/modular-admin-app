import { redirect } from "next/navigation";

import { ROUTES } from "@/config/routes";
import { getCurrentProfile } from "@/modules/auth/get-current-profile.module";
import { ProfileFeature } from "@/features/admin/profile/profile.feature";

export const metadata = {
  title: "My Profile | OsusuBook",
  description: "View and update your account profile.",
};

export default async function ProfilePage() {
  const profile = await getCurrentProfile();

  if (!profile || !profile.isActive) {
    redirect(ROUTES.auth.login);
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="border-b border-slate-200 pb-6">
        <p className="text-sm font-medium text-emerald-700">
          Account settings
        </p>
      </header>

      <ProfileFeature
        id={profile.id}
        displayName={profile.displayName?.trim() || "User"}
        email={profile.email ?? ""}
        designation={profile.designation ?? ""}
        roleLabel={profile.roleLabel}
        phone={profile.phone ?? ""}
        photo={profile.photo ?? null}
      />

      <section
        aria-labelledby="account-access-heading"
        className="border-t border-slate-200 py-6"
      >
        <h2
          id="account-access-heading"
          className="text-sm font-semibold text-slate-900"
        >
          Account access
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Your assigned role and access permissions are managed separately.
          Contact an administrator if your role or access permissions need to
          be reviewed.
        </p>
      </section>
    </div>
  );
}