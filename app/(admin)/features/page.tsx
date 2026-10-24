
import { PageHeading } from "@/components/layout/page/heading.page";
import { FEATURE_LIST } from "@/config/features";

export default function FeaturesPage() {
  return (
    <>
      <PageHeading
        title="Feature Registry"
        description="Inspect the modules registered with the application."
      />

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="font-semibold text-slate-900">
            Registered modules
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Generated directly from the central feature registry.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {FEATURE_LIST.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.key}
                className="flex items-start gap-4 px-5 py-4 sm:items-center"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  <Icon size={19} aria-hidden="true" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900">
                    {feature.label}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {feature.description}
                  </p>

                  <p className="mt-1 font-mono text-xs text-slate-400">
                    {feature.path}
                  </p>
                </div>

                <span
                  className={[
                    "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
                    feature.enabled
                      ? "bg-emerald-50 text-emerald-800"
                      : "bg-slate-100 text-slate-500",
                  ].join(" ")}
                >
                  {feature.enabled ? "Enabled" : "Disabled"}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
