
function getRequiredEnv(
  value: string | undefined,
  name: string,
): string {
  if (!value) {
    throw new Error(
      `Missing environment variable: ${name}. Check your .env.local file.`,
    );
  }

  return value;
}

export function getSupabaseConfig() {
  return {
    url: getRequiredEnv(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      "NEXT_PUBLIC_SUPABASE_URL",
    ),
    publishableKey: getRequiredEnv(
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    ),
  };
}
