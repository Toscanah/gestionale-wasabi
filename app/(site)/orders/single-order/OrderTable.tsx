import getColumns from "./getColumns";
import { ProductInOrderType } from "../../types/ProductInOrderType";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useWasabiContext } from "../../context/WasabiContext";
import { OrderType } from "../../types/OrderType";
import Table from "../../components/table/Table";
import getTable from "../../util/functions/getTable";
import { AnyOrder } from "../../types/PrismaOrders";
import OrderOverview from "./overview/OrderOverview";
import OrderPayment from "../../payments/order/OrderPayment";
import DivideOrder from "../divide-order/DivideOrder";
import { useProductManager } from "../../components/hooks/useProductManager";
import { useOrderManager } from "../../components/hooks/useOrderManager";
import RomanStyle from "../divide-order/RomanStyle";
import DangerActions from "./overview/DangerActions";

export type Actions = "" | "payFull" | "payPart" | "paidFull" | "paidPart" | "payRoman";

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
  const { updateOrder, cancelOrder } = useOrderManager(order, setOrder);
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

  useEffect(() => {
    if (newCode !== "" && newQuantity > 0) {
      addProduct();
    }
  }, [newCode, newQuantity]);

  const handleFieldChange = (key: "code" | "quantity", value: any, index: number) => {
    const productToUpdate = products[index];

    if (productToUpdate.product_id !== -1) {
      updateProduct(key, value, index);
    } else {
      updateProductField(key, value, index);
    }
  };

  const columns = getColumns(handleFieldChange, order.type as OrderType, updateProductOption, {
    rowIndex: products.length - 1,
    colIndex: 0,
  });
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
    <div className="w-full h-full flex gap-6 justify-between">
      <div className="w-[80%] h-full flex flex-col gap-6 justify-between">
        <Table table={table} tableClassName="h-full max-h-full" />
        <DangerActions
          cancelOrder={() => {
            cancelOrder();
            setOpen(false);
          }}
          deleteProducts={deleteProducts}
          table={table}
        />
      </div>

      <OrderOverview        
        order={order}
        setAction={setAction}
        addProducts={addProducts}
      />
    </div>
  ) : action == "payFull" ? (
    <OrderPayment
      handleOrderPaid={() => setAction("paidFull")}
      handleBackButton={() => setAction("")}
      order={order}
      setProducts={setProducts}
      type="full"
    />
  ) : action == "payRoman" ? (
    <RomanStyle
      order={order}
      handleOrderPaid={() => setAction("paidFull")}
      handleBackButton={() => setAction("")}
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
