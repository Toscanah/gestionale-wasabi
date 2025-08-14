import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { debounce } from "lodash";
import { useOrderContext } from "@/app/(site)/context/OrderContext";
import fetchRequest from "@/app/(site)/lib/api/fetchRequest";
import { HomeOrder, PickupOrder } from "@/app/(site)/lib/shared";
import { toastSuccess } from "@/app/(site)/lib/utils/toast";
import useFocusOnClick from "@/app/(site)/hooks/focus/useFocusOnClick";
import { OrderType } from "@prisma/client";

type PossibleOrdersType = HomeOrder | PickupOrder;

export default function Notes() {
  const { order, updateOrder } = useOrderContext();
  useFocusOnClick(["notes-field"]);

  const initialNotes =
    order.type === OrderType.HOME
      ? (order as HomeOrder).home_order?.customer.order_notes ?? ""
      : (order as PickupOrder).pickup_order?.customer?.order_notes ?? "";

  const [additionalNotes, setAdditionalNotes] = useState<string>(initialNotes);

  const updateCustomerOrderNotes = (notes: string) =>
    fetchRequest<PossibleOrdersType>("PATCH", "/api/orders/", "updateCustomerOrderNotes", {
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
              home_order: {
                ...parsedOrder,
                customer: {
                  ...parsedOrder?.customer,
                  order_notes: parsedOrder?.customer?.order_notes ?? "",
                },
              },
            }
          : order.type == OrderType.PICKUP
          ? {
              pickup_order: {
                ...parsedOrder,
                customer: {
                  ...parsedOrder?.customer,
                  order_notes: parsedOrder?.customer?.order_notes ?? "",
                },
              },
            }
          : {}),

        is_receipt_printed: false,
      });
    });

  const debouncedUpdateNotes = useCallback(
    debounce((notes: string) => updateCustomerOrderNotes(notes), 1500),
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
