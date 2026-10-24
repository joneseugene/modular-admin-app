import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { createCrudService } from "../crud.factory";
import { QueryOptions } from "../query.types";
import { ServiceResult } from "../result.types";

type Client = SupabaseClient<Database>;

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export function createProfileService(client: Client) {
  const crud = createCrudService(client, "profiles");

  return {
    /**
     * Retrieve profiles with optional pagination, filtering, searching, and sorting.
     */
    async getAll(
      options: QueryOptions = {},
    ): Promise<ServiceResult<Profile[]>> {
      return crud.getAll(options);
    },

    /**
     * Retrieve a profile by its ID.
     */
    async getById(id: string): Promise<ServiceResult<Profile | null>> {
      return crud.getById(id);
    },

    /**
     * Create a profile.
     */
    async create(
      values: ProfileInsert,
    ): Promise<ServiceResult<Profile>> {
      return crud.create(values);
    },

    /**
     * Update an existing profile.
     */
    async update(
      id: string,
      values: ProfileUpdate,
    ): Promise<ServiceResult<Profile | null>> {
      return crud.update(id, values);
    },

    /**
     * Delete a profile by its ID.
     */
    async delete(id: string): Promise<ServiceResult<boolean>> {
      return crud.delete(id);
    },
  };
}

export type ProfileService = ReturnType<typeof createProfileService>;