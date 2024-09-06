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
import { AnyOrder, HomeOrder, PickupOrder } from "../../types/PrismaOrders";
import OrderOverview from "./OrderOverview";
import Payment from "../../payments/Payment";
import DivideOrder from "./divide-order/DivideOrder";
import { useProductManager } from "../../components/hooks/useProductManager";
import { useOrderManager } from "../../components/hooks/useOrderManager";

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
  const { onOrdersUpdate } = useWasabiContext();
  const { updateOrder } = useOrderManager(order, setOrder);
  const {
    products,
    setProducts,
    addProduct,
    addProducts,
    newCode,
    newQuantity,
    updateProduct,
    updateProductField,
    deleteProducts,
    updateProductOption,
  } = useProductManager(order, updateOrder);
  const [action, setAction] = useState<Actions>("");
  const [rowSelection, setRowSelection] = useState({});
  const [focusedInput, setFocusedInput] = useState({ rowIndex: products.length - 1, colIndex: 0 });

  useEffect(() => {
    if (newCode !== "" && newQuantity > 0) {
      addProduct();
    }
  }, [newCode, newQuantity]);

  const handleFieldChange = (key: string, value: any, index: number) => {
    const productToUpdate = products[index];

    if (productToUpdate.product_id !== -1) {
      updateProduct(key, value, index);
    } else {
      updateProductField(key, value, index);
    }
  };

  const columns = getColumns(
    handleFieldChange,
    order.type as OrderType,
    focusedInput,
    setFocusedInput,
    updateProductOption
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

      <OrderOverview
        deleteProducts={() => deleteProducts(table)}
        table={table}
        order={order}
        setAction={setAction}
        addProducts={addProducts}
      />
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
