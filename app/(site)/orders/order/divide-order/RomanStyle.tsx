import OrderPayment from "@/app/(site)/payments/OrderPayment";
import { AnyOrder, TableOrder } from "@/app/(site)/types/PrismaOrders";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrderType } from "@prisma/client";
import { useEffect, useState } from "react";

export default function RomanStyle({
  order,
  handleBackButton,
  handleOrderPaid,
}: {
  order: AnyOrder;
  handleBackButton: () => void;
  handleOrderPaid: () => void;
}) {
  const [ppl, setPpl] = useState<number>(0);
  const [currentPerson, setCurrentPerson] = useState<number>(1);

  useEffect(() => {
    setPpl(order.type == OrderType.TABLE ? (order as TableOrder).table_order?.people ?? 0 : 0);
  }, []);

  const handleOrderPaymentComplete = () => {
    if (currentPerson < ppl) {
      setCurrentPerson((prev) => prev + 1);
    } else {
      console.log("qua!");
      handleOrderPaid();
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <Button onClick={() => handleBackButton()} className="w-full">
        Torna all'ordine
      </Button>

      <div className="flex items-center gap-4 w-full">
        <Label className="text-2xl">Quante persone?</Label>
        <Input
          type="number"
          value={ppl}
          onChange={(e) => {
            setPpl(e.target.valueAsNumber);
          }}
          className="max-w-sm text-lg"
        />

        {ppl !== 0 && (
          <div className="ml-auto">
            {currentPerson} di {ppl} persone
          </div>
        )}
      </div>

      {ppl !== 0 && currentPerson <= ppl && (
        <OrderPayment
          key={currentPerson}
          order={{
            ...order,
            total: order.total / ppl,
            products: currentPerson === ppl ? order.products : [],
          }}
          type="full"
          handleBackButton={handleBackButton}
          handleOrderPaid={handleOrderPaymentComplete}
        />
      )}
    </div>
  );
}
