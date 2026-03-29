import WhenSelector from "@/components/ui/shared/filters/select/WhenSelector";
import { OrderType } from "@/prisma/generated/client/enums";
import { HomeOrder, OrderGuards, PickupOrder } from "@/lib/shared";
import { toastSuccess } from "@/lib/shared/utils/global/toast";
import { useState, useMemo } from "react";
import { useOrderContext } from "@/context/OrderContext";
import { trpc } from "@/lib/api/client";
import useSettings from "@/hooks/useSettings";
import { calculateCapacityBlocks } from "@/lib/services/order-management/capacity/calculateCapacityBlocks";

export default function When() {
  const { order, updateOrder } = useOrderContext();
  const utils = trpc.useUtils();
  const { settings } = useSettings();

  const homeOrders = utils.orders.getHomeOrders.getData() ?? [];
  const pickupOrders = utils.orders.getPickupOrders.getData() ?? [];
  const tableOrders = utils.orders.getTableOrders.getData() ?? [];

  const [orderTime, setOrderTime] = useState<string>(
    OrderGuards.isPickup(order)
      ? (order.pickup_order?.when ?? "")
      : OrderGuards.isHome(order)
        ? (order.home_order?.when ?? "")
        : "",
  );

  const allCapacityBlocks = useMemo(() => {
    return calculateCapacityBlocks(
      tableOrders,
      homeOrders,
      pickupOrders,
      settings.operational.timings.standardPrepTime,
      settings.operational.timings.standardDeliveryTime,
    );
  }, [
    homeOrders,
    pickupOrders,
    tableOrders,
    settings.operational.timings.standardPrepTime,
    settings.operational.timings.standardDeliveryTime,
  ]);

  const orderTypeForCapacity = OrderGuards.isPickup(order)
    ? OrderType.PICKUP
    : OrderGuards.isHome(order)
      ? OrderType.HOME
      : undefined;

  const updateOrderTimeMutation = trpc.orders.updateTime.useMutation({
    onSuccess: (updatedOrder) => {
      updateOrder(updatedOrder);
      toastSuccess("Orario dell'ordine aggiornato correttamente");
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
      orderType={orderTypeForCapacity}
      allCapacityBlocks={allCapacityBlocks.length > 0 ? allCapacityBlocks : undefined}
    />
  );
}
