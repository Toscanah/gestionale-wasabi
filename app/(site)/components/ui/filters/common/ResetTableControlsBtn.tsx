import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowCounterClockwiseIcon } from "@phosphor-icons/react";
import type { Table } from "@tanstack/react-table";

interface ResetTableControlsBtnProps<T> {
  onReset: () => void;
  /** Whether any filters are currently applied (domain-driven flag) */
  hasFilters?: boolean;
  /** Whether any sorting is applied on the server side */
  hasServerSorting?: boolean;
  /** Optional table instance to detect client-side sorting */
  table?: Table<T>;
  className?: string;
  disabled?: boolean;
}

/**
 * Displays a unified reset button if:
 *  - filters are active (hasFilters)
 *  - OR server-side sorting is active (hasServerSorting)
 *  - OR client-side sorting exists in the TanStack table state
 */
export default function ResetTableControlsBtn<T>({
  onReset,
  hasFilters = false,
  hasServerSorting = false,
  table,
  className,
  disabled,
}: ResetTableControlsBtnProps<T>) {
  // Detect client-side sorting
  const hasClientSorting = !!table?.getState().sorting?.length;
  console.log({ hasClientSorting, sorting: table?.getState().sorting });

  // Count active conditions
  const activeConditions = [hasFilters, hasServerSorting, hasClientSorting].filter(Boolean).length;

  if (activeConditions === 0) return null;

  let label = "Reimposta tutto";
  if (activeConditions === 1) {
    if (hasFilters) label = "Reimposta filtri";
    else if (hasServerSorting || hasClientSorting) label = "Reimposta ordinamento";
  }

  return (
    <Button
      disabled={disabled}
      onClick={onReset}
      variant="outline"
      className={cn("ml-auto border-dashed h-10", className)}
    >
      <ArrowCounterClockwiseIcon className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
}
