"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RoleRowActions } from "./role-row.action";
import { LockKeyhole, RefreshCw, ShieldCheck } from "lucide-react";
import type {
  ColumnDef,
  PaginationState,
  Row,
  SortingState,
} from "@tanstack/react-table";

import { DataTable, DataTableCard } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import type { Role } from "@/platform/schema/role.schema";

interface RolesTableFeatureProps {
  roles: Role[];
}

export function RolesTableFeature({ roles }: RolesTableFeatureProps) {
  const router = useRouter();
  const [isRefreshing, startRefreshTransition] = useTransition();

  const [searchValue, setSearchValue] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ]);

  const handleRefresh = useCallback(() => {
    setSearchValue("");
    setPagination((current) => ({ ...current, pageIndex: 0 }));
    setSorting([{ id: "name", desc: false }]);

    startRefreshTransition(() => {
      router.refresh();
    });
  }, [router]);

  const filteredRoles = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) return roles;

    return roles.filter((role) =>
      [
        role.name,
        role.slug,
        role.description ?? "",
        role.is_system ? "system" : "custom",
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [roles, searchValue]);

  const sortedRoles = useMemo(() => {
    const sorted = [...filteredRoles];
    const sort = sorting[0];

    if (!sort) return sorted;

    sorted.sort((a, b) => {
      let comparison = 0;

      if (sort.id === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sort.id === "slug") {
        comparison = a.slug.localeCompare(b.slug);
      } else if (sort.id === "type") {
        comparison = Number(a.is_system) - Number(b.is_system);
      }

      return sort.desc ? -comparison : comparison;
    });

    return sorted;
  }, [filteredRoles, sorting]);

  const pageCount = Math.max(
    1,
    Math.ceil(sortedRoles.length / pagination.pageSize),
  );

  const safePagination = useMemo(
    () => ({
      ...pagination,
      pageIndex: Math.min(pagination.pageIndex, pageCount - 1),
    }),
    [pagination, pageCount],
  );

  const pageRoles = useMemo(() => {
    const start = safePagination.pageIndex * safePagination.pageSize;

    return sortedRoles.slice(start, start + safePagination.pageSize);
  }, [sortedRoles, safePagination]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  }, []);

  const columns = useMemo<ColumnDef<Role, unknown>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Role",
        cell: ({ row }) => (
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              {row.original.is_system ? (
                <LockKeyhole size={17} aria-label="System role" />
              ) : (
                <ShieldCheck size={17} aria-hidden="true" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-slate-900">
                  {row.original.name}
                </span>

                {row.original.is_system && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                    System
                  </span>
                )}
              </div>

              {row.original.description && (
                <p className="mt-1 max-w-md text-sm text-slate-500">
                  {row.original.description}
                </p>
              )}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "slug",
        header: "Identifier",
        cell: ({ row }) => (
          <span className="font-mono text-xs text-slate-600">
            {row.original.slug}
          </span>
        ),
      },
      {
        id: "type",
        accessorFn: (row) => (row.is_system ? "System" : "Custom"),
        header: "Type",
        cell: ({ row }) => (
          <span
            className={
              row.original.is_system
                ? "inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                : "inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800"
            }
          >
            {row.original.is_system ? "System" : "Custom"}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <RoleRowActions role={row.original} />
          </div>
        ),
      },
    ],
    [],
  );

  const renderCard = useCallback((row: Row<Role>) => {
    const role = row.original;

    return (
      <DataTableCard
        title={
          <span className="flex items-center gap-2">
            {role.is_system ? (
              <LockKeyhole size={16} aria-hidden="true" />
            ) : (
              <ShieldCheck size={16} aria-hidden="true" />
            )}
            {role.name}
          </span>
        }
        description={role.description || "No description provided."}
        status={
          <span
            className={
              role.is_system
                ? "rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700"
                : "rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-800"
            }
          >
            {role.is_system ? "System" : "Custom"}
          </span>
        }
        fields={[
          {
            label: "Identifier",
            value: (
              <span className="break-all font-mono text-xs">{role.slug}</span>
            ),
          },
        ]}
        actions={
          <div className="flex w-full justify-end">
            <RoleRowActions role={role} />
          </div>
        }
      />
    );
  }, []);

  return (
    <DataTable
      data={pageRoles}
      columns={columns}
      totalCount={sortedRoles.length}
      pagination={safePagination}
      onPaginationChange={setPagination}
      sorting={sorting}
      onSortingChange={setSorting}
      searchValue={searchValue}
      onSearchChange={handleSearchChange}
      searchPlaceholder="Search roles..."
      toolbarActions={
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          aria-label="Refresh roles"
        >
          <RefreshCw
            className={`size-4 ${isRefreshing ? "animate-spin" : ""}`}
            aria-hidden="true"
          />
          <span>Refresh</span>
        </Button>
      }
      renderCard={renderCard}
      emptyMessage={
        searchValue ? "No roles match your search." : "No roles found."
      }
      pageSizeOptions={[10, 20, 50, 100]}
      getRowId={(role) => role.id}
    />
  );
}
