"use server";

import { getRolesService } from "@/modules/roles/role.module";
import { roleCreateSchema, roleUpdateSchema } from "@/platform/schema/role.schema";

export async function createRoleAction(input: unknown) {
  const parsed = roleCreateSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false as const,
      error: {
        message:
          parsed.error.issues[0]?.message ??
          "Please check the role details.",
      },
    };
  }

  try {
    const rolesService = await getRolesService();
    const result = await rolesService.create(parsed.data);

    if (!result.success) {
      return {
        success: false as const,
        error: { message: result.error.message },
      };
    }

    return {
      success: true as const,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false as const,
      error: {
        message:
          error instanceof Error
            ? error.message
            : "Unable to create the role.",
      },
    };
  }
}

export async function updateRoleAction(
  id: string,
  input: unknown,
) {
  const parsed = roleUpdateSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false as const,
      error: {
        message:
          parsed.error.issues[0]?.message ??
          "Please check the role details.",
      },
    };
  }

  try {
    const rolesService = await getRolesService();
    const result = await rolesService.update(id, parsed.data);

    if (!result.success) {
      return {
        success: false as const,
        error: { message: result.error.message },
      };
    }

    return {
      success: true as const,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false as const,
      error: {
        message:
          error instanceof Error
            ? error.message
            : "Unable to update the role.",
      },
    };
  }
}

export async function deleteRoleAction(id: string) {
  if (!id.trim()) {
    return {
      success: false as const,
      error: {
        message: "A valid role ID is required.",
      },
    };
  }

  try {
    const rolesService = await getRolesService();
    const result = await rolesService.delete(id);

    if (!result.success) {
      return {
        success: false as const,
        error: {
          message: result.error.message,
        },
      };
    }

    return {
      success: true as const,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false as const,
      error: {
        message:
          error instanceof Error
            ? error.message
            : "Unable to delete the role.",
      },
    };
  }
}