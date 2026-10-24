import { z } from "zod";

import {
  booleanSchema,
  createCrudSchemas,
  createEntitySchema,
  descriptionSchema,
  idParamSchema,
  nameSchema,
  slugSchema,
} from "./base.schema";

/* -------------------------------------------------------------------------- */
/* Role fields                                                                */
/* -------------------------------------------------------------------------- */

export const roleFieldsSchema = z.object({
  name: nameSchema,
  description: descriptionSchema.nullable().optional(),
});

/* -------------------------------------------------------------------------- */
/* Slug generation                                                            */
/* -------------------------------------------------------------------------- */

export function generateRoleSlug(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

/* -------------------------------------------------------------------------- */
/* Role CRUD schemas                                                          */
/* -------------------------------------------------------------------------- */

const roleCrudSchemas = createCrudSchemas(roleFieldsSchema);

export const roleCreateSchema = roleCrudSchemas.create
  .extend({
    slug: slugSchema.optional(),
  })
  .transform(({ name, description }) => ({
    name,
    slug: generateRoleSlug(name),
    description,
  }));

export const roleUpdateSchema = roleCrudSchemas.update
  .extend({
    slug: slugSchema.optional(),
  })
  .transform(({ name, description }) => {
    const updates: {
      name?: string;
      slug?: string;
      description?: string | null;
    } = {};

    if (name !== undefined) {
      updates.name = name;
      updates.slug = generateRoleSlug(name);
    }

    if (description !== undefined) {
      updates.description = description;
    }

    return updates;
  });

/* -------------------------------------------------------------------------- */
/* Role entity                                                                */
/* -------------------------------------------------------------------------- */

export const roleSchema = createEntitySchema({
  name: nameSchema,
  slug: slugSchema,
  description: descriptionSchema.nullable(),
  is_system: booleanSchema,
});

/* -------------------------------------------------------------------------- */
/* Role parameters                                                            */
/* -------------------------------------------------------------------------- */

export const roleIdSchema = idParamSchema;

/* -------------------------------------------------------------------------- */
/* Inferred types                                                             */
/* -------------------------------------------------------------------------- */

export type RoleFormData = z.input<typeof roleCreateSchema>;

export type RoleCreateInput = z.output<typeof roleCreateSchema>;

export type RoleUpdateInput = z.output<typeof roleUpdateSchema>;

export type Role = z.infer<typeof roleSchema>;

export type RoleIdInput = z.infer<typeof roleIdSchema>;