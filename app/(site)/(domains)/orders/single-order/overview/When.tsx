import WhenSelector from "@/app/(site)/components/ui/filters/select/WhenSelector";
import { OrderType } from "@prisma/client";
import { HomeOrder, OrderGuards, PickupOrder } from "@/app/(site)/lib/shared";
import { toastSuccess } from "@/app/(site)/lib/utils/global/toast";
import { useState } from "react";
import { useOrderContext } from "@/app/(site)/context/OrderContext";
import { trpc } from "@/lib/server/client";

export default function When() {
  const { order, updateOrder } = useOrderContext();

  const [orderTime, setOrderTime] = useState<string>(
    OrderGuards.isPickup(order)
      ? (order.pickup_order?.when ?? "")
      : OrderGuards.isHome(order)
        ? (order.home_order?.when ?? "")
        : ""
  );

  const updateOrderTimeMutation = trpc.orders.updateTime.useMutation({
    onSuccess: (updatedOrder) => {
      console.log("Updated Order:", updatedOrder);
      updateOrder(updatedOrder);
      toastSuccess("Orario dell'ordine correttamente aggiornato");
    },
  });

  const handleTimeChange = (value: string) => {
    setOrderTime(value);
    updateOrderTimeMutation.mutate({ orderId: order.id, time: value });
  };

  return (
    <WhenSelector
      className="h-12 text-2xl uppercase flex-1"
      value={orderTime}
      onValueChange={handleTimeChange}
    />
  );
}
