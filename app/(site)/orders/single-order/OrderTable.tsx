import getColumns from "./getColumns";
import { ProductInOrderType } from "../../types/ProductInOrderType";
import { useEffect, useState } from "react";
import { useWasabiContext } from "../../context/WasabiContext";
import { OrderState, OrderType } from "@prisma/client";
import Table from "../../components/table/Table";
import getTable from "../../util/functions/getTable";
import OrderOverview from "./overview/OrderOverview";
import OrderPayment from "../../payments/order/OrderPayment";
import DivideOrder from "../divide-order/DivideOrder";
import { useProductManager } from "../../components/hooks/useProductManager";
import { useOrderManager } from "../../components/hooks/useOrderManager";
import RomanStyle from "../divide-order/RomanStyle";
import DangerActions from "./overview/DangerActions";
import { useOrderContext } from "../../context/OrderContext";
import print from "../../printing/print";
import KitchenReceipt from "../../printing/receipts/KitchenReceipt";
import fetchRequest from "../../util/functions/fetchRequest";

export type PayingAction = "none" | "payFull" | "payPart" | "paidFull" | "paidPart" | "payRoman";

export default function OrderTable() {
  const { order, setOrder, toggleDialog, dialogOpen } = useOrderContext();

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
  const [payingAction, setPayingAction] = useState<PayingAction>("none");
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    if (newCode !== "" && newQuantity > 0) {
      addProduct();
    }
  }, [newCode, newQuantity]);

  const handleFieldChange = (key: "code" | "quantity", value: any, index: number) => {
    if (key === "quantity" && isNaN(Number(value))) {
      return;
    }

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
    if (payingAction === "paidFull") {
      onOrdersUpdate(order.type as OrderType);
      toggleDialog(false);
    }
  }, [payingAction]);

  useEffect(() => {
    const printKitchenRec = async () => {
      await onOrdersUpdate(order.type).then(async () => {
        const remainingProducts = await fetchRequest<ProductInOrderType[]>(
          "POST",
          "/api/products/",
          "updatePrintedAmounts",
          { products: order.products ?? [] }
        );

        await onOrdersUpdate(order.type);
        
        if (remainingProducts.length > 0) {
          await print(() => KitchenReceipt({ ...order, products: remainingProducts }));
        }
      });
    };

    if (!dialogOpen && !order.suborderOf && order.state !== "CANCELLED") {
      printKitchenRec();
    }
  }, [dialogOpen]);

  return payingAction == "none" ? (
    <div className="w-full h-full flex gap-6 justify-between">
      <div className="w-[80%] h-full flex flex-col gap-6 justify-between">
        <Table table={table} tableClassName="h-full max-h-full" />
        <DangerActions
          cancelOrder={async (cooked) => await cancelOrder(cooked).then(() => toggleDialog(false))}
          deleteProducts={deleteProducts}
          table={table}
        />
      </div>

      <OrderOverview order={order} setAction={setPayingAction} addProducts={addProducts} />
    </div>
  ) : payingAction == "payFull" ? (
    <OrderPayment
      order={order}
      type="full"
      onOrderPaid={() => setPayingAction("paidFull")}
      handleBackButton={() => setPayingAction("none")}
      setProducts={setProducts}
    />
  ) : payingAction == "payRoman" ? (
    <RomanStyle
      order={order}
      handleOrderPaid={() => setPayingAction("paidFull")}
      handleBackButton={() => setPayingAction("none")}
    />
  ) : (
    <DivideOrder
      setProducts={setProducts}
      order={order}
      products={products.filter((product) => product.product_id !== -1)}
      setPayingAction={setPayingAction}
    />
  );
}
