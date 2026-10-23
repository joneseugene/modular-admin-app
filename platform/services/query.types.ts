
export type SortDirection = "asc" | "desc";

export interface PaginationOptions {
  page?: number;
  pageSize?: number;
}

export interface FilterOptions {
  equals?: Record<string, unknown>;
  search?: {
    columns: string[];
    term: string;
  };
}

export interface QueryOptions extends PaginationOptions {
  /**
   * Supabase select expression, including relationship joins.
   * Example: "id, name, user_roles(role_id, roles(id, slug))"
   */
  select?: string;
  filters?: FilterOptions;
  orderBy?: string;
  direction?: SortDirection;
}

export interface CompositeKey {
  [column: string]: string | number | boolean | null;
}
