import React, { Fragment, useEffect, useRef } from "react";
import {
  Table as DataTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Cell, flexRender, Row, Table as TanstackTable } from "@tanstack/react-table";
import useTableRowHeight from "../../hooks/table/useTableRowHeight";

interface CustomeCellProps<T> {
  cell: Cell<T, any>;
  className: string;
}

interface TableProps<T> {
  table: TanstackTable<T>;
  /** Optional external ref to measure height or scroll */
  tableRef?: React.RefObject<HTMLDivElement | null>; // allow null
  tableClassName?: string;
  headerClassName?: string;
  rowClassName?: (row: Row<T>) => string;
  cellClassName?: (index: number) => string;
  forceRowClick?: boolean;
  CustomCell?: ({ cell, className }: CustomeCellProps<T>) => React.JSX.Element;
  onRowClick?: (original: T) => void;
  double?: boolean;
  stickyRowIndex?: number;
  showNoResult?: boolean;
  fixedColumnIndex?: number;
  maxRows?: number;
  scrollAdjustment?: number;
}

export default function Table<T>({
  table,
  tableRef,
  tableClassName,
  rowClassName,
  headerClassName,
  cellClassName,
  CustomCell,
  onRowClick,
  stickyRowIndex,
  double = false,
  forceRowClick = false,
  showNoResult = true,
  fixedColumnIndex,
  maxRows,
  scrollAdjustment,
}: TableProps<T>) {
  // internal fallback ref if parent doesn't provide one
  const internalRef = useRef<HTMLDivElement | null>(null);
  const resolvedRef = tableRef ?? internalRef;

  useEffect(() => {
    if (stickyRowIndex != null) {
      const el = resolvedRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    }
  }, [stickyRowIndex, resolvedRef]);

  const handleRowClick = (event: React.MouseEvent, original: T) => {
    const target = event.target as HTMLElement;
    if (!forceRowClick) {
      if (target.closest('[data-state="open"], [data-state="closed"], [data-no-row-click]')) {
        event.stopPropagation();
        return;
      }
    }
    onRowClick?.(original);
  };

  const { height } = useTableRowHeight(resolvedRef, maxRows ?? 0);

  const rows = table.getRowModel().rows ?? [];
  const actualRows = rows.length;
  const columnsCount = table.getAllColumns().length;

  const fillerCount = maxRows && actualRows < maxRows ? Math.max(0, maxRows - actualRows) : 0;

  const maxHeight =
    maxRows && height
      ? height -
        (actualRows > maxRows ? (scrollAdjustment == undefined ? 0 : scrollAdjustment) : 1.5)
      : undefined;

  return (
    <div
      ref={resolvedRef}
      style={{
        maxHeight,
        height: maxHeight,
      }}
      className={cn("rounded-md border w-full overflow-y-auto", tableClassName)}
    >
      {table && (
        <DataTable
          className={cn(
            "border-separate border-spacing-0",
            actualRows == 0 && showNoResult && "h-full"
          )}
        >
          <TableHeader className={cn("sticky top-0 z-50 bg-background")}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  const isFixed = fixedColumnIndex === index;
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        headerClassName,
                        "border-b text-center z-50",
                        isFixed &&
                          "sticky left-0 z-30 bg-foreground text-background border-b-background"
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className={cn(actualRows == 0 && showNoResult && "h-full")}>
            {actualRows > 0 ? (
              <>
                {rows.map((row, rowIndex) => {
                  const shouldStick = rowIndex === stickyRowIndex;

                  return (
                    <TableRow
                      onClick={(e) => handleRowClick(e, row.original)}
                      onDoubleClick={(e) => double && handleRowClick(e, row.original)}
                      key={row.id}
                      className={cn(
                        "h-8 max-h-8 transition",
                        rowClassName?.(row),
                        shouldStick && "sticky z-10 bottom-0 bg-muted-foreground/10"
                      )}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell, index) => {
                        const isFixed = index === fixedColumnIndex;
                        const isLastRow = rowIndex === actualRows - 1;

                        const borderClass = isLastRow && fillerCount === 0 ? "" : "border-b";

                        return (
                          <Fragment key={cell.id}>
                            {CustomCell ? (
                              CustomCell({
                                cell,
                                className: cn(
                                  cellClassName?.(index),
                                  isFixed
                                    ? `sticky left-0 z-20 bg-foreground text-background ${borderClass} border-b-background`
                                    : borderClass
                                ),
                              })
                            ) : (
                              <TableCell
                                className={cn(
                                  "h-8 max-h-8 truncate max-w-80 text-cente",
                                  cellClassName?.(index),
                                  isFixed
                                    ? `sticky left-0 z-20 bg-foreground text-background ${borderClass} border-b-background`
                                    : borderClass
                                )}
                              >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </TableCell>
                            )}
                          </Fragment>
                        );
                      })}
                    </TableRow>
                  );
                })}

                {Array.from({ length: fillerCount }).map((_, i) => {
                  const lastRow = rows[0];
                  const isLastFiller = i === fillerCount - 1; // ✅ detect last filler
                  const borderClass = isLastFiller ? "" : "border-b"; // ✅ border everywhere except last filler

                  return (
                    <TableRow
                      data-filler
                      key={`__filler_${i}`}
                      aria-hidden="true"
                      className="h-8 max-h-8"
                    >
                      {lastRow.getVisibleCells().map((cell, index) => {
                        const isFixed = index === fixedColumnIndex;

                        return (
                          <TableCell
                            key={`filler_${index}`}
                            className={cn(
                              "h-8 max-h-8 truncate max-w-80",
                              cellClassName?.(index),
                              isFixed
                                ? `sticky left-0 z-20 bg-foreground text-background ${borderClass} border-b-background`
                                : borderClass
                            )}
                          >
                            {/* invisible content keeps column width consistent */}
                            <div className="opacity-0 *:pointer-events-none">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </>
            ) : showNoResult ? (
              <>
                <TableRow data-empty className="h-full">
                  <TableCell
                    colSpan={columnsCount}
                    className="h-full p-0 text-center text-muted-foreground"
                  >
                    Nessun risultato
                  </TableCell>
                </TableRow>

                {/* filler rows keep consistent height */}
                {/* {maxRows &&
                  Array.from({ length: maxRows - 1 }).map((_, i) => (
                    <TableRow
                      key={`__filler_empty_${i}`}
                      data-filler
                      aria-hidden="true"
                      className="hover:bg-background"
                    >
                      <TableCell colSpan={columnsCount} className="border-0 h-8 max-h-8 opacity-0">
                        filler
                      </TableCell>
                    </TableRow>
                  ))} */}
              </>
            ) : null}
          </TableBody>
        </DataTable>
      )}
    </div>
  );
}
