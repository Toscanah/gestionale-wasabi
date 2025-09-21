import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Skeleton } from "@/components/ui/skeleton";

type SkeletonCellRenderer = () => React.ReactNode;

type Options<T> = {
  isLoading: boolean;
  data: T[];
  columns: ColumnDef<T>[];
  pageSize?: number | undefined;
};

export default function useSkeletonTable<T>({ isLoading, data, columns, pageSize = 10 }: Options<T>) {
  // If pageSize is not a valid number, show all data
  const effectivePageSize = Number.isFinite(pageSize) && pageSize > 0 ? pageSize : data.length;

  const tableData = React.useMemo<T[]>(
    () => (isLoading ? (Array(effectivePageSize).fill({}) as T[]) : data),
    [isLoading, data, effectivePageSize]
  );

  const tableColumns = React.useMemo<ColumnDef<T>[]>(() => {
    if (!isLoading) return columns;

    return columns.map((col) => ({
      ...col,
      cell: () => <Skeleton className="h-full w-full" />,
    }));
  }, [isLoading, columns]);

  return { tableData, tableColumns };
}
