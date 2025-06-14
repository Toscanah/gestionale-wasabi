import { useEffect, useState } from "react";
import { OrderType, PaymentScope } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import OrderPayment from "@/app/(site)/payments/order/OrderPayment";
import { TableOrder } from "@shared";
import { useOrderContext } from "../../context/OrderContext";
import fetchRequest from "../../lib/api/fetchRequest";
import { getOrderTotal } from "../../lib/order-management/getOrderTotal";
import roundToCents from "../../lib/util/roundToCents";

interface RomanStyleProps {
  handleBackButton: () => void;
  handleOrderPaid: () => void;
}

export default function RomanStyle({ handleBackButton, handleOrderPaid }: RomanStyleProps) {
  const { order, updateOrder } = useOrderContext();
  const [ppl, setPpl] = useState<number>(0);
  const [currentPerson, setCurrentPerson] = useState<number>(1);
  const [amountToPay, setAmountToPay] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);

  const total = getOrderTotal({ order });

  useEffect(() => {
    if (total <= 0) return;

    fetchRequest<{ payments: { amount: number }[] }>(
      "GET",
      "/api/payments/",
      "getRomanPaymentsByOrder",
      { orderId: order.id }
    ).then(({ payments }) => {
      const ppl = (order as TableOrder).table_order?.people || 1;
      const alreadyPaid = roundToCents(payments.reduce((sum, p) => sum + p.amount, 0));
      const currentPersonIndex = payments.length + 1;

      const perPersonAmount = roundToCents(total / ppl);

      setPpl(ppl);
      setCurrentPerson(currentPersonIndex);
      setPaidAmount(alreadyPaid);
      setAmountToPay(perPersonAmount);
    });
  }, [order, total]);

  const handleOrderPaymentComplete = () => {
    const currentRoundedPayment = roundToCents(amountToPay); // always same
    const newPaidAmount = roundToCents(paidAmount + currentRoundedPayment);

    updateOrder({
      payments: [...order.payments, { amount: currentRoundedPayment, scope: PaymentScope.ROMAN }],
    });

    if (currentPerson < ppl) {
      setCurrentPerson((prev) => prev + 1);
      setPaidAmount(newPaidAmount);
    } else {
      setPaidAmount(newPaidAmount);
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
          disabled={true}
          onChange={(e) => {}}
          className="max-w-sm text-lg"
        />

        {ppl > 0 && (
          <div className="ml-auto flex gap-4 items-center">
            {currentPerson} di {ppl} persone
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
          scope={PaymentScope.ROMAN}
          stage={currentPerson === ppl ? "FINAL" : "PARTIAL"}
          onBackButton={handleBackButton}
          onOrderPaid={handleOrderPaymentComplete}
        />
      )}
    </div>
  );
}
