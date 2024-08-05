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
import formatRice from "../../util/functions/formatRice";

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

    if (key == "quantity" && value < 0) {
      return toastError("La quantità non può essere negativa");
    }

    fetchRequest<{
      updatedProduct?: ProductInOrderType;
      deletedProduct?: ProductInOrderType;
      error?: string;
    }>("POST", "/api/products/", "updateProduct", {
      orderId: order.id,
      key: key,
      value: value,
      product: productToUpdate,
    }).then((result) => {
      const { updatedProduct, deletedProduct, error } = result;

      if (error) {
        return toastError(
          <>
            Il codice <b>{value}</b> non corrisponde a nessun prodotto
          </>
        );
      }

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
              category: productOnOrder.product.category,
              id: productOnOrder.product_id,
              name: productOnOrder.product.name,
              code: newCode,
              desc: productOnOrder.product.desc,
              home_price: productOnOrder.product.home_price,
              site_price: productOnOrder.product.site_price,
              rice: productOnOrder.product.rice,
              category_id: productOnOrder.product.category_id,
              options: productOnOrder.product.options,
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
        productIds: selectedProductIds,
        orderId: order.id,
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
  const { rice } = useWasabiContext();
  const [usedRice, setUsedRice] = useState<number>(0);

  useEffect(() => {
    setUsedRice(
      order.products.reduce((total, product) => total + product.product.rice * product.quantity, 0)
    );
  }, [order.products]);

  return (
    <div className="w-full h-full flex space-x-6 justify-between">
      <div className="w-[80%] h-full flex flex-col gap-4">
        <div className="w-full rounded-md border flex-grow overflow-y-auto max-h-max">
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
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(row.original.product_id == -1 && "hover:bg-background")}
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell key={cell.id} className={cn("h-12 text-2xl", index == 2 && "p-0")}>
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

      <div className="w-[20%] flex flex-col gap-6 h-full">
        <Button
          className="w-full h-12 text-xl"
          variant={"destructive"}
          onClick={() => deleteRows(table)}
          disabled={table.getFilteredSelectedRowModel().rows.length == 0}
        >
          Cancella prodotti selezionati
        </Button>

        <Button className="w-full h-12 text-xl" variant={"destructive"} onClick={() => {}}>
          Elimina ordine
        </Button>

        <div className="mt-auto flex flex-col gap-6">
          <div className="w-full flex flex-col overflow-hidden border-foreground">
            <div className="w-full text-center text-2xl border rounded-t bg-foreground text-primary-foreground h-12 p-2">
              RISO
            </div>

            <div className="w-full text-center text-2xl h-12 max-h-12 font-bold border-x flex ">
              <div
                className={cn(
                  "w-1/2 border-r p-2 h-12",
                  rice - usedRice < 100 && "text-destructive"
                )}
              >
                Rimanente
              </div>
              <div className="w-1/2 p-2 h-12">Ordine</div>
            </div>

            <div className="w-full text-center text-2xl h-12 border flex max-h-12">
              <div
                className={cn(
                  "w-1/2 border-r p-2 h-12",
                  rice - usedRice < 100 && "text-destructive"
                )}
              >
                {formatRice(rice - usedRice)}
              </div>
              <div className="w-1/2 p-2 h-12">{formatRice(usedRice)}</div>
            </div>
          </div>

          <div className="w-full flex flex-col  *:p-2 overflow-hidden border-foreground">
            <div className="w-full text-center text-2xl border rounded-t bg-foreground text-primary-foreground h-12">
              TOTALE
            </div>
            <div className="w-full text-center text-2xl h-12 font-bold border-x border-b rounded-b ">
              € {order.total}
            </div>
          </div>

          <div className="flex gap-6">
            <Button className="w-full text-3xl h-24">Dividi</Button>
            <Button className="w-full text-3xl h-24">Stampa</Button>
          </div>

          {/* bg-[#4BB543] */}
          <Button className="w-full text-3xl h-24 ">PAGA</Button>
        </div>
      </div>
    </div>
  );
}
