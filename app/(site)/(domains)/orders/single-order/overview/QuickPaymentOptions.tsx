import { HomeOrder } from "@/app/(site)/lib/shared";
import fetchRequest from "@/app/(site)/lib/api/fetchRequest";
import { toastSuccess } from "@/app/(site)/lib/utils/toast";
import { Dispatch, SetStateAction, useEffect } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useOrderContext } from "@/app/(site)/context/OrderContext";
import { QuickPaymentOption } from "@prisma/client";

interface QuickPaymentOptionsProps {
  quickPaymentOption: QuickPaymentOption;
  setQuickPaymentOption: Dispatch<SetStateAction<QuickPaymentOption>>;
}

export default function QuickPaymentOptions({
  quickPaymentOption,
  setQuickPaymentOption,
}: QuickPaymentOptionsProps) {
  const { order, updateOrder } = useOrderContext();

  const quickPaymentOptions: { value: QuickPaymentOption; label: string }[] = [
    { value: "ALREADY_PAID", label: "Già pagato" },
    { value: "CASH", label: "Contanti" },
    { value: "CARD", label: "Carta" },
  ];

  const handleQuickPaymentOption = (value: QuickPaymentOption) => {
    const newNote = quickPaymentOption === value ? QuickPaymentOption.UNKNOWN : value;
    setQuickPaymentOption(newNote);

    fetchRequest<HomeOrder>("PATCH", "/api/orders/", "updateOrderPayment", {
      orderId: order.id,
      payment:
        quickPaymentOptions.find((option) => option.value === newNote)?.value ||
        QuickPaymentOption.UNKNOWN,
    }).then((updatedOrder) => {
      toastSuccess("Note aggiornate correttamente", "Note aggiornate");
      updateOrder({
        home_order: {
          ...updatedOrder.home_order,
          payment: updatedOrder.home_order?.payment || QuickPaymentOption.UNKNOWN,
        },
        is_receipt_printed: false,
      });
    });
  };

  useEffect(() => {
    const homeOrder = order as HomeOrder;

    if (homeOrder.home_order?.notes) {
      const quickPaymentOption = homeOrder.home_order.notes.toLowerCase();
      const matchingOption = quickPaymentOptions.find((option) =>
        quickPaymentOption.includes(option.label.toLowerCase())
      );

      if (matchingOption) {
        setQuickPaymentOption(matchingOption.value);
      }
    }
  }, []);

  return (
    <div className="space-y-2">
      <ToggleGroup
        variant="outline"
        className="flex w-full gap-6"
        type="single"
        value={quickPaymentOption}
        onValueChange={(value: QuickPaymentOption) =>
          handleQuickPaymentOption(value ? value : QuickPaymentOption.UNKNOWN)
        }
      >
        {quickPaymentOptions.map(({ value, label }) => (
          <ToggleGroupItem key={value} value={value} className="flex-1 h-12 text-xl">
            {label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
