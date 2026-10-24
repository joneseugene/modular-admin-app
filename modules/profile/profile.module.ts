import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createProfileService } from "@/platform/services/data/profile.service";

export async function getProfilesService() {
  const client = await createSupabaseServerClient();

  return createProfileService(client);
}