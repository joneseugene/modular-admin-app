
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createAuthService } from "@/platform/services/auth/auth.service";

export async function getServerAuthService() {
  const client = await createSupabaseServerClient();

  return createAuthService(client);
}
