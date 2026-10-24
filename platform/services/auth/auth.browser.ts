import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { createAuthService } from "@/platform/services/auth/auth.service";

export function getBrowserAuthService() {
  return createAuthService(createSupabaseBrowserClient());
}