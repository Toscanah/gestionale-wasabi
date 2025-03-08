import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { debounce } from "lodash";
import { useOrderContext } from "@/app/(site)/context/OrderContext";
import fetchRequest from "@/app/(site)/functions/api/fetchRequest";
import { HomeOrder, PickupOrder } from "@/app/(site)/models";
import { toastSuccess } from "@/app/(site)/functions/util/toast";
import useFocusOnClick from "@/app/(site)/hooks/useFocusOnClick";
import { OrderType } from "@prisma/client";

type PossibleOrdersType = HomeOrder | PickupOrder;

export default function Notes() {
  const { order, updateOrder } = useOrderContext();
  useFocusOnClick(["notes-field"]);

  const initialNotes =
    order.type === OrderType.HOME
      ? (order as HomeOrder).home_order?.notes ?? ""
      : (order as PickupOrder).pickup_order?.notes ?? "";

  const [additionalNotes, setAdditionalNotes] = useState<string>(initialNotes);

  const updateOrderNotes = (notes: string) => {
    fetchRequest<PossibleOrdersType>("PATCH", "/api/orders/", "updateOrderNotes", {
      orderId: order.id,
      notes,
    }).then((updatedOrder) => {
      toastSuccess("Note aggiornate correttamente", "Note aggiornate");
      let parsedOrder;

      if (order.type === OrderType.HOME) {
        parsedOrder = (updatedOrder as HomeOrder).home_order;
      } else {
        parsedOrder = (updatedOrder as PickupOrder).pickup_order;
      }

      updateOrder({
        ...(order.type == OrderType.HOME
          ? {
              home_order: { ...parsedOrder, notes: parsedOrder?.notes },
            }
          : order.type == OrderType.PICKUP
          ? {
              pickup_order: {
                ...parsedOrder,
                notes: parsedOrder?.notes,
              },
            }
          : {}),

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
      id="notes-field"
      value={additionalNotes}
      onChange={handleNotesChange}
    />
  );
}
