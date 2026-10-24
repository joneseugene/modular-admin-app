import { z } from "zod";

/* -------------------------------------------------------------------------- */
/* String schemas                                                             */
/* -------------------------------------------------------------------------- */

export const stringSchema = z.string().trim();

export const requiredStringSchema = stringSchema.min(
  1,
  "This field is required.",
);

export const nameSchema = requiredStringSchema
  .min(2, "Must contain at least 2 characters.")
  .max(100, "Must not exceed 100 characters.");

export const shortTextSchema = requiredStringSchema.max(
  50,
  "Must not exceed 50 characters.",
);

export const descriptionSchema = stringSchema.max(
  1000,
  "Must not exceed 1000 characters.",
);

export const longTextSchema = stringSchema.max(
  10000,
  "Must not exceed 10000 characters.",
);

export const slugSchema = requiredStringSchema
  .max(100, "Must not exceed 100 characters.")
  .regex(
    /^[a-z0-9]+(?:_[a-z0-9]+)*$/,
    "Use lowercase letters, numbers, and underscores only.",
  );

export const searchSchema = stringSchema.max(
  200,
  "Search text must not exceed 200 characters.",
);

/* -------------------------------------------------------------------------- */
/* Identifier schemas                                                        */
/* -------------------------------------------------------------------------- */

export const idSchema = requiredStringSchema;

export const uuidSchema = z.uuid({
  error: "Invalid ID format.",
});

export const idParamSchema = z.object({
  id: idSchema,
});

export const uuidParamSchema = z.object({
  id: uuidSchema,
});

/* -------------------------------------------------------------------------- */
/* Contact schemas                                                           */
/* -------------------------------------------------------------------------- */

export const emailSchema = z
  .email({ error: "Enter a valid email address." })
  .transform((value) => value.trim().toLowerCase());

export const phoneSchema = stringSchema
  .min(7, "Phone number is too short.")
  .max(20, "Phone number is too long.")
  .regex(
    /^\+?[0-9\s().-]+$/,
    "Enter a valid phone number.",
  )
  .refine(
    (value) => value.replace(/\D/g, "").length >= 7,
    "Enter a valid phone number.",
  );

export const urlSchema = z.url({
  error: "Enter a valid URL.",
});

/* -------------------------------------------------------------------------- */
/* Authentication schemas                                                    */
/* -------------------------------------------------------------------------- */

export const passwordSchema = z
  .string()
  .min(8, "Password must contain at least 8 characters.")
  .max(128, "Password must not exceed 128 characters.");

export const confirmPasswordSchema = z.string().min(
  1,
  "Please confirm your password.",
);

/* -------------------------------------------------------------------------- */
/* Numeric schemas                                                           */
/* -------------------------------------------------------------------------- */

export const positiveIntegerSchema = z
  .number()
  .int("Must be a whole number.")
  .positive("Must be greater than zero.");

export const nonNegativeIntegerSchema = z
  .number()
  .int("Must be a whole number.")
  .min(0, "Cannot be negative.");

export const percentageSchema = z
  .number()
  .min(0, "Cannot be less than zero.")
  .max(100, "Cannot exceed 100.");

/* -------------------------------------------------------------------------- */
/* Boolean and enum schemas                                                   */
/* -------------------------------------------------------------------------- */

export const booleanSchema = z.boolean();

export const activeStatusSchema = z.enum([
  "active",
  "inactive",
]);

export const sortDirectionSchema = z.enum([
  "asc",
  "desc",
]);

/* -------------------------------------------------------------------------- */
/* Date schemas                                                              */
/* -------------------------------------------------------------------------- */

export const dateSchema = z.iso.date({
  error: "Enter a valid date.",
});

export const dateTimeSchema = z.iso.datetime({
  error: "Enter a valid date and time.",
});

/* -------------------------------------------------------------------------- */
/* Pagination and query schemas                                               */
/* -------------------------------------------------------------------------- */

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

export const searchQuerySchema = z.object({
  search: searchSchema.optional(),
});

export const listQuerySchema = paginationSchema.extend({
  search: searchSchema.optional(),
  orderBy: requiredStringSchema.optional(),
  direction: sortDirectionSchema.default("asc"),
});

/* -------------------------------------------------------------------------- */
/* Reusable entity schema factories                                           */
/* -------------------------------------------------------------------------- */

/**
 * Common fields for database entities.
 */
export function createEntitySchema<
  T extends z.ZodRawShape,
>(shape: T) {
  return z.object({
    id: idSchema,
    ...shape,
    created_at: dateTimeSchema,
    updated_at: dateTimeSchema,
  });
}

/**
 * Common create/update schema factory.
 * Supply only editable fields.
 */
export function createCrudSchemas<
  T extends z.ZodRawShape,
>(fields: z.ZodObject<T>) {
  return {
    create: fields,

    update: fields
      .partial()
      .refine(
        (value) => Object.keys(value).length > 0,
        "Provide at least one field to update.",
      ),
  };
}

/* -------------------------------------------------------------------------- */
/* Reusable types                                                             */
/* -------------------------------------------------------------------------- */

export type PaginationInput = z.input<typeof paginationSchema>;
export type Pagination = z.output<typeof paginationSchema>;

export type ListQuery = z.output<typeof listQuerySchema>;
export type SortDirection = z.infer<typeof sortDirectionSchema>;
export type ActiveStatus = z.infer<typeof activeStatusSchema>;