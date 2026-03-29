import { CapacityBlock } from "./index";
import { OrderType } from "@/prisma/generated/client/enums";

/**
 * Calculates which kitchen capacity block would be affected by a customer-facing time.
 * Works backwards from the delivery/pickup time to find when the kitchen needs to start.
 *
 * @param customerTime - Time shown to customer in HH:MM format (e.g., "19:30")
 * @param orderType - The type of order (PICKUP, HOME, TABLE)
 * @param prepTimeMinutes - Standard prep time in minutes
 * @param deliveryTimeMinutes - Standard delivery time in minutes
 * @returns Kitchen slot or null if invalid
 */
export function parseCustomerTimeToKitchenTime(
  customerTime: string,
  orderType: OrderType,
  prepTimeMinutes: number,
  deliveryTimeMinutes: number,
): { hour: number; minute: number } | null {
  if (!customerTime || typeof customerTime !== "string") return null;

  const match = customerTime.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;

  const hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);

  let stressMinute = minute;
  let stressHour = hour;

  // This mirrors the getTimeSlot logic: we calculate the "center of stress"
  // which is where the order's prep time is centered, and that's what determines
  // which 30min block it occupies.
  //
  // Forward direction: fireTime + prep/2 → round to slot
  // Reverse direction: customerTime - delivery - prep/2 → round to slot

  if (orderType === OrderType.HOME) {
    // Domicilio: subtract delivery and half prep time
    stressMinute -= deliveryTimeMinutes + Math.round(prepTimeMinutes / 2);
  } else if (orderType === OrderType.PICKUP) {
    // Asporto: subtract half prep time only
    stressMinute -= Math.round(prepTimeMinutes / 2);
  }

  // Tavoli: no calculation needed, immediate

  // Handle minute overflow
  if (stressMinute < 0) {
    stressHour -= Math.ceil(Math.abs(stressMinute) / 60);
    stressMinute = ((stressMinute % 60) + 60) % 60;
  }

  // Normalize hour
  stressHour = ((stressHour % 24) + 24) % 24;

  // Round to nearest 30-minute slot
  const slotMinutes = stressMinute < 30 ? 0 : 30;

  return { hour: stressHour, minute: slotMinutes };
}

/**
 * Finds the capacity block matching a kitchen time and returns capacity info
 */
export function getCapacityAtKitchenTime(
  kitchenSlot: { hour: number; minute: number } | null,
  allCapacityBlocks: CapacityBlock[],
): CapacityBlock | null {
  if (!kitchenSlot) return null;

  return (
    allCapacityBlocks.find((b) => b.hour === kitchenSlot.hour && b.minute === kitchenSlot.minute) ||
    null
  );
}

/**
 * Gets the color class for a capacity count
 */
export function getCapacityColorClass(count: number, maxCapacity: number): string {
  if (count === 0) return "text-muted-foreground bg-muted";

  const percentage = (count / maxCapacity) * 100;
  if (percentage <= 70) return "bg-green-200 text-green-600 dark:text-green-400 font-bold";
  if (percentage <= 100) return "bg-yellow-200 text-yellow-600 dark:text-yellow-400 font-bold";

  return "bg-red-200 text-red-600 dark:text-red-400 font-bold";
}

/**
 * Gets the dot color for a capacity count (for inline indicators)
 */
export function getCapacityDotColor(count: number, maxCapacity: number): string {
  const percentage = (count / maxCapacity) * 100;
  if (percentage <= 70) return "bg-green-500";
  if (percentage <= 100) return "bg-yellow-500";
  return "bg-red-500";
}
