"use client";

import * as React from "react";
import type { PaginationState } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface DataTablePaginationProps {
  pagination: PaginationState;
  totalCount: number;
  onPaginationChange: (pagination: PaginationState) => void;
  pageSizeOptions?: number[];
  isLoading?: boolean;
}

export function DataTablePagination({
  pagination,
  totalCount,
  onPaginationChange,
  pageSizeOptions = [10, 20, 50, 100],
  isLoading = false,
}: DataTablePaginationProps) {
  const pageCount = Math.max(
    1,
    Math.ceil(totalCount / pagination.pageSize),
  );

  const currentPage = pagination.pageIndex + 1;
  const start = totalCount === 0
    ? 0
    : pagination.pageIndex * pagination.pageSize + 1;

  const end = Math.min(
    (pagination.pageIndex + 1) * pagination.pageSize,
    totalCount,
  );

  const changePage = (pageIndex: number) => {
    onPaginationChange({
      ...pagination,
      pageIndex: Math.max(0, Math.min(pageIndex, pageCount - 1)),
    });
  };

  return (
    <div className="flex flex-col gap-4 border-t px-2 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-4">
        <span>
          {totalCount === 0
            ? "No records"
            : `Showing ${start}–${end} of ${totalCount}`}
        </span>

        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap">Rows per page</span>

          <Select
            value={String(pagination.pageSize)}
            onValueChange={(value) => {
              onPaginationChange({
                pageIndex: 0,
                pageSize: Number(value),
              });
            }}
            disabled={isLoading}
          >
            <SelectTrigger className="h-8 w-[76px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 sm:justify-end">
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          Page {currentPage} of {pageCount}
        </span>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => changePage(0)}
            disabled={isLoading || pagination.pageIndex === 0}
            aria-label="Go to first page"
          >
            <ChevronsLeft className="size-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => changePage(pagination.pageIndex - 1)}
            disabled={isLoading || pagination.pageIndex === 0}
            aria-label="Go to previous page"
          >
            <ChevronLeft className="size-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => changePage(pagination.pageIndex + 1)}
            disabled={isLoading || pagination.pageIndex >= pageCount - 1}
            aria-label="Go to next page"
          >
            <ChevronRight className="size-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => changePage(pageCount - 1)}
            disabled={isLoading || pagination.pageIndex >= pageCount - 1}
            aria-label="Go to last page"
          >
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
