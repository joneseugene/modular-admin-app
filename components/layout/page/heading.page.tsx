import type { ReactNode } from "react";

interface PageHeadingProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function PageHeading({
  title,
  description,
  action,
}: PageHeadingProps) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          {title}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>

      {action ? <div>{action}</div> : null}
    </div>
  );
}