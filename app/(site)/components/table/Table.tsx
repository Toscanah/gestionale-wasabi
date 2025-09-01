import React, { useEffect, useRef, useState } from "react";
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

interface CustomeCellProps<T> {
  cell: Cell<T, any>;
  className: string;
}

interface TableProps<T> {
  table: TanstackTable<T>;
  tableClassName?: string;
  headerClassName?: string;
  rowClassName?: (row: Row<T>) => string;
  cellClassName?: (index: number) => string;
  forceRowClick?: boolean;
  CustomCell?: ({ cell, className }: CustomeCellProps<T>) => JSX.Element;
  onRowClick?: (original: T) => void;
  double?: boolean;
  stickyRowIndex?: number;
  showNoResult?: boolean;
  fixedColumnIndex?: number;
}

export default function Table<T>({
  table,
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
}: TableProps<T>) {
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stickyRowIndex) {
      const tableElement = tableRef.current;
      if (tableElement) {
        tableElement.scrollTop = tableElement.scrollHeight;
      }
    }
  }, [stickyRowIndex]);

  const handleRowClick = (event: React.MouseEvent, original: T) => {
    const target = event.target as HTMLElement;

    if (!forceRowClick) {
      if (target.closest('[data-state="open"]')) {
        event.stopPropagation();
        return;
      }

      if (target.closest("[data-state='closed']") || target.closest("[data-no-row-click]")) {
        event.stopPropagation();
        return;
      }
    }

    onRowClick && onRowClick(original);
  };

  return (
    <div
      ref={tableRef}
      className={cn("rounded-md border w-full overflow-y-auto max-h-max", tableClassName)}
    >
      {table && (
        <DataTable>
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
                    onClick={(event) => handleRowClick(event, row.original)}
                    onDoubleClick={(event) =>
                      double ? handleRowClick(event, row.original) : undefined
                    }
                    key={row.id}
                    className={cn(
                      "h-8 max-h-8 transition",
                      rowClassName?.(row),
                      shouldStick && "sticky z-10 bottom-0 bg-muted-foreground/20"
                    )}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell, index) => {
                      const isFixed = index === fixedColumnIndex; // first column fixed
                      return (
                        <Fragment key={cell.id}>
                          {CustomCell ? (
                            CustomCell({
                              cell,
                              className: cn(
                                cellClassName ? cellClassName(index) : "",
                                isFixed && "sticky left-0 z-20 bg-foreground text-background"
                              ),
                            })
                          ) : (
                            <TableCell
                              className={cn(
                                "h-8 max-h-8 truncate max-w-80",
                                cellClassName ? cellClassName(index) : "",
                                isFixed && "sticky left-0 z-20 bg-foreground text-background"
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
