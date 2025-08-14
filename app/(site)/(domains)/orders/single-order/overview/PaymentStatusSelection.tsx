import { HomeOrder } from "@/app/(site)/lib/shared";
import fetchRequest from "@/app/(site)/lib/api/fetchRequest";
import { toastSuccess } from "@/app/(site)/lib/utils/toast";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useOrderContext } from "@/app/(site)/context/OrderContext";
import { PlannedPayment } from "@prisma/client";
import { PaymentStatus } from "./OrderOverview";

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

  // Decide initial toggle option
  const [selectedOption, setSelectedOption] = useState<StatusOptions>(
    prepaid ? "ALREADY_PAID" : plannedPayment
  );

  const paymentOptions: { value: StatusOptions; label: string }[] = [
    { value: "ALREADY_PAID", label: "Già pagato" },
    { value: "CASH", label: "Contanti" },
    { value: "CARD", label: "Carta" },
  ];

  const handlePaymentStatusChange = (value: StatusOptions) => {
    setSelectedOption(value);

    // Build new state from selected option
    const newStatus: PaymentStatus =
      value === "ALREADY_PAID"
        ? { prepaid: true, plannedPayment: PlannedPayment.UNKNOWN }
        : { prepaid: false, plannedPayment: value as PlannedPayment };

    setPaymentStatus(newStatus);

    // Update DB
    fetchRequest<HomeOrder>("PATCH", "/api/orders/", "updateOrderPaymentStatus", {
      orderId: order.id,
      prepaid: newStatus.prepaid,
      plannedPayment: newStatus.plannedPayment,
    }).then((updatedOrder) => {
      toastSuccess("Pagamento aggiornato correttamente", "Stato pagamento aggiornato");
      updateOrder(updatedOrder);
    });
  };

  useEffect(() => {
    setSelectedOption(prepaid ? "ALREADY_PAID" : plannedPayment);
  }, [prepaid, plannedPayment]);

  return (
    <div className="space-y-2">
      <ToggleGroup
        variant="outline"
        className="flex w-full gap-6"
        type="single"
        value={selectedOption}
        onValueChange={(value: StatusOptions) =>
          handlePaymentStatusChange(value || PlannedPayment.UNKNOWN)
        }
      >
        {paymentOptions.map(({ value, label }) => (
          <ToggleGroupItem key={value} value={value} className="flex-1 h-12 text-xl">
            {label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
