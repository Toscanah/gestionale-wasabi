import getColumns from "./getColumns";
import { ProductInOrder } from "@/app/(site)/models";
import { useEffect, useState } from "react";
import Table from "../../components/table/Table";
import getTable from "../../functions/util/getTable";
import OrderOverview from "./overview/OrderOverview";
import OrderPayment from "../../payments/order/OrderPayment";
import DivideOrder from "../divide-order/DivideOrder";
import RomanStyle from "../divide-order/RomanStyle";
import DangerActions from "./overview/DangerActions";
import { useOrderContext } from "../../context/OrderContext";
import print from "../../printing/print";
import KitchenReceipt from "../../printing/receipts/KitchenReceipt";
import NormalActions from "./overview/NormalActions";
import { QuickPaymentOption } from "./overview/QuickPaymentOptions";

export type PayingAction = "none" | "payFull" | "payPart" | "paidFull" | "paidPart" | "payRoman";

export default function OrderTable() {
  const {
    order,
    toggleDialog,
    dialogOpen,
    addProduct,
    newCode,
    newQuantity,
    updateProduct,
    updateProductField,
    updateUnprintedProducts,
  } = useOrderContext();

  const [payingAction, setPayingAction] = useState<PayingAction>("none");
  // const [quickPaymentOption, setQuickPaymentOption] = useState<QuickPaymentOption>("none");
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

    const productToUpdate = order.products[index];

    if (productToUpdate.product_id !== -1) {
      updateProduct(key, value, index);
    } else {
      updateProductField(key, value, index);
    }
  };

  const columns = getColumns(handleFieldChange, order.type, {
    rowIndex: order.products.length - 1,
    colIndex: 0,
  });

  const table = getTable<ProductInOrder>({
    data: order.products.sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    ),
    columns,
    rowSelection,
    setRowSelection,
  });

  useEffect(() => {
    if (payingAction === "paidFull") {
      toggleDialog(false);
    }
  }, [payingAction]);

  useEffect(() => {
    const printKitchenRec = async () => {
      const unprintedProducts = await updateUnprintedProducts();

      if (unprintedProducts.length > 0) {
        await print(() => KitchenReceipt({ ...order, products: unprintedProducts }));
      }
    };

    if (!dialogOpen && !order.suborder_of && order.state !== "CANCELLED") {
      if (payingAction == "payPart") {
        setTimeout(printKitchenRec, 400);
      } else {
        printKitchenRec();
      }
    }
  }, [dialogOpen]);

  return payingAction == "none" ? (
    <div className="w-full h-full flex gap-6 justify-between">
      <div className="w-[75%] h-full flex flex-col gap-6 justify-between">
        <Table
          headerClassName="[&:nth-child(2)]:w-32 [&:nth-child(3)]:w-52 [&:nth-child(4)]:w-80"
          table={table}
          tableClassName="h-full max-h-full"
          stickyRowIndex={order.products.length - 1}
        />
        <DangerActions table={table} />
      </div>

      <OrderOverview setAction={setPayingAction} />
    </div>
  ) : payingAction == "payFull" ? (
    <OrderPayment
      type="full"
      onOrderPaid={() => setPayingAction("paidFull")}
      handleBackButton={() => setPayingAction("none")}
    />
  ) : payingAction == "payRoman" ? (
    <RomanStyle
      handleOrderPaid={() => setPayingAction("paidFull")}
      handleBackButton={() => setPayingAction("none")}
    />
  ) : (
    <DivideOrder
      products={order.products.filter((product) => product.product_id !== -1)}
      setPayingAction={setPayingAction}
    />
  );
}
