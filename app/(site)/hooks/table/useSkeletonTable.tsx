import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Skeleton } from "@/components/ui/skeleton";

type SkeletonCellRenderer = () => React.ReactNode;

type Options<T> = {
  isLoading: boolean;
  data: T[];
  columns: ColumnDef<T, any>[];
  pageSize?: number | undefined;
};

export default function useSkeletonTable<T>({ isLoading, data, columns, pageSize = 10 }: Options<T>) {
  const tableData = React.useMemo<T[]>(
    () => (isLoading ? (Array(pageSize).fill({}) as T[]) : data),
    [isLoading, data, pageSize]
  );

  const tableColumns = React.useMemo<ColumnDef<T, any>[]>(() => {
    if (!isLoading) return columns;

    return columns.map((col) => ({
      ...col,
      cell: () => <Skeleton className="h-full w-full" />,
    }));
  }, [isLoading, columns]);

  return { tableData, tableColumns };
}
