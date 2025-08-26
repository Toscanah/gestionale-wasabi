import getColumns from "./getColumns";
import { ProductInOrder } from "@/app/(site)/lib/shared";
import { useEffect, useState } from "react";
import Table from "../../../components/table/Table";
import useTable from "../../../hooks/table/useTable";
import OrderOverview from "./overview/OrderOverview";
import OrderPayment from "../../payments/order/OrderPayment";
import DivideOrder from "../divide-order/DivideOrder";
import RomanStyle from "../divide-order/RomanStyle";
import DangerActions from "./overview/DangerActions";
import { useOrderContext } from "../../../context/OrderContext";
import Notes from "./overview/Notes";
import ExtraItems from "./overview/ExtraItems";
import { OrderStatus, OrderType, PaymentScope } from "@prisma/client";
import { getOrderTotal } from "../../../lib/services/order-management/getOrderTotal";
import usePrinter from "@/app/(site)/hooks/printing/usePrinter";

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
  const { printKitchen } = usePrinter();

  const [payingAction, setPayingAction] = useState<PayingAction>("none");
  const [rowSelection, setRowSelection] = useState({});
  const [interactionReady, setInteractionReady] = useState(false);

  useEffect(() => {
    if (dialogOpen) {
      setInteractionReady(false);
      const timeout = setTimeout(() => {
        setInteractionReady(true);
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [dialogOpen]);

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

  const columns = getColumns(handleFieldChange, interactionReady, {
    rowIndex: order.products.length - 1,
    colIndex: 0,
  });

  const table = useTable<ProductInOrder>({
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
        await printKitchen({ order: { ...order, products: unprintedProducts } });
      }
    };

    if (!dialogOpen && !order.suborder_of && order.status !== OrderStatus.CANCELLED) {
      if (payingAction === "payPart") {
        setTimeout(printKitchenRec, 500);
      } else {
        printKitchenRec();
      }
    }
  }, [dialogOpen]);

  return payingAction == "none" ? (
    <div className="w-full h-full flex gap-6 justify-between">
      <div className="w-[72%] h-full flex flex-col gap-6 justify-between">
        <Table
          headerClassName="[&:nth-child(2)]:w-32 [&:nth-child(3)]:w-52 [&:nth-child(4)]:w-80"
          table={table}
          tableClassName="h-full max-h-full"
          stickyRowIndex={order.products.length - 1}
        />

        <ExtraItems />

        {order.type !== OrderType.TABLE && (
          <div className="flex space-x-6">
            <Notes />
          </div>
        )}

        <DangerActions table={table} />
      </div>

      <OrderOverview setAction={setPayingAction} />
    </div>
  ) : payingAction == "payFull" ? (
    <OrderPayment
      manualTotalAmount={
        order.payments.some((p) => p.scope === PaymentScope.ROMAN)
          ? getOrderTotal({ order, applyDiscount: true }) -
            order.payments
              .filter((p) => p.scope === PaymentScope.ROMAN)
              .reduce((sum, p) => sum + p.amount, 0)
          : undefined
      }
      stage="FINAL"
      scope={PaymentScope.FULL}
      onOrderPaid={() => setPayingAction("paidFull")}
      onBackButton={() => setPayingAction("none")}
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
