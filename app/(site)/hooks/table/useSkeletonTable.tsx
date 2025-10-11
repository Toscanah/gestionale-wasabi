import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Skeleton } from "@/components/ui/skeleton";

type Options<T> = {
  isLoading: boolean;
  data: T[];
  columns: ColumnDef<T>[];
  pageSize?: number;
};

export default function useSkeletonTable<T>({
  isLoading,
  data,
  columns,
  pageSize = 10,
}: Options<T>) {
  const effectivePageSize = Number.isFinite(pageSize) && pageSize > 0 ? pageSize : data.length;

  const tableData = React.useMemo<T[]>(
    () => (isLoading ? (Array(effectivePageSize).fill({}) as T[]) : data),
    [isLoading, data, effectivePageSize]
  );

  const tableColumns = React.useMemo<ColumnDef<T>[]>(() => {
    if (!isLoading) return columns;

    // 🔒 Safe wrapper: avoid runtime errors from undefined nested props
    const safeCellWrapper = (cellFn: any) => (info: any) => {
      try {
        const value = typeof cellFn === "function" ? cellFn(info) : null;
        // If it rendered fine, hide it under the skeleton overlay
        return (
          <div className="relative w-full h-full">
            <div className="opacity-0 select-none pointer-events-none">{value}</div>
            <div className="absolute inset-0 flex items-center">
              <Skeleton className="w-full h-full" />
            </div>
          </div>
        );
      } catch {
        // If the cellFn threw (because of undefined), just render a skeleton
        return (
          <div className="flex items-center justify-center w-full h-full">
            <Skeleton className="w-full h-full" />
          </div>
        );
      }
    };

    // Apply wrapper to every column
    return columns.map((col) => ({
      ...col,
      cell: safeCellWrapper(col.cell),
    }));
  }, [isLoading, columns]);

  return { tableData, tableColumns };
}
