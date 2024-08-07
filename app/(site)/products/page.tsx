"use client";

import { useEffect, useState } from "react";
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
import { ProductWithInfo } from "../types/ProductWithInfo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import fetchRequest from "../util/functions/fetchRequest";
import AddProduct from "./actions/AddProduct";
import GoBack from "../components/GoBack";

export default function ProductsList() {
  const [products, setProducts] = useState<ProductWithInfo[]>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const fetchProducts = () => {
    fetchRequest<ProductWithInfo[]>(
      "GET",
      "/api/products/",
      "getProducts"
    ).then((products) => setProducts(products));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onAdd = (newProduct: ProductWithInfo) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const onEdit = (editedProduct: ProductWithInfo) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === editedProduct.id ? editedProduct : product
      )
    );
  };

  const onDelete = (deletedProduct: ProductWithInfo) => {};
  const columns = getColumns(onEdit, onDelete);
  const table = getTable(products, columns, globalFilter, setGlobalFilter);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[90%] h-[90%] flex flex-col max-h-[90%] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-4 items-center">
            <div className="text-2xl">Prodotti</div>
            <Input
              placeholder="Cerca..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(String(event.target.value))}
              className="max-w-sm"
            />
            <Button
              className="px-0"
              variant={"link"}
              onClick={() => {
                table.resetSorting();
                setGlobalFilter("");
              }}
            >
              Reimposta
            </Button>
          </div>
          <AddProduct onAdd={onAdd} />
        </div>

        <div className="rounded-md border w-full overflow-y-auto max-h-max ">
          <Table>
            <TableHeader className="sticky top-0 z-30 bg-background">
              {table.getRowModel().rows?.length > 0 &&
                table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
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
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="h-8 max-h-8"
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="h-8 max-h-8 truncate max-w-80"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Nessun prodotto trovato
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div> */}

        <div className="py-4 flex justify-end w-full">
          Prodotti totali: {table.getRowCount()}
        </div>
      </div>

      <GoBack path="../home" />
    </div>
  );
}
