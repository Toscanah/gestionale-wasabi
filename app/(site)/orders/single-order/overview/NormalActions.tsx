import { AnyOrder, HomeOrder } from "@/app/(site)/models";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { PayingAction } from "../OrderTable";
import print from "@/app/(site)/printing/print";
import OrderReceipt from "@/app/(site)/printing/receipts/OrderReceipt";
import RiderReceipt from "../../../printing/receipts/RiderReceipt";
import { OrderType, QuickPaymentOption } from "@prisma/client";
import { ProductInOrder } from "@/app/(site)/models";
import KitchenReceipt from "@/app/(site)/printing/receipts/KitchenReceipt";
import { useOrderContext } from "@/app/(site)/context/OrderContext";
import fetchRequest from "@/app/(site)/functions/api/fetchRequest";
import DialogWrapper from "@/app/(site)/components/dialog/DialogWrapper";

interface NormalActionsProps {
  quickPaymentOption: QuickPaymentOption;
  setAction: Dispatch<SetStateAction<PayingAction>>;
}

export default function NormalActions({ setAction, quickPaymentOption }: NormalActionsProps) {
  const { order, updateUnprintedProducts, updateOrder, toggleDialog } = useOrderContext();
  const [rePrintDialog, setRePrintDialog] = useState<boolean>(false);

  useEffect(() => {
    const handlePrintShortcut = async (event: KeyboardEvent) => {
      if (event.altKey && event.key === "p") {
        await handlePrint();
      }
    };

    window.addEventListener("keydown", handlePrintShortcut);
    return () => {
      window.removeEventListener("keydown", handlePrintShortcut);
    };
  }, []);

  const canSplit = (products: ProductInOrder[]) =>
    products.length > 1 ||
    (products.length === 1 && products[0].quantity > 1 && order.type !== OrderType.HOME);

  const updatePrintedFlag = async () =>
    fetchRequest<AnyOrder>("POST", "/api/orders", "updatePrintedFlag", {
      orderId: order.id,
    }).then((updatedOrder) => updateOrder({ is_receipt_printed: updatedOrder.is_receipt_printed }));

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

  const handleKitchenRePrint = async () => await print(() => KitchenReceipt<typeof order>(order));

  const handleOrderRePrint = async () =>
    await print(
      () => OrderReceipt<typeof order>(order, quickPaymentOption, order.type === OrderType.HOME),
      ...(order.type === OrderType.HOME
        ? [() => RiderReceipt(order as HomeOrder, quickPaymentOption)]
        : [])
    );

  const handleFullRePrint = async () => {
    await updatePrintedFlag();
    const content = await buildPrintContent(order, quickPaymentOption, true);
    await print(...content);
  };

  const handlePrint = async () => {
    await updatePrintedFlag();
    const content = await buildPrintContent(order, quickPaymentOption, false);
    await print(...content).then(() => toggleDialog(false));
  };

  const handleFullPayment = async () => {
    if (!order.is_receipt_printed) {
      await updatePrintedFlag();
      await print(() => OrderReceipt<typeof order>(order, quickPaymentOption, false, true));
    }

    setAction("payFull");
  };

  const hasProducts = order.products.filter((product) => product.id !== -1).length > 0;

  const RePrintButton = () => (
    <DialogWrapper
      open={rePrintDialog}
      onOpenChange={setRePrintDialog}
      title="Cosa vuoi re-stampare?"
      trigger={
        <Button className="w-full text-3xl h-12" disabled={!hasProducts}>
          Re-Stampa 重新打印
        </Button>
      }
    >
      <div className="flex gap-6">
        <Button
          className="w-full text-4xl h-24"
          onClick={() => handleKitchenRePrint().then(() => setRePrintDialog(false))}
        >
          Cucina 厨房
        </Button>
        <Button
          className="w-full text-4xl h-24"
          onClick={() => handleFullRePrint().then(() => setRePrintDialog(false))}
        >
          Tutto 所有
        </Button>
        <Button
          className="w-full text-4xl h-24"
          onClick={() => handleOrderRePrint().then(() => setRePrintDialog(false))}
        >
          Ordine 客人
        </Button>
      </div>
    </DialogWrapper>
  );

  return (
    <>
      <div className="flex gap-6">
        <Button
          className="w-full text-3xl h-12"
          onClick={() => setAction("payPart")}
          disabled={!canSplit(order.products.filter((product) => product.id !== -1))}
        >
          Dividi 分单
        </Button>

        <Button
          onClick={() => setAction("payRoman")}
          className="w-full text-3xl h-12"
          disabled={order.products.length <= 0 || order.type === OrderType.HOME} //
        >
          Romana
        </Button>
      </div>

      <RePrintButton />

      <div className="flex gap-6">
        <Button className="w-full text-3xl h-36" disabled={!hasProducts} onClick={handlePrint}>
          STAMPA 打印
        </Button>

        <Button
          className="w-full text-3xl h-36"
          onClick={handleFullPayment}
          disabled={!(order.total > 0)}
        >
          INCASSA 收钱
        </Button>
      </div>
    </>
  );
}
