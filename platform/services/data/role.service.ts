import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";
import { createCrudService } from "../crud.factory";
import { QueryOptions } from "../query.types";
import { failure, ServiceResult } from "../result.types";

type Client = SupabaseClient<Database>;

type Role = Database["public"]["Tables"]["roles"]["Row"];
type RoleInsert = Database["public"]["Tables"]["roles"]["Insert"];
type RoleUpdate = Database["public"]["Tables"]["roles"]["Update"];

export function createRoleService(client: Client) {
  const crud = createCrudService(client, "roles");

  return {
    /**
     * Retrieve roles with optional pagination, filtering, searching, and sorting.
     */
    async getAll(
      options: QueryOptions = {},
    ): Promise<ServiceResult<Role[]>> {
      return crud.getAll(options);
    },

    /**
     * Retrieve a role by its ID.
     */
    async getById(id: string): Promise<ServiceResult<Role | null>> {
      return crud.getById(id);
    },

    /**
     * Create a role.
     */
    async create(values: RoleInsert): Promise<ServiceResult<Role>> {
      return crud.create(values);
    },

    /**
     * Update an existing role.
     * System roles cannot be modified.
     */
    async update(
      id: string,
      values: RoleUpdate,
    ): Promise<ServiceResult<Role | null>> {
      const existing = await crud.getById(id);

      if (!existing.success) {
        return existing;
      }

      if (!existing.data) {
        return { success: true, data: null };
      }

      if (existing.data.is_system) {
        return failure({
          message: "System roles cannot be modified.",
        });
      }

      return crud.update(id, values);
    },

    /**
     * Delete a role.
     * System roles cannot be deleted.
     */
    async delete(id: string): Promise<ServiceResult<boolean>> {
      const existing = await crud.getById(id);

      if (!existing.success) {
        return existing;
      }

      if (!existing.data) {
        return { success: true, data: false };
      }

      if (existing.data.is_system) {
        return failure({
          message: "System roles cannot be deleted.",
        });
      }

      return crud.delete(id);
    },
  };
}

export type RoleService = ReturnType<typeof createRoleService>;