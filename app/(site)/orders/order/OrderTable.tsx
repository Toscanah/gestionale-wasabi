import getColumns from "./getColumns";
import { Table as TanstackTable } from "@tanstack/react-table";
import { ProductInOrderType } from "../../types/ProductInOrderType";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useWasabiContext } from "../../context/WasabiContext";
import { OrderType } from "../../types/OrderType";
import createDummyProduct from "../../util/functions/createDummyProduct";
import fetchRequest from "../../util/functions/fetchRequest";
import { toastError, toastSuccess } from "../../util/toast";
import { Option, OptionInProductOrder } from "@prisma/client";
import Table from "../../components/table/Table";
import getTable from "../../util/functions/getTable";
import { AnyOrder } from "../../types/PrismaOrders";
import OrderOverview from "./OrderOverview";
import Payment from "../../payments/Payment";
import DivideOrder from "./divide-order/DivideOrder";

export type Actions = "" | "payFull" | "payPart" | "paidFull" | "paidPart";

export default function OrderTable({
  order,
  setOpen,
  setOrder,
}: {
  order: AnyOrder;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setOrder?: Dispatch<SetStateAction<AnyOrder | undefined>>;
}) {
  const [products, setProducts] = useState<ProductInOrderType[]>([
    ...order.products,
    createDummyProduct(),
  ]);
  const [action, setAction] = useState<Actions>("");
  const [rowSelection, setRowSelection] = useState({});
  const [newCode, setNewCode] = useState<string>("");
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const { onOrdersUpdate } = useWasabiContext();
  const [focusedInput, setFocusedInput] = useState({ rowIndex: products.length - 1, colIndex: 0 });

  const updateOrder = (updatedProducts: ProductInOrderType[]) => {
    setOrder &&
      setOrder((prevOrder) =>
        prevOrder
          ? {
              ...prevOrder,
              products: updatedProducts,
              total: updatedProducts.reduce((acc, product) => {
                const productPrice =
                  order.type === OrderType.TO_HOME
                    ? product.product.home_price
                    : product.product.site_price;

                return acc + product.quantity * productPrice;
              }, 0),
            }
          : prevOrder
      );
  };

  const selectOption = (productInOrderId: number, optionId: number) => {
    fetchRequest<OptionInProductOrder & { option: Option }>(
      "POST",
      "/api/products/",
      "updateProductOptionsInOrder",
      { productInOrderId, optionId }
    ).then((newOption) => {
      setProducts((prevProducts) =>
        prevProducts.map((product: ProductInOrderType) =>
          product.id === productInOrderId
            ? {
                ...product,
                options: product.options.some(
                  (selectedOption: { option: Option }) =>
                    selectedOption.option.id === newOption.option_id
                )
                  ? product.options.filter(
                      (selectedOption: { option: Option }) =>
                        selectedOption.option.id !== newOption.option_id
                    )
                  : [...product.options, { option: newOption.option }],
              }
            : product
        )
      );

      onOrdersUpdate(order.type as OrderType);
    });
  };

  const handleFieldChange = (key: string, value: any, index: number) => {
    const productToUpdate = products[index];

    if (productToUpdate.product_id !== -1) {
      updateProduct(key, value, index);
    } else {
      changeField(key, value, index);
    }
  };

  // FATTO
  const updateProduct = (key: string, value: any, index: number) => {
    let productToUpdate = products[index];

    if (key == "quantity" && value < 0) {
      return toastError("La quantità non può essere negativa");
    }

    fetchRequest<{
      updatedProduct?: ProductInOrderType;
      deletedProduct?: ProductInOrderType;
      error?: string;
    }>("POST", "/api/products/", "updateProductInOrder", {
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

        updateOrder(updatedProducts);

        return updatedProducts;
      });

      toastSuccess("Il prodotto è stato aggiornato correttamente", "Prodotto aggiornato");
      onOrdersUpdate(order.type as OrderType);
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

  // FATTO
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
              ...productOnOrder.product,
              code: newCode,
            },
            options: productOnOrder.options,
            product_id: productOnOrder.product_id,
            order_id: order.id,
            quantity: productOnOrder.quantity,
            total: productOnOrder.total,
            id: productOnOrder.id,
            isPaidFully: false,
            paidQuantity: 0,
          });

          updatedProducts.push(createDummyProduct());

          updateOrder(updatedProducts);

          return updatedProducts;
        });

        setNewCode("");
        setNewQuantity(0);
        onOrdersUpdate(order.type as OrderType);

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

  // FATTO
  const deleteRows = async (table: TanstackTable<ProductInOrderType>) => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedProductIds = selectedRows.map((row) => row.original.id);

    if (selectedProductIds.length > 0) {
      fetchRequest("DELETE", "/api/products/", "deleteProductFromOrder", {
        productIds: selectedProductIds,
        orderId: order.id,
      }).then(() => {
        setProducts((prevProducts) => {
          const updatedProducts = prevProducts.filter((p) => !selectedProductIds.includes(p.id));

          updateOrder(updatedProducts);

          return updatedProducts;
        });

        table.resetRowSelection();
        onOrdersUpdate(order.type as OrderType);
      });
    }
  };

  const columns = getColumns(
    handleFieldChange,
    order.type as OrderType,
    focusedInput,
    setFocusedInput,
    selectOption
  );
  const table = getTable<ProductInOrderType>({
    data: products,
    columns,
    rowSelection,
    setRowSelection,
  });

  useEffect(() => {
    if (action === "paidFull") {
      onOrdersUpdate(order.type as OrderType);
      setOpen(false);
    }
  }, [action]);

  return action == "" ? (
    <div className="w-full h-full flex space-x-6 justify-between">
      <div className="w-[80%] h-full">
        <Table table={table} tableClassName="h-full max-h-full" />
      </div>

      <OrderOverview deleteRows={deleteRows} table={table} order={order} setAction={setAction} />
    </div>
  ) : action == "payFull" ? (
    <Payment
      handleOrderPaid={() => setAction("paidFull")}
      handleBackButton={() => setAction("")}
      order={order}
      setProducts={setProducts}
      type="full"
    />
  ) : (
    <DivideOrder
      setProducts={setProducts}
      order={order}
      products={products.filter((product) => product.product_id !== -1)}
      setAction={setAction}
    />
  );
}
