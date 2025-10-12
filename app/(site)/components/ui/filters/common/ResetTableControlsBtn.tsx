import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowCounterClockwiseIcon } from "@phosphor-icons/react";
import type { Table } from "@tanstack/react-table";
import { useMemo } from "react";

interface ResetTableControlsBtnProps<T> {
  /** Called when the user clicks the reset button */
  onReset: () => void;

  /** Whether any filters are currently applied (domain-driven flag for server) */
  hasFilters?: boolean;

  /** Whether server-side sorting is active */
  hasServerSorting?: boolean;

  /** Whether server-side pagination is in use */
  hasServerPagination?: boolean;

  /** Optional table instance (for client-side detection) */
  table?: Table<T>;

  /** Force show button regardless of other flags */
  customShow?: boolean;

  /** Optional external disabled state */
  disabled?: boolean;

  className?: string;
}

export default function ResetTableControlsBtn<T>({
  onReset,
  hasFilters = false,
  hasServerSorting = false,
  hasServerPagination = false,
  table,
  customShow = false,
  className,
  disabled,
}: ResetTableControlsBtnProps<T>) {
  const hasClientSorting = !!table?.getState().sorting?.length;
  const hasClientPagination =
    !!table &&
    (table.getState().pagination.pageIndex > 0 ||
      table.getState().pagination.pageSize !== table.options.initialState?.pagination?.pageSize);

  const activeConditions = useMemo(
    () =>
      [
        hasFilters,
        hasServerSorting,
        hasServerPagination,
        hasClientSorting,
        hasClientPagination,
      ].filter(Boolean).length,
    [hasFilters, hasServerSorting, hasServerPagination, hasClientSorting, hasClientPagination]
  );

  const label = useMemo(() => {
    if (activeConditions === 0) return "Reimposta tutto";
    if (activeConditions === 1) {
      if (hasFilters) return "Reimposta filtri";
      if (hasServerSorting || hasClientSorting) return "Reimposta ordinamento";
      if (hasServerPagination || hasClientPagination) return "Reimposta paginazione";
    }
    return "Reimposta tutto";
  }, [
    activeConditions,
    hasFilters,
    hasServerSorting,
    hasClientSorting,
    hasServerPagination,
    hasClientPagination,
  ]);

  if (!customShow && activeConditions === 0) return null;

  return (
    <Button
      onClick={onReset}
      disabled={disabled}
      variant="outline"
      className={cn("ml-auto border-dashed h-10", className)}
    >
      <ArrowCounterClockwiseIcon className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
}
