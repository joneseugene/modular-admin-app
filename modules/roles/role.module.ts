import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createRoleService } from "@/platform/services/data/role.service";

export async function getRolesService() {
  const client = await createSupabaseServerClient();

  return createRoleService(client);
}