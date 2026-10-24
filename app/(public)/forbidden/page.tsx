
import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold">Access denied</h1>
      <p className="text-muted-foreground">
        You do not have permission to access this page.
        Contact an administrator if you believe this is a mistake.
      </p>
      <Link className="underline underline-offset-4" href="/dashboard">
        Return to dashboard
      </Link>
    </main>
  );
}
