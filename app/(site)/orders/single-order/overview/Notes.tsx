import { Dispatch, SetStateAction, useCallback, useState } from "react";
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

  const [additionalNotes, setAdditionalNotes] = useState<string>(
    (order as HomeOrder).home_order?.notes ?? ""
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
    <Input
      className="h-12 text-xl w-full"
      placeholder="Note dell'ordine"
      value={additionalNotes}
      onChange={handleNotesChange}
    />
  );
}
