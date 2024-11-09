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
import { Cut } from "react-thermal-printer";

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
            (order.products.length === 1 && order.products[0].quantity <= 1) ||
            order.type == OrderType.TO_HOME
          }
        >
          Dividi
        </Button>
        <Button
          onClick={() => setAction("payRoman")}
          className="w-full text-3xl h-12"
          disabled={order.products.length <= 0 || order.type == OrderType.TO_HOME}
        >
          Romana
        </Button>
      </div>

      <Button
        className="w-full text-3xl h-12"
        disabled={order.products.length === 0}
        onClick={async () => {
          const content = [
            () =>
              OrderReceipt<typeof order>(
                order,
                quickPaymentOption,
                order.type == OrderType.TO_HOME
              ),
          ];

          // if (order.type == OrderType.TO_HOME) {
          //   content.push(() => RiderReceipt(order as HomeOrder, quickPaymentOption));
          // }

          await print(...content);
        }}
      >
        Stampa
      </Button>

      <Button
        className="w-full text-3xl h-12"
        onClick={async () => {
          setAction("payFull");

          if (order.type !== OrderType.TO_HOME) {
            await print(() => OrderReceipt<typeof order>(order, quickPaymentOption, false));
          }
        }}
        disabled={applyDiscount(order.total, order.discount) == 0}
      >
        {order.type == OrderType.TO_HOME ? "INCASSA" : "PAGA"}
      </Button>
    </>
  );
}
