import {
  Table as DataTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Cell, flexRender, Table as TanstackTable } from "@tanstack/react-table";
import { Fragment, ReactNode } from "react";

export default function Table<T>({
  table,
  tableClassName,
  rowClassName,
  cellClassName,
  CustomCell,
  onRowClick,
}: {
  table: TanstackTable<T>;
  tableClassName?: string;
  rowClassName?: string;
  cellClassName?: (index: number) => string;
  CustomCell?: ({ cell, className }: { cell: Cell<T, any>; className: string }) => JSX.Element;
  onRowClick?: (orginal: T) => void;
}) {
  return (
    <div className={cn("rounded-md border w-full overflow-y-auto max-h-max", tableClassName)}>
      {table && (
        <DataTable>
          <TableHeader className="sticky top-0 z-30 bg-background">
            {table.getRowModel().rows?.length > 0 &&
              table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} > {/**className="*:text-xl" */}
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length > 0 &&
              table.getRowModel().rows?.map((row) => {
                return (
                  <TableRow
                    onClick={() => (onRowClick ? onRowClick(row.original) : undefined)}
                    key={row.id}
                    className={cn("h-8 max-h-8", rowClassName)}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <Fragment key={cell.id}>
                        {CustomCell ? (
                          CustomCell({ cell, className: cellClassName ? cellClassName(index) : "" })
                        ) : (
                          <TableCell
                            className={cn(
                              "h-8 max-h-8 truncate max-w-80",
                              cellClassName ? cellClassName(index) : ""
                            )}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        )}
                      </Fragment>
                    ))}
                  </TableRow>
                );
              })}
          </TableBody>
        </DataTable>
      )}
    </div>
  );
}
