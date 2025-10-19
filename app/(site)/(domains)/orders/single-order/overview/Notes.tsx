import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { debounce } from "lodash";
import { useOrderContext } from "@/app/(site)/context/OrderContext";
import { toastSuccess } from "@/app/(site)/lib/utils/global/toast";
import useFocusOnClick from "@/app/(site)/hooks/focus/useFocusOnClick";
import { OrderType } from "@prisma/client";
import { HomeOrder, OrderGuards, PickupOrder } from "@/app/(site)/lib/shared";
import { trpc } from "@/lib/server/client";

export default function Notes() {
  const { order, updateOrder } = useOrderContext();
  useFocusOnClick(["notes-field"]);

  const initialNotes = OrderGuards.isHome(order)
    ? (order.home_order?.customer.order_notes ?? "")
    : OrderGuards.isPickup(order)
      ? (order.pickup_order?.customer?.order_notes ?? "")
      : "";

  const [additionalNotes, setAdditionalNotes] = useState<string>(initialNotes);

  const updateNotesMutation = trpc.customers.updateOrderNotes.useMutation({
    onSuccess: (updatedOrder) => {
      toastSuccess("Note aggiornate correttamente", "Note aggiornate");

      if (OrderGuards.isTable(updatedOrder)) {
        return;
      }

      if (OrderGuards.isHome(updatedOrder)) {
        const parsedOrder = updatedOrder.home_order;

        updateOrder({
          home_order: {
            ...parsedOrder,
            customer: parsedOrder?.customer
              ? {
                  ...parsedOrder.customer,
                  order_notes: parsedOrder.customer.order_notes ?? "",
                }
              : undefined,
          },
          is_receipt_printed: false,
        });
      } else if (OrderGuards.isPickup(updatedOrder)) {
        const parsedOrder = updatedOrder.pickup_order;

        updateOrder({
          pickup_order: {
            ...parsedOrder,
            customer: parsedOrder?.customer
              ? {
                  ...parsedOrder.customer,
                  order_notes: parsedOrder.customer.order_notes ?? "",
                }
              : undefined,
          },
          is_receipt_printed: false,
        });
      }
    },
  });

  const debouncedUpdateNotes = useCallback(
    debounce((notes: string) => {
      updateNotesMutation.mutate({ orderId: order.id, notes });
    }, 1500),
    [order.id]
  );

  const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const notes = event.target.value;
    setAdditionalNotes(notes);
    debouncedUpdateNotes(notes);
  };

  return (
    <Input
      className="h-12 !text-xl w-full"
      placeholder="Note dell'ordine"
      id="notes-field"
      value={additionalNotes}
      onChange={handleNotesChange}
    />
  );
}
