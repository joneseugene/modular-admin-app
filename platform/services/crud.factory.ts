
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { QueryOptions } from "./query.types";
import { ServiceResult, failure, success } from "./result.types";

type TableName = keyof Database["public"]["Tables"];

type Row<T extends TableName> =
  Database["public"]["Tables"][T]["Row"];

type Insert<T extends TableName> =
  Database["public"]["Tables"][T]["Insert"];

type Update<T extends TableName> =
  Database["public"]["Tables"][T]["Update"];

type Client = SupabaseClient<Database>;

interface CrudServiceOptions {
  idColumn?: string;
}

function normalizeError(error: {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
}) {
  return {
    message: error.message,
    ...(error.code ? { code: error.code } : {}),
    ...(error.details ? { details: error.details } : {}),
    ...(error.hint ? { hint: error.hint } : {}),
  };
}

function validatePagination(page = 1, pageSize = 20) {
  if (!Number.isInteger(page) || page < 1) {
    throw new Error("Page must be a positive integer.");
  }

  if (
    !Number.isInteger(pageSize) ||
    pageSize < 1 ||
    pageSize > 100
  ) {
    throw new Error("Page size must be between 1 and 100.");
  }

  return {
    from: (page - 1) * pageSize,
    to: page * pageSize - 1,
  };
}

export function createCrudService<T extends TableName>(
  client: Client,
  table: T,
  serviceOptions: CrudServiceOptions = {},
) {
  const idColumn = serviceOptions.idColumn ?? "id";

  return {
    async getAll(
      options: QueryOptions = {},
    ): Promise<ServiceResult<Row<T>[]>> {
      try {
        const { from, to } = validatePagination(
          options.page,
          options.pageSize,
        );

        let query = client
          .from(table)
          .select(options.select ?? "*");

        for (const [column, value] of Object.entries(
          options.filters?.equals ?? {},
        )) {
          query = query.filter(column, "eq", value) as typeof query;
        }

        const search = options.filters?.search;

        if (search?.term.trim() && search.columns.length > 0) {
          const term = search.term.trim().replace(/[,%()]/g, "");

          if (term) {
            const expression = search.columns
              .map((column) => `${column}.ilike.%${term}%`)
              .join(",");

            query = query.or(expression) as typeof query;
          }
        }

        if (options.orderBy) {
          query = query.order(options.orderBy, {
            ascending: options.direction !== "desc",
          }) as typeof query;
        }

        const { data, error } = await query.range(from, to);

        if (error) {
          return failure(normalizeError(error));
        }

        return success((data ?? []) as unknown as Row<T>[]);
      } catch (error) {
        return failure({
          message:
            error instanceof Error
              ? error.message
              : "Unable to retrieve records.",
        });
      }
    },

    async getById(
      id: string,
      options: Pick<QueryOptions, "select"> = {},
    ): Promise<ServiceResult<Row<T> | null>> {
      const { data, error } = await client
        .from(table)
        .select(options.select ?? "*")
        .filter(idColumn, "eq", id)
        .maybeSingle();

      if (error) {
        return failure(normalizeError(error));
      }

      return success((data ?? null) as unknown as Row<T> | null);
    },

    async create(
      values: Insert<T>,
    ): Promise<ServiceResult<Row<T>>> {
      const { data, error } = await client
        .from(table)
        .insert(values as never)
        .select("*")
        .single();

      if (error) {
        return failure(normalizeError(error));
      }

      return success(data as unknown as Row<T>);
    },

    async update(
      id: string,
      values: Update<T>,
    ): Promise<ServiceResult<Row<T> | null>> {
      const { data, error } = await client
        .from(table)
        .update(values as never)
        .filter(idColumn, "eq", id)
        .select("*")
        .maybeSingle();

      if (error) {
        return failure(normalizeError(error));
      }

      return success((data ?? null) as unknown as Row<T> | null);
    },

    async delete(id: string): Promise<ServiceResult<boolean>> {
      const { data, error } = await client
        .from(table)
        .delete()
        .filter(idColumn, "eq", id)
        .select(idColumn);

      if (error) {
        return failure(normalizeError(error));
      }

      return success((data?.length ?? 0) > 0);
    },
  };
}
