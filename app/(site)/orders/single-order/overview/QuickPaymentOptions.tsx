import { useWasabiContext } from "@/app/(site)/context/WasabiContext";
import { OrderType } from "@prisma/client";
import { AnyOrder, HomeOrder } from "@/app/(site)/models";
import fetchRequest from "@/app/(site)/util/functions/fetchRequest";
import { toastSuccess } from "@/app/(site)/util/toast";
import { Dispatch, SetStateAction, useEffect } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useOrderContext } from "@/app/(site)/context/OrderContext";

interface QuickPaymentOptionsProps {
  quickPaymentOption: QuickPaymentOption;
  setQuickPaymentOption: Dispatch<SetStateAction<QuickPaymentOption>>;
}

export type QuickPaymentOption = "already_paid" | "cash" | "card" | "none";

export default function QuickPaymentOptions({
  quickPaymentOption,
  setQuickPaymentOption,
}: QuickPaymentOptionsProps) {
  const { order, updateOrder } = useOrderContext();
  const { updateGlobalState } = useWasabiContext();

  const quickPaymentOptions: { value: QuickPaymentOption; label: string }[] = [
    { value: "already_paid", label: "Già pagato" },
    { value: "cash", label: "Contanti" },
    { value: "card", label: "Carta" },
  ];

  const handleQuickPaymentOption = (value: QuickPaymentOption) => {
    const newNote = quickPaymentOption === value ? "none" : value;
    setQuickPaymentOption(newNote);

    fetchRequest<HomeOrder>("POST", "/api/orders/", "updateOrderNotes", {
      orderId: order.id,
      quickPaymentOption:
        quickPaymentOptions.find((option) => option.value === newNote)?.label || "",
    }).then((updatedOrder) => {
      toastSuccess("Note aggiornate correttamente", "Note aggiornate");
      updateOrder({
        home_order: { notes: updatedOrder.home_order?.notes },
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
    <ToggleGroup
      variant="outline"
      className="flex w-full gap-6"
      type="single"
      value={quickPaymentOption}
      onValueChange={(value: QuickPaymentOption) =>
        handleQuickPaymentOption(value ? value : "none")
      }
    >
      {quickPaymentOptions.map(({ value, label }) => (
        <ToggleGroupItem key={value} value={value} className="flex-1 h-12 text-xl">
          {label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
