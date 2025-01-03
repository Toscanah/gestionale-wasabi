import { AnyOrder, HomeOrder } from "@/app/(site)/models";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";
import { PayingAction } from "../OrderTable";
import print from "@/app/(site)/printing/print";
import OrderReceipt from "@/app/(site)/printing/receipts/OrderReceipt";
import { QuickPaymentOption } from "./QuickPaymentOptions";
import RiderReceipt from "../../../printing/receipts/RiderReceipt";
import { OrderType } from "@prisma/client";
import { ProductInOrder } from "@/app/(site)/models";
import KitchenReceipt from "@/app/(site)/printing/receipts/KitchenReceipt";
import { useOrderContext } from "@/app/(site)/context/OrderContext";
import fetchRequest from "@/app/(site)/functions/api/fetchRequest";

interface NormalActionsProps {
  quickPaymentOption: QuickPaymentOption;
  setAction: Dispatch<SetStateAction<PayingAction>>;
}

export default function NormalActions({ setAction, quickPaymentOption }: NormalActionsProps) {
  const { order, updateUnprintedProducts, updateOrder, toggleDialog } = useOrderContext();

  const canSplit = (products: ProductInOrder[]) =>
    products.length > 1 ||
    (products.length === 1 && products[0].quantity > 1 && order.type !== OrderType.HOME);

  const updatePrintedFlag = async () =>
    fetchRequest<AnyOrder>("POST", "/api/orders", "updatePrintedFlag", {
      orderId: order.id,
    }).then((updatedOrder) => {
      updateOrder({ is_receipt_printed: updatedOrder.is_receipt_printed });
    });

  const buildPrintContent = async (
    order: AnyOrder,
    quickPaymentOption: QuickPaymentOption,
    isRePrint = false
  ) => {
    const content = [];

    if (!isRePrint && !order.suborder_of) {
      const unprintedProducts = await updateUnprintedProducts();

      if (unprintedProducts.length > 0) {
        content.push(() => KitchenReceipt<typeof order>({ ...order, products: unprintedProducts }));
      }
    } else {
      content.push(() => KitchenReceipt<typeof order>(order));
    }

    content.push(() =>
      OrderReceipt<typeof order>(order, quickPaymentOption, order.type === OrderType.HOME)
    );

    if (order.type === OrderType.HOME) {
      content.push(() => RiderReceipt(order as HomeOrder, quickPaymentOption));
    }

    return content;
  };

  const handleRePrint = async () => {
    await updatePrintedFlag();
    const content = await buildPrintContent(order, quickPaymentOption, true);
    await print(...content);
  };

  const handlePrint = async () => {
    await updatePrintedFlag();
    const content = await buildPrintContent(order, quickPaymentOption, false);
    await print(...content).then(() => toggleDialog(false));
  };

  const handleFullPayment = async () =>setAction("payFull")
    // questo deve stampare solo quando non ho stampato
    // await print(() => OrderReceipt<typeof order>(order, quickPaymentOption, false)).then(() =>
      
    // );

  const hasProducts = order.products.filter((product) => product.id !== -1).length > 0;

  return (
    <>
      <div className="flex gap-6">
        <Button
          className="w-full text-3xl h-12"
          onClick={() => setAction("payPart")}
          disabled={!canSplit(order.products.filter((product) => product.id !== -1))}
        >
          Dividi
        </Button>

        <Button
          onClick={() => setAction("payRoman")}
          className="w-full text-3xl h-12"
          disabled={true} // order.products.length <= 0 || order.type === OrderType.HOME
        >
          Romana
        </Button>
      </div>

      <div className="flex gap-6">
        <Button className="w-full text-3xl h-12" disabled={!hasProducts} onClick={handlePrint}>
          Stampa
        </Button>

        <Button className="w-full text-3xl h-12" disabled={!hasProducts} onClick={handleRePrint}>
          Re-Stampa
        </Button>
      </div>

      <Button
        className="w-full text-3xl h-12"
        onClick={handleFullPayment}
        disabled={!(order.total > 0)} //
      >
        INCASSA
      </Button>
    </>
  );
}
