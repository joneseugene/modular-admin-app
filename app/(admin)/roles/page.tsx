import { PageHeading } from "@/components/layout/page/heading.page";
import { ShieldCheck } from "lucide-react";

export default function RolesPage() {
  return (
    <>
      <PageHeading
        title="Roles & Permissions"
        description="Define roles and the capabilities granted to each role."
      />

      <section className="rounded-xl border border-slate-200 bg-white p-8">
        <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
          <ShieldCheck size={24} />
        </div>

        <h3 className="mt-4 font-semibold text-slate-900">
          Access control
        </h3>

        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
          This module will manage permissions such as
          users.view, users.create, and roles.manage. Authorization
          will be resolved centrally instead of being duplicated
          throughout individual modules.
        </p>

        <p className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-400">
          Module scaffold · Not connected to a database
        </p>
      </section>
    </>
  );
}