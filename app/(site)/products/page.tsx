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
import { Plus } from "@phosphor-icons/react";
import fetchRequest from "../util/fetchRequest";


export default function ProductsList() {
  const [products, setProducts] = useState<ProductWithInfo[]>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const columns = getColumns();
  const table = getTable(products, columns, globalFilter, setGlobalFilter);

  // const fetchProducts = () => {
    
  // };

  // useEffect(() => {
  //   fetchRequest("GET", "/api/products/?requestType=get")
  //     .then((products: ProductWithInfo[]) => setProducts(products));
  // }, []);

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
              variant={"link"}
              onClick={() => {
                table.resetSorting();
              }}
            >
              Reset
            </Button>
          </div>
          <Button className="rounded-full">
            <Plus size={32}/>
          </Button>
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
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  ); 
}
