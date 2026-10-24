
"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const BUCKET = "profile-photos";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export async function uploadProfilePhoto(
  userId: string,
  file: File,
): Promise<{ path: string; publicUrl: string }> {
  const extension = EXTENSIONS[file.type];

  if (!extension) {
    throw new Error("Choose a JPEG, PNG, WebP, or AVIF image.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("The profile photo must be 5 MB or smaller.");
  }

  // Create the browser client when the function runs.
  const client = createSupabaseBrowserClient();

  const {
    data: { user },
    error: authError,
  } = await client.auth.getUser();

  if (authError || !user || user.id !== userId) {
    throw new Error("You can only upload your own profile photo.");
  }

  const path = `${user.id}/avatar.${extension}`;

  const { error: uploadError } = await client.storage
    .from(BUCKET)
    .upload(path, file, {
      upsert: true,
      contentType: file.type,
      cacheControl: "3600",
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = client.storage
    .from(BUCKET)
    .getPublicUrl(path);

  return {
    path,
    publicUrl: data.publicUrl,
  };
}
