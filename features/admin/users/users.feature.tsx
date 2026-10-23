
import { Users } from "lucide-react";

import { PageHeading } from "@/components/layout/page/heading.page";

interface UsersFeatureProps {
  userId: string;
}

export function UsersFeature({ userId }: UsersFeatureProps) {
  return (
    <>
      <PageHeading
        title="Users"
        description="Manage user accounts and their access to the platform."
      />

      <section className="rounded-xl border border-slate-200 bg-white p-8">
        <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
          <Users size={24} aria-hidden="true" />
        </div>

        <h3 className="mt-4 font-semibold text-slate-900">
          User management
        </h3>

        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
          This module will manage user records, account status, and
          role assignments. Its data access and permissions will be
          implemented independently of the shared shell.
        </p>

        <p className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-400">
          Module scaffold · Not connected to a database
        </p>

        <div className="mt-6 border-t border-slate-100 pt-4">
          <p className="text-xs text-slate-500">
            Authorized session
          </p>

          <p className="mt-1 break-all font-mono text-sm text-slate-700">
            {userId}
          </p>
        </div>
      </section>
    </>
  );
}
