import { z } from "zod";

import {
  emailSchema,
  nameSchema,
  phoneSchema,
  shortTextSchema,
} from "@/platform/schema/base.schema";

const optionalEmailSchema = z.union([
  emailSchema,
  z.literal(""),
]);

const optionalPhoneSchema = z.union([
  phoneSchema,
  z.literal(""),
]);

const optionalDesignationSchema = z.union([
  shortTextSchema,
  z.literal(""),
]);

const optionalPhotoSchema = z.union([
  z.string().trim().min(1, "Photo reference cannot be empty."),
  z.literal(""),
  z.null(),
]);

const optionalPhotoFileSchema = z
  .custom<File | null>(
    (value) =>
      value === null ||
      (typeof File !== "undefined" && value instanceof File),
    "Choose a valid image file.",
  )
  .nullable()
  .optional();

export const profileSchema = z.object({
  display_name: nameSchema.max(
    80,
    "Must not exceed 80 characters.",
  ),

  email: optionalEmailSchema,

  designation: optionalDesignationSchema,

  phone: optionalPhoneSchema,

  // The saved Storage path or public URL.
  photo: optionalPhotoSchema,

  // The newly selected file; never persist this in profiles.
  photoFile: optionalPhotoFileSchema,
});

export type ProfileFormValues = z.infer<typeof profileSchema>;