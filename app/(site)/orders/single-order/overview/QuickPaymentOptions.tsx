import { useWasabiContext } from "@/app/(site)/context/WasabiContext";
import { OrderType } from "@prisma/client";
import { HomeOrder } from "@/app/(site)/types/PrismaOrders";
import fetchRequest from "@/app/(site)/util/functions/fetchRequest";
import { toastSuccess } from "@/app/(site)/util/toast";
import { Dispatch, SetStateAction, useEffect } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface QuickPaymentOptionsProps {
  order: HomeOrder;
  quickPaymentOption: QuickPaymentOption;
  setQuickPaymentOption: Dispatch<SetStateAction<QuickPaymentOption>>;
}

export type QuickPaymentOption = "already_paid" | "cash" | "card" | "none";

export default function QuickPaymentOptions({
  order,
  quickPaymentOption,
  setQuickPaymentOption,
}: QuickPaymentOptionsProps) {
  const { onOrdersUpdate } = useWasabiContext();
  const quickPaymentOptions: { value: QuickPaymentOption; label: string }[] = [
    { value: "already_paid", label: "Già pagato" },
    { value: "cash", label: "Contanti" },
    { value: "card", label: "Carta" },
  ];

  const handleQuickPaymentOption = (value: QuickPaymentOption) => {
    const newNote = quickPaymentOption === value ? "none" : value;
    setQuickPaymentOption(newNote);

    fetchRequest("POST", "/api/orders/", "updateOrderQuickPaymentOption", {
      orderId: order.id,
      QuickPaymentOption:
        quickPaymentOptions.find((option) => option.value === newNote)?.label || "",
    }).then(() => {
      onOrdersUpdate(order.type as OrderType);
      toastSuccess("Note aggiornate correttamente", "Note aggiornate");
    });
  };

  useEffect(() => {
    if (order.home_order?.notes) {
      const quickPaymentOption = order.home_order.notes.toLowerCase();
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
      onValueChange={(value: QuickPaymentOption) => handleQuickPaymentOption(value ? value : "none")}
    >
      {quickPaymentOptions.map(({ value, label }) => (
        <ToggleGroupItem key={value} value={value} className="flex-1 h-12 text-xl">
          {label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
