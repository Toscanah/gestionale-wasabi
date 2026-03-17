"use client";

import WasabiDialog from "@/components/ui/shared/wasabi/WasabiDialog";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/api/client";
import { AlarmIcon } from "@phosphor-icons/react";
import { useMemo } from "react";
import Table from "@/components/table/Table";
import useTable from "@/hooks/table/useTable";
import { useWasabiContext } from "@/app/(site)/context/WasabiContext";
import { getColumns } from "./columns";
import {
  generateTimeBlocks,
  getProductionTime,
  getTimeSlot,
  TimeBlock,
} from "@/lib/services/order-management/timeline";
import { DEFAULT_WHEN_VALUE } from "@/lib/shared";

export default function OrdersTimelineGrid() {
  const { data: homeOrders = [] } = trpc.orders.getHomeOrders.useQuery();
  const { data: tableOrders = [] } = trpc.orders.getTableOrders.useQuery();
  const { data: pickupOrders = [] } = trpc.orders.getPickupOrders.useQuery();

  const { settings } = useWasabiContext();

  const timeBlocks = useMemo(() => {
    const blocks = generateTimeBlocks().map((block) => ({
      ...block,
      tableCount: 0,
      homeCount: 0,
      pickupCount: 0,
      total: 0,
    }));

    // Count table orders: production time = when order is created (immediate)
    tableOrders.forEach((order) => {
      const prodTime = getProductionTime(
        order.created_at,
        settings.operational.timings.standardPrepTime,
        settings.operational.timings.standardDeliveryTime,
        undefined,
        true,
      );
      const slot = getTimeSlot(prodTime);
      const block = blocks.find((b) => b.hour === slot.hour && b.minute === slot.minute);
      if (block) {
        block.tableCount++;
        block.total++;
      }
    });

    // Count home orders: use when field (or immediate)
    homeOrders.forEach((order) => {
      const whenStr = order.home_order?.when;
      const isImmediate = !whenStr || whenStr === DEFAULT_WHEN_VALUE;
      const prodTime = getProductionTime(
        order.created_at,
        settings.operational.timings.standardPrepTime,
        settings.operational.timings.standardDeliveryTime,
        whenStr,
        isImmediate,
      );

      const slot = getTimeSlot(prodTime);
      const block = blocks.find((b) => b.hour === slot.hour && b.minute === slot.minute);
      if (block) {
        block.homeCount++;
        block.total++;
      }
    });

    // Count pickup orders: use when field (or immediate)
    pickupOrders.forEach((order) => {
      const whenStr = order.pickup_order?.when;
      const isImmediate = !whenStr || whenStr === DEFAULT_WHEN_VALUE;
      const prodTime = getProductionTime(
        order.created_at,
        settings.operational.timings.standardPrepTime,
        settings.operational.timings.standardDeliveryTime,
        whenStr,
        isImmediate,
      );

      const slot = getTimeSlot(prodTime);
      const block = blocks.find((b) => b.hour === slot.hour && b.minute === slot.minute);
      if (block) {
        block.pickupCount++;
        block.total++;
      }
    });

    return blocks;
  }, [homeOrders, tableOrders, pickupOrders]);

  const columns = useMemo(
    () => getColumns(settings.operational.kitchen.maxCapacity),
    [settings.operational.kitchen.maxCapacity],
  );
  const table = useTable({
    data: timeBlocks,
    columns,
  });

  return (
    <WasabiDialog
      contentClassName="!w-[35vw]"
      trigger={
        <Button variant={"ghost"} size={"icon"} className="size-7">
          <AlarmIcon className="size-5" />
        </Button>
      }
      putSeparator
      title="Timeline ordini"
      putUpperBorder
    >
      <div className="space-y-4">
        {/* <div className="flex justify-end items-center">
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-600" />
              <span className="text-muted-foreground">&lt; {CAPACITY_SAFE}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-600" />
              <span className="text-muted-foreground">
                {CAPACITY_SAFE}-{CAPACITY_MAX}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600" />
              <span className="text-muted-foreground">&gt; {CAPACITY_MAX}</span>
            </div>
          </div>
        </div> */}

        <Table table={table} />
      </div>
    </WasabiDialog>
  );
}
