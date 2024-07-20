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

const createNewProduct = (): ProductInOrderType => {
  return {
    product: {
      id: -1,
      name: "",
      code: "",
      desc: "",
      home_price: 0,
      site_price: 0,
      category_id: -1,
      rice: 0,
    },
    product_id: -1,
    order_id: -1,
    quantity: 0,
    total: 0,
    id: -1,
  };
};

export default function OrderTable({ order }: { order: BaseOrder }) {
  const [products, setProducts] = useState<ProductInOrderType[]>([
    ...order.products,
    createNewProduct(),
  ]);

  const { onOrdersUpdate } = useWasabiContext();
  const [newCode, setNewCode] = useState<string>("");
  const [newQuantity, setNewQuantity] = useState<number>(0);

  const handleFieldChange = (key: string, value: any, index: number) => {
    setProducts((prevProducts) => {
      const productToUpdate = prevProducts[index];
      if (productToUpdate.product_id !== -1) {
        updateProduct(prevProducts, key, value, index);
      } else {
        return key === "code"
          ? codeChange(prevProducts, value, index)
          : quantityChange(prevProducts, value, index);
      }
      return prevProducts;
    });
  };

  const toastError = (value: any, message: ReactNode) => {
    toast.error("Errore", {
      description: message,
    });
  };

  const updateProduct = (
    prevProducts: ProductInOrderType[],
    key: string,
    value: any,
    index: number
  ) => {
    let productToUpdate = prevProducts[index];

    if (key == "code" && value <= 0) {
      toastError(
        value,
        <>
          Il prodotto con codice <b>{value}</b> non è stato trovato
        </>
      );
      return;
    }

    if (key == "quantity" && value < 0) {
      toastError(value, <>La quantità non può essere negativa</>);
      return;
    }

    fetch("/api/products/", {
      method: "POST",
      body: JSON.stringify({
        requestType: "update",
        content: {
          orderId: order.id,
          key: key,
          value: value,
          product: productToUpdate,
        },
      }),
    })
      .then((response) => response.json())
      .then(
        (result: {
          updatedProduct?: ProductInOrderType;
          deletedProduct?: ProductInOrderType;
        }) => {
          const { updatedProduct, deletedProduct } = result;

          let updatedProducts = [...prevProducts];

          if (deletedProduct) {
            updatedProducts = updatedProducts.filter(
              (p) => p.id !== deletedProduct.id
            );
          }

          if (updatedProduct) {
            // se è -1 non esiste gia un prodotto con quel product_id
            const existingIndex = updatedProducts.findIndex(
              (p) => p.id === updatedProduct.id
            );

            if (existingIndex == -1) {
              updatedProducts[index] = updatedProduct;
            } else {
              updatedProducts[existingIndex] = updatedProduct;
            }
          }

          setProducts(updatedProducts);

          toast.success("Prodotto aggiornato", {
            description: <>Il prodotto è stato aggiornato correttamente</>,
          });

          onOrdersUpdate(order.type as TypesOfOrder);
        }
      );

    onOrdersUpdate(order.type as TypesOfOrder);
  };

  const codeChange = (
    products: ProductInOrderType[],
    value: string,
    index: number
  ) => {
    products[index].product.code = value;
    setNewCode(value);

    return products;
  };

  const quantityChange = (
    products: ProductInOrderType[],
    value: number,
    index: number
  ) => {
    products[index].quantity = value;
    setNewQuantity(value);

    return products;
  };

  useEffect(() => {
    if (
      newCode !== "" &&
      Number(newQuantity) !== 0 &&
      Number(newQuantity) !== undefined &&
      Number(newQuantity) !== null
    ) {
      addProduct();
    }
  }, [newCode, newQuantity]);

  const addProduct = () => {
    fetch(`/api/products/`, {
      method: "POST",
      body: JSON.stringify({
        requestType: "add",
        content: {
          orderId: order.id,
          productCode: newCode,
          quantity: newQuantity,
        },
      }),
    })
      .then((response) => response.json())
      .then((productOnOrder: ProductInOrderType) => {
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

            updatedProducts.push(createNewProduct());
            return updatedProducts;
          });

          setNewCode("");
          setNewQuantity(0);
          onOrdersUpdate(order.type as TypesOfOrder);

          toast.success("Prodotto aggiunto", {
            description: <>Il prodotto è stato aggiunto correttamente</>,
          });
        } else {
          toast.error("Prodotto non trovato", {
            description: (
              <>
                Il prodotto con codice <b>{newCode}</b> non è stato trovato
              </>
            ),
          });
        }
      });
  };

  const [rowSelection, setRowSelection] = useState({});

  const deleteRows = async (table: TanstackTable<ProductInOrderType>) => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedProductIds = selectedRows.map((row) => row.original.id);

    if (selectedProductIds.length > 0) {
      fetch("/api/products/", {
        method: "DELETE",
        body: JSON.stringify({
          requestType: "delete",
          content: { productIds: selectedProductIds, orderId: order.id },
        }),
      })
        .then((response) => response.json)
        .then(() => {
          setProducts((prevProducts) =>
            prevProducts.filter((_, index) => {
              return !selectedRows.some((row) => row.index === index);
            })
          );
          table.resetRowSelection();
          onOrdersUpdate(order.type as TypesOfOrder);
        });
    }
  };

  const columns = getColumns(handleFieldChange, order.type as TypesOfOrder);
  const table = getTable(products, columns, rowSelection, setRowSelection);

  return (
    <div className="w-full h-full flex space-x-6 justify-between">
      <div className="w-[80%] h-full flex flex-col gap-6">
        <div>
          <Button onClick={() => deleteRows(table)}>
            Cancella prodotti selezionati
          </Button>
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

      {/* <Actions deleteRows={() => deleteRows(table)} /> */}

      <div className="w-[20%] flex flex-col justify-end space-y-4">
        <div className="text-center text-4xl">Totale: {order.total}</div>
        <Button className="w-full">Chiudi e paga</Button>
      </div>
    </div>
  );
}
