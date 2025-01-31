import OrderPayment from "@/app/(site)/payments/order/OrderPayment";
import { AnyOrder, TableOrder } from "@/app/(site)/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrderType } from "@prisma/client";
import { useEffect, useState } from "react";
import { useOrderContext } from "../../context/OrderContext";
import fetchRequest from "../../functions/api/fetchRequest";
import roundToTwo from "../../functions/formatting-parsing/roundToTwo";

interface RomanStyleProps {
  handleBackButton: () => void;
  handleOrderPaid: () => void;
}

export default function RomanStyle({ handleBackButton, handleOrderPaid }: RomanStyleProps) {
  const { order } = useOrderContext();
  const [ppl, setPpl] = useState<number>(0);
  const [currentPerson, setCurrentPerson] = useState<number>(1);

  useEffect(() => {
    const ppl = order.type == OrderType.TABLE ? (order as TableOrder).table_order?.people ?? 0 : 0;

    setPpl(ppl);

    fetchRequest<number>("GET", "/api/payments/", "getRomanPaymentsByOrder", {
      orderId: order.id,
      amount: roundToTwo(order.total / ppl),
    }).then((count) => setCurrentPerson((prev) => prev + count));
  }, []);

  const handleOrderPaymentComplete = () => {
    if (currentPerson < ppl) {
      setCurrentPerson((prev) => prev + 1);
    } else {
      handleOrderPaid();
    }
  };

  // TODO: rimane sempre un possibile, ma improbabile problema:
  /**
   * quando ho già eseguito un pagamento con ppl = 4 per esempio, e torno in dietro, poi torno dentro
   * e metto ppl = 1, mi softblocco perchè ora è disabled il campo del ppl
   */

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
            <Button onClick={handleOrderPaymentComplete} disabled={currentPerson == ppl}>
              Salta questo pagamento
            </Button>
          </div>
        )}
      </div>

      {ppl !== 0 && currentPerson <= ppl && (
        <OrderPayment
          key={currentPerson}
          partialOrder={{
            ...order,
            total: order.total / ppl,
            products: currentPerson === ppl ? order.products : [],
          }}
          type={currentPerson === ppl ? "full" : "partial"}
          handleBackButton={handleBackButton}
          onOrderPaid={handleOrderPaymentComplete}
        />
      )}
    </div>
  );
}
