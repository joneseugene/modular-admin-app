import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createCrudService } from "@/platform/services/crud.factory";

export async function getRolesService() {
  const client = await createSupabaseServerClient();

  return createCrudService(client, "roles");
}