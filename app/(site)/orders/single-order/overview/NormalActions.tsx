import { AnyOrder } from "@/app/(site)/types/PrismaOrders";
import applyDiscount from "@/app/(site)/util/functions/applyDiscount";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";
import { PayingAction } from "../OrderTable";
import print from "@/app/(site)/printing/print";
import OrderReceipt from "@/app/(site)/printing/receipts/OrderReceipt";
import { QuickPaymentOption } from "./QuickPaymentOptions";
import RiderReceipt from "../../../printing/receipts/RiderReceipt";
import { OrderType } from "@prisma/client";

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
  return (
    <>
      <div className="flex gap-6">
        <Button
          className="w-full text-3xl h-12"
          onClick={() => setAction("payPart")}
          disabled={
            order.products.length === 0 ||
            (order.products.length === 1 && order.products[0].quantity <= 1)
          }
        >
          Dividi
        </Button>
        <Button
          onClick={() => setAction("payRoman")}
          className="w-full text-3xl h-12"
          disabled={order.products.length <= 0}
        >
          Romana
        </Button>
      </div>

      <Button
        className="w-full text-3xl h-12"
        disabled={order.products.length === 0}
        onClick={async () => {
          const content = [() => OrderReceipt(order, quickPaymentOption)];

          if (order.type !== OrderType.TABLE)
            content.push(() => RiderReceipt(order, quickPaymentOption));

          await print(...content);
        }}
      >
        Stampa
      </Button>

      <Button
        className="w-full text-3xl h-12"
        onClick={() => setAction("payFull")}
        disabled={applyDiscount(order.total, order.discount) == 0}
      >
        PAGA
      </Button>
    </>
  );
}
