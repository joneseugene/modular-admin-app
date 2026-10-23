import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createCrudService } from "@/platform/services/crud.factory";

export async function getUsersService() {
  const client = await createSupabaseServerClient();

  return createCrudService(client, "profiles");
}