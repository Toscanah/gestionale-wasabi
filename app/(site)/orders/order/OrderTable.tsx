import getColumns from "./getColumns";
import { Table as TanstackTable } from "@tanstack/react-table";
import { ProductInOrderType } from "../../types/ProductInOrderType";
import { useEffect, useState } from "react";
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

export default function OrderTable({ order }: { order: AnyOrder }) {
  const [products, setProducts] = useState<ProductInOrderType[]>([
    ...order.products,
    createDummyProduct(),
  ]);
  const [rowSelection, setRowSelection] = useState({});
  const [newCode, setNewCode] = useState<string>("");
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const { onOrdersUpdate } = useWasabiContext();
  const [focusedInput, setFocusedInput] = useState({ rowIndex: products.length - 1, colIndex: 0 });

  const selectOption = (productInOrderId: number, optionId: number) => {
    const content = { productInOrderId, optionId };
    fetchRequest<OptionInProductOrder & { option: Option }>(
      "POST",
      "/api/products/",
      "updateProductOptionsInOrder",
      content
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
              active: productOnOrder.product.active,
              category: productOnOrder.product.category,
              id: productOnOrder.product_id,
              code: newCode,
              desc: productOnOrder.product.desc,
              home_price: productOnOrder.product.home_price,
              site_price: productOnOrder.product.site_price,
              rice: productOnOrder.product.rice,
              category_id: productOnOrder.product.category_id,
            },
            options: productOnOrder.options,
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

  const [payDialog, setPayDialog] = useState<boolean>(false);
  const [divide, setDivide] = useState<boolean>(false);

  //useEffect(() => console.log(payDialog), [payDialog])

  console.log("ordine grande");

  return !payDialog && !divide ? (
    <div className="w-full h-full flex space-x-6 justify-between">
      <div className="w-[80%] h-full">
        <Table table={table} tableClassName="h-full max-h-full" />
      </div>

      <OrderOverview
        deleteRows={deleteRows}
        table={table}
        order={order}
        setPayDialog={setPayDialog}
        setDivide={setDivide}
      />
    </div>
  ) : payDialog ? (
    <Payment setPayDialog={setPayDialog} order={order} />
  ) : (
    <DivideOrder
      order={order}
      products={products.filter((product) => product.product_id !== -1)}
      setDivide={setDivide}
    />
  );
}
