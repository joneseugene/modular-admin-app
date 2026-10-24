
import Link from "next/link";
import {
  AlertCircle,
  RefreshCw,
  ShieldCheck,
  ShieldPlus,
} from "lucide-react";

import { PageHeading } from "@/components/layout/page/heading.page";
import { getRolesService } from "@/modules/roles/role.module";

import { RoleModalAction } from "./role-modal.action";
import { RolesTableFeature } from "./role-table";

export async function RolesFeature() {
  const rolesService = await getRolesService();

  const result = await rolesService.getAll({
    orderBy: "name",
    direction: "asc",
  });

  if (!result.success) {
    return (
      <>
        <section
          role="alert"
          className="rounded-xl border border-red-200 bg-white p-6"
        >
          <div className="flex items-start gap-3">
            <AlertCircle
              className="mt-0.5 shrink-0 text-red-600"
              size={20}
              aria-hidden="true"
            />

            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-slate-900">
                Unable to load roles
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                {result.error.message}
              </p>

              <Link
                href="/roles"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-emerald-800 transition-colors hover:text-emerald-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
              >
                <RefreshCw size={15} aria-hidden="true" />
                Try again
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  const roles = result.data;

  return (
    <>
      <div className="space-y-6">
        {/* Overview and primary action */}
        <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
              <ShieldCheck size={22} aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <h2 className="font-semibold text-slate-900">
                Role management
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {roles.length === 1
                  ? "1 role configured"
                  : `${roles.length} roles configured`}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <RoleModalAction label="Add role" />
          </div>
        </section>

        {/* Empty state or responsive roles table */}
        {roles.length === 0 ? (
          <section className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
              <ShieldPlus size={27} aria-hidden="true" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              No roles yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              Create your first role to start organizing access to
              platform features and permissions.
            </p>

            <div className="mt-6 flex justify-center">
              <RoleModalAction label="Create your first role" />
            </div>
          </section>
        ) : (
          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
            <div>
              <h2 className="font-semibold text-slate-900">
                All roles
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Search, sort, and review configured roles.
              </p>
            </div>

            <RolesTableFeature roles={roles} />
          </section>
        )}
      </div>
    </>
  );
}
