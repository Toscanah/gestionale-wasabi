import { Product, ProductsOnOrder } from "@prisma/client";
import getColumns from "./getColumns";
import getTable from "./getTable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { ProductsInOrderType } from "../../types/ProductsInOrderType";

export default function OrderTable({
  products,
}: {
  products: ProductsInOrderType[];
}) {
  const columns = getColumns();
  const table = getTable(products, columns);

  console.log(products)

  return (
    <Table>
      <TableHeader className="sticky top-0 z-30 bg-background">
        {table.getRowModel().rows?.length > 0 &&
          table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length > 0 ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              Nessun risultato!
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
