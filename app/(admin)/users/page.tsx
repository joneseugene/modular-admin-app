
import { UsersFeature } from "@/features/admin/users/users.feature";
import { PERMISSIONS } from "@/platform/authorization/permissions";
import { requirePagePermission } from "@/platform/authorization/require-page-permission";

export default async function UsersPage() {
  const context = await requirePagePermission(PERMISSIONS.users.view);

  return <UsersFeature userId={context.userId} />;
}
