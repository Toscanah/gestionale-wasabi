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
import { Table as TanstackTable, flexRender } from "@tanstack/react-table";
import { ProductInOrderType } from "../../types/ProductInOrderType";
import { useEffect, useState, ReactNode } from "react";
import { BaseOrder } from "../../types/OrderType";
import { cn } from "@/lib/utils";
import { useWasabiContext } from "../WasabiContext";
import { TypesOfOrder } from "../../types/TypesOfOrder";
import { toast } from "sonner";
import Actions from "./Actions";
import { Button } from "@/components/ui/button";
import createDummyProduct from "../../util/functions/createDummyProduct";
import fetchRequest from "../../util/functions/fetchRequest";
import { toastError, toastSuccess } from "../../util/toast";

export default function OrderTable({ order }: { order: BaseOrder }) {
  const [products, setProducts] = useState<ProductInOrderType[]>([
    ...order.products,
    createDummyProduct(),
  ]);
  const [rowSelection, setRowSelection] = useState({});
  const [newCode, setNewCode] = useState<string>("");
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const { onOrdersUpdate } = useWasabiContext();
  const [focusedInput, setFocusedInput] = useState({ rowIndex: products.length - 1, colIndex: 0 });

  const handleFieldChange = (key: string, value: any, index: number) => {
    const productToUpdate = products[index];

    if (productToUpdate.product_id !== -1) {
      updateProduct(key, value, index);
    } else {
      changeField(key, value, index);
    }
  };

  const updateProduct = (key: string, value: any, index: number) => {
    let productToUpdate = products[index];

    if ((key === "code" && value < 0) || (key === "quantity" && value < 0)) {
      const errorMsg =
        key === "code"
          ? `Il prodotto con codice ${value} non è stato trovato`
          : "La quantità non può essere negativa";
      return toastError(<>{errorMsg}</>);
    }

    fetchRequest<{ updatedProduct?: ProductInOrderType; deletedProduct?: ProductInOrderType }>(
      "POST",
      "/api/products/",
      "updateProduct",
      {
        orderId: order.id,
        key: key,
        value: value,
        product: productToUpdate,
      }
    ).then((result) => {
      const { updatedProduct, deletedProduct } = result;

      setProducts((prevProducts) => {
        let updatedProducts = [...prevProducts];

        if (deletedProduct) {
          updatedProducts = updatedProducts.filter((p) => p.id !== deletedProduct.id);
        }

        if (updatedProduct) {
          const existingIndex = updatedProducts.findIndex((p) => p.id === updatedProduct.id);

          if (existingIndex === -1) {
            updatedProducts[index] = updatedProduct;
          } else {
            updatedProducts[existingIndex] = updatedProduct;
          }
        }
        return updatedProducts;
      });

      toastSuccess("Il prodotto è stato aggiornato correttamente", "Prodotto aggiornato");
      onOrdersUpdate(order.type as TypesOfOrder);
    });
  };

  const changeField = (key: string, value: any, index: number) => {
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];

      if (key === "code") {
        updatedProducts[index].product.code = value;
        setNewCode(value);
      } else if (key === "quantity") {
        updatedProducts[index].quantity = value;
        setNewQuantity(value);
      }
      return updatedProducts;
    });
  };

  useEffect(() => {
    if (newCode !== "" && newQuantity > 0) {
      addProduct();
    }
  }, [newCode, newQuantity]);

  const addProduct = () => {
    fetchRequest<ProductInOrderType>("POST", "/api/products/", "addProductToOrder", {
      order: order,
      productCode: newCode,
      quantity: newQuantity,
    }).then((productOnOrder) => {
      if (productOnOrder) {
        setProducts((prevProducts) => {
          const updatedProducts = [...prevProducts.slice(0, -1)];

          updatedProducts.push({
            product: {
              id: productOnOrder.product_id,
              name: productOnOrder.product.name,
              code: newCode,
              desc: productOnOrder.product.desc,
              home_price: productOnOrder.product.home_price,
              site_price: productOnOrder.product.site_price,
              rice: productOnOrder.product.rice,
              category_id: productOnOrder.product.category_id,
            },
            product_id: productOnOrder.product_id,
            order_id: order.id,
            quantity: productOnOrder.quantity,
            total: productOnOrder.total,
            id: productOnOrder.id,
          });

          updatedProducts.push(createDummyProduct());
          return updatedProducts;
        });

        setNewCode("");
        setNewQuantity(0);
        onOrdersUpdate(order.type as TypesOfOrder);

        toastSuccess("Il prodotto è stato aggiunto correttamente", "Prodotto aggiunto");
      } else {
        toastError(
          <>
            Il prodotto con codice <b>{newCode}</b> non è stato trovato
          </>,
          "Prodotto non trovato"
        );
      }
    });
  };

  const deleteRows = async (table: TanstackTable<ProductInOrderType>) => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedProductIds = selectedRows.map((row) => row.original.id);

    if (selectedProductIds.length > 0) {
      fetchRequest("DELETE", "/api/products/", "deleteProduct", {
        content: { productIds: selectedProductIds, orderId: order.id },
      }).then(() => {
        setProducts((prevProducts) =>
          prevProducts.filter((p) => !selectedProductIds.includes(p.id))
        );
        table.resetRowSelection();
        onOrdersUpdate(order.type as TypesOfOrder);
      });
    }
  };

  const columns = getColumns(
    handleFieldChange,
    order.type as TypesOfOrder,
    focusedInput,
    setFocusedInput
  );
  const table = getTable(products, columns, rowSelection, setRowSelection);

  return (
    <div className="w-full h-full flex space-x-6 justify-between">
      <div className="w-[80%] h-full flex flex-col gap-6">
        <div>
          <Button onClick={() => deleteRows(table)}>Cancella prodotti selezionati</Button>
        </div>

        <div className="w-full rounded-md border flex-grow">
          <Table>
            <TableHeader className="sticky top-0 z-30 bg-background">
              {table.getRowModel().rows?.length > 0 &&
                table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header, index) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell
                      key={cell.id}
                      onClick={() => {
                        if (index > 1) {
                          row.toggleSelected();
                        }
                      }}
                      className={cn(
                        "h-12 text-2xl",
                        index == 2 && "p-0",
                        index > 1 && "hover:cursor-pointer"
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* <Actions deleteRows={() => deleteRows(table)} /> */}

      <div className="w-[20%] flex flex-col justify-end space-y-4">
        <div className="text-center text-4xl">Totale: {order.total}</div>
        <Button className="w-full">Chiudi e paga</Button>
      </div>
    </div>
  );
}
