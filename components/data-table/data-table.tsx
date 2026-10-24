"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
  type Row,
  type SortingState,
  type Table as TanStackTable,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

export interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  totalCount: number;

  pagination: PaginationState;
  onPaginationChange: (pagination: PaginationState) => void;

  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;

  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  searchDebounceMs?: number;
  searchable?: boolean;

  renderCard?: (row: Row<TData>) => React.ReactNode;
  toolbarActions?: React.ReactNode;

  isLoading?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;

  pageSizeOptions?: number[];
  getRowId?: (originalRow: TData, index: number) => string;

  className?: string;
  tableClassName?: string;
}

export function DataTable<TData>({
  data,
  columns,
  totalCount,
  pagination,
  onPaginationChange,
  sorting = [],
  onSortingChange,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search records...",
  searchDebounceMs = 300,
  searchable = true,
  renderCard,
  toolbarActions,
  isLoading = false,
  emptyMessage = "No records found.",
  loadingMessage = "Loading records...",
  pageSizeOptions = [10, 20, 50, 100],
  getRowId,
  className,
  tableClassName,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(pagination) : updater;

      onPaginationChange(next);
    },
    onSortingChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(sorting) : updater;

      onSortingChange?.(next);

      // A different sort order should start from the first page.
      onPaginationChange({
        ...pagination,
        pageIndex: 0,
      });
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    rowCount: totalCount,
    getRowId,
    enableMultiSort: false,
  });

  const rows = table.getRowModel().rows;

  return (
    <div className={cn("space-y-4", className)}>
      {(searchable || toolbarActions) && (
        <DataTableToolbar
          searchValue={searchValue}
          onSearchChange={(value) => {
            onPaginationChange({
              ...pagination,
              pageIndex: 0,
            });

            onSearchChange?.(value);
          }}
          searchPlaceholder={searchPlaceholder}
          searchDebounceMs={searchDebounceMs}
          actions={toolbarActions}
          isLoading={isLoading}
        />
      )}

      {renderCard && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden">
          {isLoading ? (
            <div className="col-span-full py-10 text-center text-sm text-muted-foreground">
              {loadingMessage}
            </div>
          ) : rows.length > 0 ? (
            rows.map((row) => (
              <React.Fragment key={row.id}>
                {renderCard(row)}
              </React.Fragment>
            ))
          ) : (
            <div className="col-span-full rounded-lg border py-10 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          )}
        </div>
      )}

      <div className={cn(renderCard && "hidden lg:block")}>
        <div className={cn("rounded-md border", tableClassName)}>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();

                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : canSort ? (
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 text-left hover:text-foreground"
                            onClick={header.column.getToggleSortingHandler()}
                            disabled={!onSortingChange}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}

                            <span className="text-xs text-muted-foreground">
                              {{
                                asc: "↑",
                                desc: "↓",
                              }[header.column.getIsSorted() as string] ?? "↕"}
                            </span>
                          </button>
                        ) : (
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center text-muted-foreground"
                  >
                    {loadingMessage}
                  </TableCell>
                </TableRow>
              ) : rows.length > 0 ? (
                rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center text-muted-foreground"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <DataTablePagination
        pagination={pagination}
        totalCount={totalCount}
        onPaginationChange={onPaginationChange}
        pageSizeOptions={pageSizeOptions}
        isLoading={isLoading}
      />
    </div>
  );
}

// Export the TanStack instance type for consumers that need it.
export type { TanStackTable };
