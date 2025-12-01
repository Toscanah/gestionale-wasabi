import { useCallback, useEffect, useState } from "react";
import { OrderType, PaymentScope } from "@/prisma/generated/client/enums";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import OrderPayment from "@/app/(site)/(domains)/payments/order/OrderPayment";
import { TableOrder } from "@/app/(site)/lib/shared";
import { useOrderContext } from "../../../context/OrderContext";
import { getOrderTotal } from "../../../lib/services/order-management/getOrderTotal";
import roundToCents from "../../../lib/utils/global/number/roundToCents";
import { debounce } from "lodash";
import { toastSuccess } from "../../../lib/utils/global/toast";
import useFocusOnClick from "../../../hooks/focus/useFocusOnClick";
import { trpc } from "@/lib/server/client";
import { Payment } from "@/prisma/generated/schemas";

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

  const total = getOrderTotal({ order, applyDiscounts: true });

  const utils = trpc.useUtils();

  const { data: romanPaymentsData } = trpc.payments.getRomanPaymentsByOrder.useQuery(
    { orderId: order.id },
    { enabled: total > 0 }
  );

  const updateTablePplMutation = trpc.orders.updateTablePpl.useMutation({
    onSuccess: (updatedOrder) => {
      updateOrder({
        table_order: {
          ...(order as TableOrder).table_order,
          people: updatedOrder.table_order?.people ?? 0,
        },
      });
      toastSuccess("Numero di persone aggiornato con successo");
    },
  });

  useEffect(() => {
    if (!romanPaymentsData) return;

    const payments = romanPaymentsData.romanPayments;
    const ppl = (order as TableOrder).table_order?.people || 1;

    // Total already paid (sum of all Roman payments)
    const totalPaid = roundToCents(payments.reduce((sum, p) => sum + p.amount, 0));

    // Aggregate payments by group code (so one person paying with multiple methods counts once)
    const groupMap = new Map<string, number>();
    for (const payment of payments) {
      if (!payment.payment_group_code) continue;
      const prev = groupMap.get(payment.payment_group_code) || 0;
      groupMap.set(payment.payment_group_code, roundToCents(prev + payment.amount));
    }

    // Count how many distinct groups are "locked" (paid at least their fair share)
    // Fair share is calculated dynamically every time
    const lockedPeople = Array.from(groupMap.values()).filter((paid) => paid > 0).length;

    // Remaining people = total people – fully paid groups
    const remainingPeople = Math.max(1, ppl - lockedPeople);

    // Each remaining person owes: (total – paid) / remainingPeople
    const perRemainingAmount = roundToCents((total - totalPaid) / remainingPeople);

    setPpl(ppl);
    setCurrentPerson(lockedPeople + 1);
    setPaidAmount(totalPaid);
    setAmountToPay(perRemainingAmount);
  }, [romanPaymentsData, order, total]);

  const handleOrderPaymentComplete = (updatedPayments: Payment[]) => {
    const currentRoundedPayment = roundToCents(amountToPay);
    const newPaidAmount = roundToCents(paidAmount + currentRoundedPayment);

    utils.payments.getRomanPaymentsByOrder.setData({ orderId: order.id }, (prev) => ({
      romanPayments: updatedPayments
        .filter((p) => p.scope === PaymentScope.ROMAN)
        .map((p) => ({
          amount: p.amount,
          id: p.id,
          payment_group_code: p.payment_group_code ?? null,
        })),
    }));

    updateOrder({
      payments: updatedPayments,
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
      updateTablePplMutation.mutate({ people: newPpl, orderId: order.id });
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
