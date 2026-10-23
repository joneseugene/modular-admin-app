
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";
import { failure, ServiceResult, success } from "./result.types";


type TableName = keyof Database["public"]["Tables"];

type Client = SupabaseClient<Database>;

export async function deleteByCompositeKey<
  T extends TableName,
>(
  client: Client,
  table: T,
  key: Record<string, string | number | boolean | null>,
): Promise<ServiceResult<boolean>> {
  if (Object.keys(key).length === 0) {
    return failure({
      message: "At least one key column is required.",
    });
  }

  let query = client.from(table).delete();

  for (const [column, value] of Object.entries(key)) {
    query = query.filter(column, "eq", value) as typeof query;
  }

  const { data, error } = await query.select();

  if (error) {
    return failure({
      message: error.message,
      ...(error.code ? { code: error.code } : {}),
      ...(error.details ? { details: error.details } : {}),
      ...(error.hint ? { hint: error.hint } : {}),
    });
  }

  return success((data?.length ?? 0) > 0);
}
