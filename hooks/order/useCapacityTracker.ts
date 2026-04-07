import { useMemo } from "react";
import { trpc } from "@/lib/api/client";
import { format } from "date-fns";
import useSettings from "@/hooks/useSettings";
import { calculateCapacityBlocks } from "@/lib/services/order-management/capacity/calculateCapacityBlocks";

const REFETCH_INTERVAL = 30000;

export default function useCapacityTracker() {
  const { settings } = useSettings();

  const { data: homeOrders = [], dataUpdatedAt: homeUpdated } = trpc.orders.getHomeOrders.useQuery(
    undefined,
    {
      refetchInterval: REFETCH_INTERVAL,
    },
  );

  const { data: tableOrders = [], dataUpdatedAt: tableUpdated } =
    trpc.orders.getTableOrders.useQuery(undefined, {
      refetchInterval: REFETCH_INTERVAL,
    });

  const { data: pickupOrders = [], dataUpdatedAt: pickupUpdated } =
    trpc.orders.getPickupOrders.useQuery(undefined, {
      refetchInterval: REFETCH_INTERVAL,
    });

  const latestUpdate = Math.max(homeUpdated || 0, tableUpdated || 0, pickupUpdated || 0);
  const lastUpdatedText =
    latestUpdate > 0 ? format(new Date(latestUpdate), "HH:mm:ss") : "in corso...";

  const { lunchCapacityBlocks, dinnerCapacityBlocks } = useMemo(() => {
    const allBlocks = calculateCapacityBlocks(
      tableOrders,
      homeOrders,
      pickupOrders,
      settings.operational.timings.standardPrepTime,
      settings.operational.timings.standardDeliveryTime,
    );

    const lunch = allBlocks.filter((b) => b.hour >= 11 && b.hour < 15);
    const dinner = allBlocks.filter((b) => b.hour >= 18);

    return { lunchCapacityBlocks: lunch, dinnerCapacityBlocks: dinner };
  }, [
    homeOrders,
    tableOrders,
    pickupOrders,
    settings.operational.timings.standardPrepTime,
    settings.operational.timings.standardDeliveryTime,
  ]);

  const lunchCount = lunchCapacityBlocks.reduce((sum, block) => sum + block.total, 0);
  const dinnerCount = dinnerCapacityBlocks.reduce((sum, block) => sum + block.total, 0);

  return {
    lunchCapacityBlocks,
    dinnerCapacityBlocks,
    lunchCount,
    dinnerCount,
    lastUpdatedText,
  };
}
