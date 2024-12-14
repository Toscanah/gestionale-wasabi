import OrderPayment from "@/app/(site)/payments/order/OrderPayment";
import { AnyOrder, TableOrder } from "@/app/(site)/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrderType } from "@prisma/client";
import { useEffect, useState } from "react";
import { useOrderContext } from "../../context/OrderContext";

interface RomanStyleProps {
  handleBackButton: () => void;
  handleOrderPaid: () => void;
}

export default function RomanStyle({ handleBackButton, handleOrderPaid }: RomanStyleProps) {
  const { order } = useOrderContext();
  const [ppl, setPpl] = useState<number>(0);
  const [currentPerson, setCurrentPerson] = useState<number>(1);

  useEffect(
    () =>
      setPpl(order.type == OrderType.TABLE ? (order as TableOrder).table_order?.people ?? 0 : 0),
    []
  );

  const handleOrderPaymentComplete = () => {
    if (currentPerson < ppl) {
      setCurrentPerson((prev) => prev + 1);
    } else {
      handleOrderPaid();
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {/* <Button onClick={() => handleBackButton()} className="w-full">
        Torna all'ordine
      </Button> */}

      <div className="flex items-center gap-4 w-full">
        <Label className="text-2xl">Quante persone?</Label>
        <Input
          disabled={currentPerson > 1}
          type="number"
          value={ppl}
          onChange={(e) => setPpl(e.target.valueAsNumber)}
          className="max-w-sm text-lg"
        />

        {ppl !== 0 && (
          <div className="ml-auto flex gap-4 items-center">
            {currentPerson} di {ppl} persone
            <Button onClick={handleOrderPaymentComplete}>Salta questo pagamento</Button>
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
          onOrderPaid={handleOrderPaymentComplete}
        />
      )}
    </div>
  );
}
