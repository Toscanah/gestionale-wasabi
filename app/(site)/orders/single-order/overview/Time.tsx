import WhenSelector from "@/app/(site)/components/select/WhenSelector";
import { useWasabiContext } from "@/app/(site)/context/WasabiContext";
import { OrderType } from "@prisma/client";
import { AnyOrder, HomeOrder, PickupOrder } from "@/app/(site)/types/PrismaOrders";
import fetchRequest from "@/app/(site)/util/functions/fetchRequest";
import { toastSuccess } from "@/app/(site)/util/toast";
import { useState } from "react";

export default function Time({ order }: { order: AnyOrder }) {
  const { onOrdersUpdate } = useWasabiContext();

  const [orderTime, setOrderTime] = useState<string>(
    order.type !== OrderType.TABLE
      ? order.type == OrderType.PICK_UP
        ? (order as PickupOrder).pickup_order?.when ?? ""
        : (order as HomeOrder).home_order?.when ?? ""
      : ""
  );

  console.log(orderTime)

  const updateOrderTime = (value: string) => {
    setOrderTime(value);
    fetchRequest("POST", "/api/orders/", "updateOrderTime", { time: value, orderId: order.id });
    onOrdersUpdate(order.type as OrderType);
    toastSuccess("Orario dell'ordine correttamente aggiornato");
  };

  return (
    <div className="flex gap-2 justify-between items-center">
      {/* <span className="text-xl">Orario</span> */}

      <WhenSelector
        className="h-12 text-2xl uppercase"
        value={orderTime == "immediate" ? "immediate" : orderTime}
        onValueChange={updateOrderTime}
      />
    </div>
  );
}
