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
import { useCallback, useEffect, useState } from "react";
import { OrderType } from "../../types/OrderType";
import { debounce } from "lodash";
import { cn } from "@/lib/utils";

const createNewProduct = (): ProductsInOrderType => {
  return {
    product: {
      id: 0,
      name: "",
      code: "",
      desc: "Lorem ipsum dolor sitatex ea commodo re dolor in ruint occaecat cupidatat non proident, sunt in t laborum.",
      price: 0,
    },
    created_at: new Date(),
    updated_at: new Date(),
    product_id: 0,
    order_id: 0,
    quantity: 0,
    total: 0,
    notes: null,
    id: -1,
  };
};

export default function OrderTable({
  order,
  handleUpdatedOrder,
}: {
  order: OrderType;
  handleUpdatedOrder: (updatedOrder: OrderType) => void;
}) {
  
  const [newCode, setNewCode] = useState<string>("");
  const [newQuantity, setNewQuantity] = useState<number | undefined>(undefined);
  const [products, setProducts] = useState<ProductsInOrderType[]>([
    ...order.products,
    createNewProduct(),
  ]);

  const handleFieldChange = useCallback(
    (key: string, value: any, id: number, rowIndex: number) => {
      const index = id == -1 ? products.length - 1 : rowIndex;
      console.log(value);
      if (key === "code") {
        setProducts((prevValues) => {
          const updatedProducts = [...prevValues];
          updatedProducts[index].product.code = value;
          if (id == -1) setNewCode(value);
          return updatedProducts;
        });
      } else if (key === "quantity") {
        debounceQuantityChange(value, index, id);
      }
    },
    []
  );

  const debounceQuantityChange = useCallback(
    debounce((value: number, index: number, id: number) => {
      setProducts((prevValues) => {
        const updatedProducts = [...prevValues];
        updatedProducts[index].quantity = value;
        if (id == -1) setNewQuantity(value);
        return updatedProducts;
      });
    }, 500),
    []
  );

  useEffect(() => {
    if (newCode !== "" && newQuantity !== undefined && newQuantity !== 0) {
      addProduct();
    }
  }, [newCode, newQuantity]);

  const addProduct = () => {
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];

      updatedProducts.push(createNewProduct());
      /**
       * questa prodotto fa da dummy. In realtà
       * dovrò ricavare il prodotto che ha quel codice,
       * cosi avrò il "price"
       */
      let price = 10;
      updatedProducts[updatedProducts.length - 2] = {
        product: {
          id: 1,
          name: "Test",
          code: newCode,
          desc: "Test",
          price: price,
        },
        created_at: new Date(),
        updated_at: new Date(),
        product_id: 1,
        order_id: 1,
        quantity: newQuantity ?? 0,
        total: price * (newQuantity ?? 0),
        notes: null,
        id: 3,
      };

      setNewCode(createNewProduct().product.code);
      setNewQuantity(createNewProduct().quantity);

      handleUpdatedOrder({
        ...order,
        total: updatedProducts.reduce((acc, product) => acc + product.total, 0),
        products: updatedProducts.filter((item) => item.id !== -1),
      });

      return updatedProducts;
    });
  };

  const columns = getColumns(handleFieldChange, products);
  const table = getTable(products, columns);

  return (
    <Table>
      <TableHeader className="sticky top-0 z-30 bg-background">
        {table.getRowModel().rows?.length > 0 &&
          table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    index == 0 && "w-[20%]",
                    index == 1 && "w-[10%]",
                    index == 2 && "w-[30%]",
                    index == 3 && "w-[10%]",
                    index == 4 && "w-[20%]"
                  )}
                >
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
            className={cn(row.original.id == -1 && "", "h-20")}
          >
            {row.getVisibleCells().map((cell, index) => (
              <TableCell
                key={cell.id}
                className={cn(
                  index == 0 && "w-[20%] h-20",
                  index == 1 && "w-[10%] h-20",
                  index == 2 && "w-[30%] h-20",
                  index == 3 && "w-[10%] h-20",
                  index == 4 && "w-[20%] h-20"
                )}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
        {table.getRowModel().rows.length === 0 && (
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
