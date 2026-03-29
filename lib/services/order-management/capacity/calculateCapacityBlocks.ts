import { OrderType } from "@/prisma/generated/client/enums";
import { DEFAULT_WHEN_VALUE, HomeOrder, PickupOrder, TableOrder } from "@/lib/shared";
import {
  BaseCapacityBlock,
  CapacityBlock,
  generateCapacityBlocks,
  getProductionTime,
  getTimeSlot,
} from "./index";

/**
 * Pure function to calculate capacity blocks from orders
 * No hooks, no queries - just computation
 */
export function calculateCapacityBlocks(
  tableOrders: TableOrder[],
  homeOrders: HomeOrder[],
  pickupOrders: PickupOrder[],
  prepTimeMinutes: number,
  deliveryTimeMinutes: number,
): CapacityBlock[] {
  const generated = generateCapacityBlocks();

  const initBlocks = (arr: BaseCapacityBlock[]) =>
    arr.map((block) => ({
      ...block,
      tableCount: 0,
      homeCount: 0,
      pickupCount: 0,
      total: 0,
      pickupImmediateCount: 0,
      pickupScheduledCount: 0,
      homeImmediateCount: 0,
      homeScheduledCount: 0,
    }));

  const lunch = initBlocks(generated.lunch);
  const dinner = initBlocks(generated.dinner);
  const allBlocks = [...lunch, ...dinner];

  // Count table orders
  tableOrders.forEach((order) => {
    const prodTime = getProductionTime(
      order.created_at,
      OrderType.TABLE,
      prepTimeMinutes,
      deliveryTimeMinutes,
      undefined,
      true,
    );
    const slot = getTimeSlot(prodTime, prepTimeMinutes);
    const block = allBlocks.find((b) => b.hour === slot.hour && b.minute === slot.minute);
    if (block) {
      block.tableCount++;
      block.total++;
    }
  });

  // Count home orders
  homeOrders.forEach((order) => {
    const whenStr = order.home_order?.when;
    const isImmediate = !whenStr || whenStr === DEFAULT_WHEN_VALUE;
    const prodTime = getProductionTime(
      order.created_at,
      OrderType.HOME,
      prepTimeMinutes,
      deliveryTimeMinutes,
      whenStr,
      isImmediate,
    );

    const slot = getTimeSlot(prodTime, prepTimeMinutes);
    const block = allBlocks.find((b) => b.hour === slot.hour && b.minute === slot.minute);
    if (block) {
      block.homeCount++;
      block.total++;
      if (isImmediate) block.homeImmediateCount++;
      else block.homeScheduledCount++;
    }
  });

  // Count pickup orders
  pickupOrders.forEach((order) => {
    const whenStr = order.pickup_order?.when;
    const isImmediate = !whenStr || whenStr === DEFAULT_WHEN_VALUE;
    const prodTime = getProductionTime(
      order.created_at,
      OrderType.PICKUP,
      prepTimeMinutes,
      deliveryTimeMinutes,
      whenStr,
      isImmediate,
    );

    const slot = getTimeSlot(prodTime, prepTimeMinutes);
    const block = allBlocks.find((b) => b.hour === slot.hour && b.minute === slot.minute);
    if (block) {
      block.pickupCount++;
      block.total++;
      if (isImmediate) block.pickupImmediateCount++;
      else block.pickupScheduledCount++;
    }
  });

  return allBlocks;
}
