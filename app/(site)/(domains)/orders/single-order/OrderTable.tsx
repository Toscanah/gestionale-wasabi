import { OrderGuards, ProductInOrder } from "@/app/(site)/lib/shared";
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
import { OrderStatus, PaymentScope } from "@/prisma/generated/client/enums";
import { getOrderTotal } from "../../../lib/services/order-management/getOrderTotal";
import usePrinter from "@/app/(site)/hooks/printing/usePrinter";
import orderColumns from "./columns/orderColumns";

export type PayingAction = "none" | "payFull" | "payPart" | "paidFull" | "paidPart" | "payRoman";

export type OrderTableMeta = {
  finalizeRowUpdate: (rowIndex: number, quantity?: number) => Promise<any>;
  interactionReady: boolean;
};

export default function OrderTable() {
  const {
    order,
    rows,
    setRowValue,
    finalizeRowUpdate,
    deleteProducts,
    toggleDialog,
    dialogOpen,
    updatePrintedProducts,
  } = useOrderContext();

  const { printKitchen } = usePrinter();

  const [payingAction, setPayingAction] = useState<PayingAction>("none");
  const [rowSelection, setRowSelection] = useState({});
  const [interactionReady, setInteractionReady] = useState(false);

  useEffect(() => {
    if (dialogOpen) {
      setInteractionReady(false);
      const timeout = setTimeout(() => setInteractionReady(true), 400);
      return () => clearTimeout(timeout);
    }
  }, [dialogOpen]);

  const columns = orderColumns({
    rows,
    setRowValue,
    defaultFocusedInput: {
      rowIndex: order.products.length - 1,
      colIndex: 0,
    },
  });

  const table = useTable<ProductInOrder, OrderTableMeta>({
    data: order.products.sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    ),
    columns,
    rowSelection,
    setRowSelection,
    meta: {
      finalizeRowUpdate: (rowIndex: number, quantity?: number) => {
        setInteractionReady(false);
        return finalizeRowUpdate(rowIndex, quantity).finally(() => setInteractionReady(true));
      },
      interactionReady,
    },
  });

  useEffect(() => {
    if (payingAction === "paidFull") toggleDialog(false);
  }, [payingAction]);

  useEffect(() => {
    const rec = async () => {
      const updated = await updatePrintedProducts();
      if (updated.length > 0) {
        await printKitchen({ order: { ...order, products: updated } });
      }
    };

    if (!dialogOpen && !order.suborder_of && order.status !== OrderStatus.CANCELLED) {
      payingAction === "payPart" ? setTimeout(rec, 500) : rec();
    }
  }, [dialogOpen]);

  return payingAction == "none" ? (
    <div className="w-full h-full flex gap-6 justify-between">
      <div className="w-[72%] h-full flex flex-col gap-6 justify-between">
        <Table
          showNoResult={false}
          headerClassName="[&:nth-child(2)]:w-32 [&:nth-child(3)]:w-52 [&:nth-child(4)]:w-80"
          table={table}
          tableClassName="h-full max-h-full"
          stickyRowIndex={order.products.length - 1}
        />

        <ExtraItems />

        {(OrderGuards.isHome(order) ||
          (OrderGuards.isPickup(order) && order.pickup_order?.customer_id) ||
          !OrderGuards.isTable(order)) && (
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
          ? getOrderTotal({ order, applyDiscounts: true }) -
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
