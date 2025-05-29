import OrderPayment from "@/app/(site)/payments/order/OrderPayment";
import { AnyOrder, TableOrder } from "@shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrderType } from "@prisma/client";
import { useEffect, useState } from "react";
import { useOrderContext } from "../../context/OrderContext";
import fetchRequest from "../../lib/api/fetchRequest";
import roundToTwo from "../../lib/formatting-parsing/roundToTwo";
import { getOrderTotal } from "../../lib/order-management/getOrderTotal";

interface RomanStyleProps {
  handleBackButton: () => void;
  handleOrderPaid: () => void;
}

export default function RomanStyle({ handleBackButton, handleOrderPaid }: RomanStyleProps) {
  const { order } = useOrderContext();
  const [ppl, setPpl] = useState<number>(0); // Total people splitting
  const [currentPerson, setCurrentPerson] = useState<number>(1); // Who's paying now
  const [amountToPay, setAmountToPay] = useState<number>(0); // Current amount each person pays
  const [paidAmount, setPaidAmount] = useState<number>(0); // Track total paid amount

  useEffect(() => {
    const initialPpl =
      order.type == OrderType.TABLE ? (order as TableOrder).table_order?.people ?? 0 : 0;
    setPpl(initialPpl);

    fetchRequest<number>("GET", "/api/payments/", "getRomanPaymentsByOrder", {
      orderId: order.id,
      amount: roundToTwo(getOrderTotal({ order }) / initialPpl),
    }).then((count) => {
      setCurrentPerson(count + 1);
      const alreadyPaid = count * roundToTwo(getOrderTotal({ order }) / initialPpl);
      setPaidAmount(alreadyPaid);
      setAmountToPay(roundToTwo((getOrderTotal({ order }) - alreadyPaid) / (initialPpl - count)));
    });
  }, []);

  const handlePplChange = (newPpl: number) => {
    if (newPpl <= 0 || newPpl < currentPerson) return; // Prevent invalid changes

    const remainingAmount = getOrderTotal({ order }) - paidAmount;
    const remainingPpl = newPpl - (currentPerson - 1); // Remaining people who haven't paid

    setPpl(newPpl);
    setAmountToPay(roundToTwo(remainingAmount / remainingPpl));
  };

  const handleOrderPaymentComplete = () => {
    const newPaidAmount = paidAmount + amountToPay;
    setPaidAmount(newPaidAmount);

    if (currentPerson < ppl) {
      setCurrentPerson((prev) => prev + 1);
      setAmountToPay(
        roundToTwo((getOrderTotal({ order }) - newPaidAmount) / (ppl - currentPerson))
      );
    } else {
      handleOrderPaid();
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="flex items-center gap-4 w-full">
        <Label className="text-2xl">Quante persone?</Label>
        <Input
          type="number"
          value={ppl}
          onChange={(e) => handlePplChange(e.target.valueAsNumber)}
          className="max-w-sm text-lg"
        />

        {ppl !== 0 && (
          <div className="ml-auto flex gap-4 items-center">
            {currentPerson} di {ppl} persone
            <Button onClick={handleOrderPaymentComplete} disabled={currentPerson > ppl}>
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
