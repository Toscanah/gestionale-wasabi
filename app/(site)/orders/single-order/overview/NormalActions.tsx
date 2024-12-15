import { AnyOrder, HomeOrder } from "@/app/(site)/models";
import applyDiscount from "@/app/(site)/util/functions/applyDiscount";
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
import { useWasabiContext } from "@/app/(site)/context/WasabiContext";
import { useOrderContext } from "@/app/(site)/context/OrderContext";
import fetchRequest from "@/app/(site)/util/functions/fetchRequest";

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

    if (!isRePrint) {
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

  const handleFullPayment = () => setAction("payFull");

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
          disabled={order.products.length <= 0 || order.type === OrderType.HOME}
        >
          Romana
        </Button>
      </div>

      <div className="flex gap-6">
        <Button
          className="w-full text-3xl h-12"
          disabled={order.products.length === 0}
          onClick={handlePrint}
        >
          Stampa
        </Button>

        <Button
          className="w-full text-3xl h-12"
          disabled={order.products.length === 0}
          onClick={handleRePrint}
        >
          Ristampa
        </Button>
      </div>

      <Button
        className="w-full text-3xl h-12"
        onClick={handleFullPayment}
        disabled={!(order.total > 0) || !order.is_receipt_printed} //
      >
        INCASSA
      </Button>
    </>
  );
}
