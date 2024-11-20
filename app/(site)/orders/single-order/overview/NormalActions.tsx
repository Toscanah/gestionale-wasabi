import { AnyOrder, HomeOrder } from "@/app/(site)/types/PrismaOrders";
import applyDiscount from "@/app/(site)/util/functions/applyDiscount";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";
import { PayingAction } from "../OrderTable";
import print from "@/app/(site)/printing/print";
import OrderReceipt from "@/app/(site)/printing/receipts/OrderReceipt";
import { QuickPaymentOption } from "./QuickPaymentOptions";
import RiderReceipt from "../../../printing/receipts/RiderReceipt";
import { OrderType } from "@prisma/client";
import fetchRequest from "@/app/(site)/util/functions/fetchRequest";
import { ProductInOrderType } from "@/app/(site)/types/ProductInOrderType";
import KitchenReceipt from "@/app/(site)/printing/receipts/KitchenReceipt";
import { useWasabiContext } from "@/app/(site)/context/WasabiContext";

interface NormalActionsProps {
  quickPaymentOption: QuickPaymentOption;
  order: AnyOrder;
  setAction: Dispatch<SetStateAction<PayingAction>>;
}

export default function NormalActions({
  order,
  setAction,
  quickPaymentOption,
}: NormalActionsProps) {
  const { onOrdersUpdate } = useWasabiContext();

  const canSplit = () =>
    order.products.length > 1 ||
    (order.products.length === 1 &&
      order.products[0].quantity > 1 &&
      order.type !== OrderType.TO_HOME);

  const canPayFull = () => applyDiscount(order.total, order.discount) > 0;

  const handlePrint = async () => {
    let content = [];

    let unprintedProducts = await fetchRequest<ProductInOrderType[]>(
      "POST",
      "/api/products/",
      "updatePrintedAmounts",
      {
        products: order.products,
      }
    );

    if (unprintedProducts.length > 0) {
      onOrdersUpdate(order.type);
      content.push(() => KitchenReceipt({ ...order, products: unprintedProducts }));
    }

    content.push(() =>
      OrderReceipt<typeof order>(order, quickPaymentOption, order.type === OrderType.TO_HOME)
    );

    if (order.type === OrderType.TO_HOME) {
      content.push(() => RiderReceipt(order as HomeOrder, quickPaymentOption));
    }

    await print(...content);
  };

  const handleFullPayment = async () => {
    setAction("payFull");

    if (order.type !== OrderType.TO_HOME) {
      await print(() => OrderReceipt<typeof order>(order, quickPaymentOption, false));
    }
  };

  return (
    <>
      <div className="flex gap-6">
        <Button
          className="w-full text-3xl h-12"
          onClick={() => setAction("payPart")}
          disabled={!canSplit()}
        >
          Dividi
        </Button>

        <Button
          onClick={() => setAction("payRoman")}
          className="w-full text-3xl h-12"
          disabled={order.products.length <= 0 || order.type === OrderType.TO_HOME}
        >
          Romana
        </Button>
      </div>

      <Button
        className="w-full text-3xl h-12"
        disabled={order.products.length === 0}
        onClick={handlePrint}
      >
        Stampa
      </Button>

      <Button className="w-full text-3xl h-12" onClick={handleFullPayment} disabled={!canPayFull()}>
        {order.type === OrderType.TO_HOME ? "INCASSA" : "PAGA"}
      </Button>
    </>
  );
}
