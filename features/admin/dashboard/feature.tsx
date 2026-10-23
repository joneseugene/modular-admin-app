
import {
  Activity,
  Blocks,
  ShieldCheck,
  Users,
} from "lucide-react";

import { PageHeading } from "@/components/layout/page/heading.page";

const metrics = [
  {
    label: "Registered users",
    value: "1,284",
    description: "Sample data for development",
    icon: Users,
  },
  {
    label: "Roles configured",
    value: "6",
    description: "Sample data for development",
    icon: ShieldCheck,
  },
  {
    label: "Registered modules",
    value: "4",
    description: "Modules in the feature registry",
    icon: Blocks,
  },
  {
    label: "System activity",
    value: "—",
    description: "Activity tracking not connected",
    icon: Activity,
  },
];

export function DashboardFeature() {
  return (
    <>
      <PageHeading
        title="Dashboard"
        description="An overview of your modular administration platform."
      />

      <section
        aria-label="System overview"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.label}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  {metric.label}
                </p>

                <Icon
                  size={19}
                  className="text-emerald-800"
                  aria-hidden="true"
                />
              </div>

              <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
                {metric.value}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                {metric.description}
              </p>
            </article>
          );
        })}
      </section>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="font-semibold text-slate-900">
          Architecture status
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          The shared admin shell, route configuration, and feature
          registry are in place. Authentication, database-backed
          permissions, and live metrics will be integrated in later
          stages.
        </p>
      </section>
    </>
  );
}
