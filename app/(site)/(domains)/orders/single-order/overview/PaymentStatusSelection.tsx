import { toastSuccess } from "@/app/(site)/lib/utils/global/toast";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useOrderContext } from "@/app/(site)/context/OrderContext";
import { PlannedPayment } from "@/prisma/generated/client/enums";
import { trpc } from "@/lib/server/client";

type PaymentStatus = {
  prepaid: boolean;
  plannedPayment: PlannedPayment;
};

interface PaymentStatusSelectionProps {
  paymentStatus: PaymentStatus;
  setPaymentStatus: Dispatch<SetStateAction<PaymentStatus>>;
}

type StatusOptions = PlannedPayment | "ALREADY_PAID";

export default function PaymentStatusSelection({
  paymentStatus,
  setPaymentStatus,
}: PaymentStatusSelectionProps) {
  const { order, updateOrder } = useOrderContext();
  const { prepaid, plannedPayment } = paymentStatus;

  const [selectedOption, setSelectedOption] = useState<StatusOptions>(
    prepaid ? "ALREADY_PAID" : plannedPayment
  );

  const paymentOptions: { value: StatusOptions; label: string }[] = [
    { value: "ALREADY_PAID", label: "GIÀ PAGATO" },
    { value: "CASH", label: "CONTANTI" },
    { value: "CARD", label: "CARTA" },
  ];

  const updatePaymentStatusMutation = trpc.orders.updatePaymentStatus.useMutation({
    onSuccess: (updatedOrder) => {
      toastSuccess("Pagamento aggiornato correttamente", "Stato pagamento aggiornato");
      updateOrder(updatedOrder);
    },
  });

  const handlePaymentStatusChange = (value: StatusOptions) => {
    setSelectedOption(value);

    const newStatus: PaymentStatus =
      value === "ALREADY_PAID"
        ? { prepaid: true, plannedPayment: PlannedPayment.UNKNOWN }
        : { prepaid: false, plannedPayment: value as PlannedPayment };

    setPaymentStatus(newStatus);

    updatePaymentStatusMutation.mutate({
      orderId: order.id,
      prepaid: newStatus.prepaid,
      plannedPayment: newStatus.plannedPayment,
    });
  };

  useEffect(() => {
    setSelectedOption(prepaid ? "ALREADY_PAID" : plannedPayment);
  }, [prepaid, plannedPayment]);

  return (
    <ToggleGroup
      variant="outline"
      className="flex w-full"
      type="single"
      value={selectedOption}
      onValueChange={(value: StatusOptions) =>
        handlePaymentStatusChange(value || PlannedPayment.UNKNOWN)
      }
    >
      {paymentOptions.map(({ value, label }) => (
        <ToggleGroupItem key={value} value={value} className="h-12 text-xl">
          {label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
