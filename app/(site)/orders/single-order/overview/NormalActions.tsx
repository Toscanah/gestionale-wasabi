import { AnyOrder } from "@/app/(site)/types/PrismaOrders";
import applyDiscount from "@/app/(site)/util/functions/applyDiscount";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";
import { Actions } from "../OrderTable";
import print from "@/app/(site)/printing/print";
import orderRec from "@/app/(site)/printing/receipts/order";
import { Notes } from "./QuickNotes";
import rider from "../../../printing/receipts/rider";
import kitchen from "@/app/(site)/printing/receipts/kitchen";

export default function NormalActions({
  order,
  setAction,
  note,
}: {
  note: Notes;
  order: AnyOrder;
  setAction: Dispatch<SetStateAction<Actions>>;
}) {
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
        onClick={async () => {
          await print(
            () => orderRec(order, note),
            () => rider(order, note)
          );
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
