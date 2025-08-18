import { useCallback, useEffect, useState } from "react";
import { OrderType, PaymentScope } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import OrderPayment from "@/app/(site)/(domains)/payments/order/OrderPayment";
import { TableOrder } from "@/app/(site)/lib/shared";
import { useOrderContext } from "../../../context/OrderContext";
import fetchRequest from "../../../lib/api/fetchRequest";
import { getOrderTotal } from "../../../lib/services/order-management/getOrderTotal";
import roundToCents from "../../../lib/utils/global/number/roundToCents";
import { debounce } from "lodash";
import { toastSuccess } from "../../../lib/utils/global/toast";
import useFocusOnClick from "../../../hooks/focus/useFocusOnClick";

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

  const total = getOrderTotal({ order, applyDiscount: true });

  useEffect(() => {
    if (total <= 0) return;

    fetchRequest<{ payments: { amount: number; payment_group_code: string | null }[] }>(
      "GET",
      "/api/payments/",
      "getRomanPaymentsByOrder",
      { orderId: order.id }
    ).then(({ payments }) => {
      const ppl = (order as TableOrder).table_order?.people || 1;
      const perPersonAmount = roundToCents(total / ppl);

      const groupMap = new Map<string, number>();

      for (const payment of payments) {
        if (!payment.payment_group_code) continue;

        const prev = groupMap.get(payment.payment_group_code) || 0;
        groupMap.set(payment.payment_group_code, roundToCents(prev + payment.amount));
      }

      // Count how many "people" (groups) have fully paid
      const fullyPaidPeople = Array.from(groupMap.values()).filter(
        (paid) => paid >= perPersonAmount
      ).length;

      const alreadyPaid = roundToCents(payments.reduce((sum, p) => sum + p.amount, 0));

      const currentPersonIndex = fullyPaidPeople + 1;

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

  const debouncedHandlePplChange = useCallback(
    debounce((newPpl: number) => {
      fetchRequest<TableOrder>("PATCH", "/api/orders", "updateOrderTablePpl", {
        people: newPpl,
        orderId: order.id,
      }).then(() => {
        updateOrder({ table_order: { ...(order as TableOrder).table_order, people: newPpl } });
        toastSuccess("Numero di persone aggiornato con successo");
      });
    }, 1000),
    []
  );

  const handlePplUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPpl = e.target.valueAsNumber;
    if (isNaN(newPpl) || newPpl < 0) {
      return;
    }
    setPpl(newPpl);
    debouncedHandlePplChange(newPpl);
  };

  useFocusOnClick(["people"]);

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="flex items-center gap-4 w-full">
        <Label className="text-2xl">Quante persone?</Label>
        <Input
          id="people"
          type="number"
          value={ppl}
          disabled={
            order.payments.some((payment) => payment.scope === PaymentScope.ROMAN) ||
            currentPerson > 1
          }
          onChange={handlePplUpdate}
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
