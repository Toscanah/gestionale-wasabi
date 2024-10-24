import { useWasabiContext } from "@/app/(site)/context/WasabiContext";
import { OrderType } from "@/app/(site)/types/OrderType";
import { HomeOrder } from "@/app/(site)/types/PrismaOrders";
import fetchRequest from "@/app/(site)/util/functions/fetchRequest";
import { toastSuccess } from "@/app/(site)/util/toast";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type Notes = "already_paid" | "cash" | "card" | "";

export default function QuickNotes({
  order,
  note,
  setNote,
}: {
  order: HomeOrder;
  note: Notes;
  setNote: Dispatch<SetStateAction<Notes>>;
}) {
  const { onOrdersUpdate } = useWasabiContext();
  const noteOptions: { value: Notes; label: string }[] = [
    { value: "already_paid", label: "Già pagato" },
    { value: "cash", label: "Contanti" },
    { value: "card", label: "Carta" },
  ];

  const handleNoteChange = (value: Notes) => {
    const newNote = note === value ? "" : value;
    setNote(newNote);

    fetchRequest("POST", "/api/orders/", "updateOrderNotes", {
      orderId: order.id,
      notes: noteOptions.find((option) => option.value === newNote)?.label || "",
    }).then(() => {
      onOrdersUpdate(order.type as OrderType);
      toastSuccess("Note aggiornate correttamente", "Note aggiornate");
    });
  };

  useEffect(() => {
    if (order.home_order?.notes) {
      const notes = order.home_order.notes.toLowerCase();
      const matchingOption = noteOptions.find((option) =>
        notes.includes(option.label.toLowerCase())
      );

      if (matchingOption) {
        setNote(matchingOption.value);
      }
    }
  }, []);

  return (
    <ToggleGroup
      variant="outline"
      className="flex w-full gap-6"
      type="single"
      value={note}
      onValueChange={(value: Notes) => handleNoteChange(value ? value : "")}
    >
      {noteOptions.map(({ value, label }) => (
        <ToggleGroupItem key={value} value={value} className="flex-1 h-12 text-xl">
          {label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
