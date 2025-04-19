import WhenSelector from "@/app/(site)/components/ui/time/WhenSelector";
import { useWasabiContext } from "@/app/(site)/context/WasabiContext";
import { OrderType } from "@prisma/client";
import { AnyOrder, HomeOrder, PickupOrder } from "@shared"
;
import fetchRequest from "@/app/(site)/lib/api/fetchRequest";
import { toastSuccess } from "@/app/(site)/lib/util/toast";
import { useState } from "react";
import { useOrderContext } from "@/app/(site)/context/OrderContext";

export default function Time() {
  const { order, updateOrder } = useOrderContext();

  const [orderTime, setOrderTime] = useState<string>(
    order.type !== OrderType.TABLE
      ? order.type == OrderType.PICKUP
        ? (order as PickupOrder).pickup_order?.when ?? ""
        : (order as HomeOrder).home_order?.when ?? ""
      : ""
  );

  const updateOrderTime = async (value: string) => {
    setOrderTime(value);

    fetchRequest<AnyOrder>("PATCH", "/api/orders/", "updateOrderTime", {
      time: value,
      orderId: order.id,
    }).then((updatedOrder) => {
      updateOrder(
        updatedOrder.type === OrderType.PICKUP
          ? {
              is_receipt_printed: false,
              pickup_order: {
                ...(updatedOrder as PickupOrder).pickup_order,
                when: (updatedOrder as PickupOrder).pickup_order?.when,
              },
            }
          : {
              is_receipt_printed: false,
              home_order: {
                ...(updatedOrder as HomeOrder).home_order,
                when: (updatedOrder as HomeOrder).home_order?.when,
              },
            }
      );
      toastSuccess("Orario dell'ordine correttamente aggiornato");
    });
  };

  return (
    <div className="flex gap-2 justify-between items-center w-full">
      <WhenSelector
        className="h-12 text-2xl uppercase w-full"
        value={orderTime == "immediate" ? "immediate" : orderTime}
        onValueChange={updateOrderTime}
      />
    </div>
  );
}
