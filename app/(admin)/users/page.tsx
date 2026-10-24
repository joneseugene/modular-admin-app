
import { UsersFeature } from "@/features/admin/users/users.feature";
import { PERMISSIONS } from "@/platform/authorization/permissions";
import { requirePagePermission } from "@/platform/authorization/require-page-permission";

// Use dynamic rendering because this page checks the current user's session.
export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const context = await requirePagePermission(PERMISSIONS.users.view);

  return <UsersFeature userId={context.userId} />;
}
