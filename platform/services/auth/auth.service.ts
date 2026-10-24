import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";
import { failure, success, type ServiceResult } from "../result.types";

type AppSupabaseClient = SupabaseClient<Database>;

export function createAuthService(client: AppSupabaseClient) {
  return {
    async signInWithPassword(
      email: string,
      password: string,
    ): Promise<ServiceResult<{ userId: string }>> {
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return failure({ message: error.message, code: error.code });
      }

      return success({ userId: data.user.id });
    },

    async signUp(
      email: string,
      password: string,
      emailRedirectTo?: string,
    ): Promise<
      ServiceResult<{ userId: string | null; needsEmailConfirmation: boolean }>
    > {
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
          ...(emailRedirectTo ? { emailRedirectTo } : {}),
        },
      });

      if (error) {
        return failure({ message: error.message, code: error.code });
      }

      return success({
        userId: data.user?.id ?? null,
        needsEmailConfirmation: !data.session,
      });
    },

    async signOut(): Promise<ServiceResult<null>> {
      const { error } = await client.auth.signOut();

      if (error) {
        return failure({ message: error.message, code: error.code });
      }

      return success(null);
    },

    async getCurrentUser(): Promise<
      ServiceResult<{ userId: string; email: string | undefined } | null>
    > {
      const { data, error } = await client.auth.getUser();

      if (error) {
        return failure({ message: error.message, code: error.code });
      }

      if (!data.user) {
        return success(null);
      }

      return success({
        userId: data.user.id,
        email: data.user.email,
      });
    },

    async requestPasswordReset(
      email: string,
      redirectTo?: string,
    ): Promise<ServiceResult<null>> {
      const { error } = await client.auth.resetPasswordForEmail(email, {
        ...(redirectTo ? { redirectTo } : {}),
      });

      if (error) {
        return failure({ message: error.message, code: error.code });
      }

      return success(null);
    },

    async exchangeCodeForSession(
      code: string,
    ): Promise<ServiceResult<{ userId: string }>> {
      const { data, error } = await client.auth.exchangeCodeForSession(code);

      if (error) {
        return failure({ message: error.message, code: error.code });
      }

      if (!data.user) {
        return failure({
          message: "The recovery link did not establish a user session.",
          code: "RECOVERY_SESSION_MISSING",
        });
      }

      return success({ userId: data.user.id });
    },

    async updatePassword(password: string): Promise<ServiceResult<null>> {
      const { error } = await client.auth.updateUser({ password });

      if (error) {
        return failure({ message: error.message, code: error.code });
      }

      return success(null);
    },
  };
}
