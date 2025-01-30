import DialogWrapper from "@/app/(site)/components/dialog/DialogWrapper";
import { Button } from "@/components/ui/button";
import QuickPaymentOptions from "./QuickPaymentOptions";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { debounce } from "lodash";
import { useOrderContext } from "@/app/(site)/context/OrderContext";
import fetchRequest from "@/app/(site)/functions/api/fetchRequest";
import { HomeOrder } from "@/app/(site)/models";
import { toastSuccess } from "@/app/(site)/functions/util/toast";
import { QuickPaymentOption } from "@prisma/client";

interface NotesProps {
  quickPaymentOption: QuickPaymentOption;
  setQuickPaymentOption: Dispatch<SetStateAction<QuickPaymentOption>>;
}

export default function Notes() {
  const { order, updateOrder } = useOrderContext();
  const possibleNotes = ["Già pagato", "Contanti", "Carta"];

  const extractOtherNotes = (notes: string | undefined) => {
    if (!notes) return "";
    return notes
      .split(",")
      .map((note) => note.trim())
      .filter((note) => !possibleNotes.includes(note))
      .join(", ");
  };

  const [additionalNotes, setAdditionalNotes] = useState<string>(
    extractOtherNotes((order as HomeOrder).home_order?.notes ?? "")
  );

  const updateOrderNotes = (notes: string) => {
    fetchRequest<HomeOrder>("POST", "/api/orders/", "updateOrderNotes", {
      orderId: order.id,
      notes,
    }).then((updatedOrder) => {
      toastSuccess("Note aggiornate correttamente", "Note aggiornate");
      updateOrder({
        home_order: { ...updatedOrder.home_order, notes: updatedOrder.home_order?.notes },
        is_receipt_printed: false,
      });
    });
  };

  const debouncedUpdateNotes = useCallback(
    debounce((notes: string) => updateOrderNotes(notes), 1500),
    []
  );

  const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const notes = event.target.value;
    setAdditionalNotes(notes);
    debouncedUpdateNotes(notes);
  };

  return (
    // <DialogWrapper
    //   autoFocus={false}
    //   tooltip="Modifica le note dell'ordine"
    //   trigger={
    //     <Button className="h-12 text-xl" variant={"outline"}>
    //       Note ordine
    //     </Button>
    //   }
    // >
    //   <QuickPaymentOptions
    //     quickPaymentOption={quickPaymentOption}
    //     setQuickPaymentOption={setQuickPaymentOption}
    //   />

    //   <div className="space-y-2">
    //     <Label className="text-xl">Note addizionali</Label>
    //     <Input className="h-12" value={additionalNotes} onChange={handleNotesChange} />
    //   </div>
    // </DialogWrapper>

    <Input className="h-12 text-xl w-full" value={additionalNotes} onChange={handleNotesChange} />
  );
}
