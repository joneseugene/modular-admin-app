import type { ReactNode } from "react";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#F8FAF7] px-4 py-12">
      <div className="w-full max-w-md">
        {children}
      </div>
    </main>
  );
}