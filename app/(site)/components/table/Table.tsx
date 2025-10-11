import React, { useEffect, useRef } from "react";
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
import { Fragment } from "react";
import useTableRowHeight from "../../hooks/table/useTableRowHeight";

interface CustomeCellProps<T> {
  cell: Cell<T, any>;
  className: string;
}

interface TableProps<T> {
  table: TanstackTable<T>;
  /** Optional external ref to measure height or scroll */
  tableRef?: React.RefObject<HTMLDivElement | null>; // ✅ allow null
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
}: TableProps<T>) {
  // internal fallback ref if parent doesn't provide one
  const internalRef = useRef<HTMLDivElement | null>(null);
  const resolvedRef = tableRef ?? internalRef; // ✅ both now share same type

  useEffect(() => {
    if (stickyRowIndex) {
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

  const { getTotalHeight } = useTableRowHeight(resolvedRef);

  return (
    <div
      ref={resolvedRef}
      style={{
        maxHeight: maxRows ? getTotalHeight(maxRows) : undefined,
      }}
      className={cn("rounded-md border w-full overflow-y-auto", tableClassName)}
    >
      {table && (
        <DataTable
          style={{
            maxHeight: maxRows ? getTotalHeight(maxRows) : undefined,
          }}
          className={cn(
            "border-separate border-spacing-0"
            // maxRows && `max-h-[${getTotalHeight(maxRows)}px]`
          )}
        >
          <TableHeader className={cn("sticky top-0 z-30 bg-background")}>
            {table.getRowModel().rows?.length > 0 &&
              table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header, index) => {
                    const isFixed = fixedColumnIndex === index;
                    return (
                      <TableHead
                        key={header.id}
                        className={cn(
                          headerClassName,
                          "border-b",
                          isFixed && "sticky left-0 z-30 bg-foreground text-background"
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

          <TableBody>
            {table.getRowModel().rows?.length > 0 ? (
              table.getRowModel().rows.map((row, rowIndex) => {
                const shouldStick = rowIndex === stickyRowIndex;
                return (
                  <TableRow
                    onClick={(e) => handleRowClick(e, row.original)}
                    onDoubleClick={(e) => double && handleRowClick(e, row.original)}
                    key={row.id}
                    className={cn(
                      "h-8 max-h-8 transition",
                      rowClassName?.(row),
                      shouldStick && "sticky z-10 bottom-0 bg-muted-foreground/20"
                    )}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell, index) => {
                      const isFixed = index === fixedColumnIndex;
                      const isLastRow = rowIndex === table.getRowModel().rows.length - 1;
                      const borderClass = isLastRow ? "" : "border-b";

                      return (
                        <Fragment key={cell.id}>
                          {CustomCell ? (
                            CustomCell({
                              cell,
                              className: cn(
                                cellClassName?.(index),
                                isFixed
                                  ? `sticky left-0 z-20 bg-foreground text-background ${borderClass}`
                                  : borderClass
                              ),
                            })
                          ) : (
                            <TableCell
                              className={cn(
                                "h-8 max-h-8 truncate max-w-80",
                                cellClassName?.(index),
                                isFixed
                                  ? `sticky left-0 z-20 bg-foreground text-background ${borderClass}`
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
              })
            ) : showNoResult ? (
              <TableRow className="h-max">
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-max text-center text-muted-foreground"
                >
                  Nessun risultato
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </DataTable>
      )}
    </div>
  );
}
