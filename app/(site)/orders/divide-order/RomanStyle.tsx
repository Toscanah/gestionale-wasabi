import { useEffect, useState } from "react";
import { OrderType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import OrderPayment from "@/app/(site)/payments/order/OrderPayment";
import { AnyOrder, TableOrder } from "@shared";
import { useOrderContext } from "../../context/OrderContext";
import fetchRequest from "../../lib/api/fetchRequest";
import { getOrderTotal } from "../../lib/order-management/getOrderTotal";

// ✅ Rounding that matches new requirement: round-half-up to 2 decimals
function roundToCents(n: number): number {
  const floored = Math.floor(n * 100); // e.g., 162.124 → 16212
  const fraction = n * 100 - floored; // e.g., 0.4 or 0.5

  if (fraction >= 0.5) {
    return (floored + 1) / 100;
  } else {
    return floored / 100;
  }
}

interface RomanStyleProps {
  handleBackButton: () => void;
  handleOrderPaid: () => void;
}

function computeRomanSplit(total: number, ppl: number): number[] {
  const rawSplit = total / ppl;
  return Array.from({ length: ppl }, () => roundToCents(rawSplit));
}

export default function RomanStyle({ handleBackButton, handleOrderPaid }: RomanStyleProps) {
  const { order } = useOrderContext();
  const [ppl, setPpl] = useState<number>(0);
  const [currentPerson, setCurrentPerson] = useState<number>(1);
  const [amountToPay, setAmountToPay] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);

  const total = getOrderTotal({ order });

  useEffect(() => {
    const initialPpl =
      order.type === OrderType.TABLE ? (order as TableOrder).table_order?.people ?? 0 : 0;

    if (initialPpl <= 0) return;

    setPpl(initialPpl);

    const amounts = computeRomanSplit(total, initialPpl);

    fetchRequest<number>("GET", "/api/payments/", "getRomanPaymentsByOrder", {
      orderId: order.id,
      amount: amounts[0],
    }).then((count) => {
      const alreadyPaid = amounts.slice(0, count).reduce((acc, val) => acc + val, 0);
      const nextAmount = amounts[count] ?? 0;

      setCurrentPerson(count + 1);
      setPaidAmount(alreadyPaid);
      setAmountToPay(nextAmount);
    });
  }, [order, total]);

  const handlePplChange = (newPpl: number) => {
    if (newPpl <= 0 || newPpl < currentPerson) return;

    const remaining = roundToCents(total - paidAmount);
    const remainingPpl = newPpl - (currentPerson - 1);

    setPpl(newPpl);
    setAmountToPay(roundToCents(remaining / remainingPpl));
  };

  const handleOrderPaymentComplete = () => {
    const newPaidAmount = roundToCents(paidAmount + amountToPay);
    const remainingPpl = ppl - currentPerson;

    setPaidAmount(newPaidAmount);

    if (currentPerson < ppl) {
      setCurrentPerson((prev) => prev + 1);
      const remaining = roundToCents(total - newPaidAmount);
      setAmountToPay(roundToCents(remaining / remainingPpl));
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
          disabled={currentPerson > 1}
          onChange={(e) => handlePplChange(e.target.valueAsNumber)}
          className="max-w-sm text-lg"
        />

        {ppl > 0 && (
          <div className="ml-auto flex gap-4 items-center">
            {currentPerson} di {ppl} persone
            <Button onClick={handleOrderPaymentComplete} disabled={currentPerson > ppl}>
              Salta questo pagamento
            </Button>
          </div>
        )}
      </div>

      {ppl > 0 && currentPerson <= ppl && (
        <OrderPayment
          key={currentPerson}
          partialOrder={{
            ...order,
            products: currentPerson === ppl ? order.products : [],
          }}
          manualTotalAmount={amountToPay}
          type={currentPerson === ppl ? "full" : "partial"}
          onBackButton={handleBackButton}
          onOrderPaid={handleOrderPaymentComplete}
        />
      )}
    </div>
  );
}
