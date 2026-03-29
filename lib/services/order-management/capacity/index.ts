import { DEFAULT_WHEN_VALUE } from "@/lib/shared";
import { OrderType } from "@/prisma/generated/client/enums";

export type CapacityBlock = {
  label: string;
  hour: number;
  minute: number;
  tableCount: number;
  homeCount: number;
  pickupCount: number;
  total: number;
  pickupImmediateCount: number;
  pickupScheduledCount: number;
  homeImmediateCount: number;
  homeScheduledCount: number;
};

export function parseWhenToSlot(when?: string): { hour: number; minute: number } | null {
  if (!when || when === DEFAULT_WHEN_VALUE) return null;
  if (typeof when !== "string") return null;

  const match = when.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;

  const hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const slotMinutes = minute < 30 ? 0 : 30;

  return { hour, minute: slotMinutes };
}

export function getProductionTime(
  createdAt: string | Date,
  type: OrderType,
  prepTimeMinutes: number,
  deliveryTimeMinutes: number,
  whenStr?: string,
  isImmediate: boolean = false,
): Date {
  const createdDate = new Date(createdAt);
  const isImm = isImmediate || !whenStr || whenStr === DEFAULT_WHEN_VALUE;

  // 1. ALL TAVOLI & IMMEDIATE ORDERS
  // If they are sitting at a table, or want it ASAP, production starts NOW.
  if (type === OrderType.TABLE || isImm) {
    return createdDate;
  }

  // PROGRAMMED ORDERS (We must back-calculate the Fire Time)
  const whenSlot = parseWhenToSlot(whenStr);
  if (!whenSlot) return createdDate; // Safety fallback

  const prodDate = new Date(createdDate);
  prodDate.setHours(whenSlot.hour);

  // 2. ASPORTO PROGRAMMATO
  if (type === OrderType.PICKUP) {
    // Subtract only cooking time
    prodDate.setMinutes(whenSlot.minute - prepTimeMinutes);
    return prodDate < createdDate ? createdDate : prodDate;
  }

  // 3. DOMICILIO PROGRAMMATO
  if (type === OrderType.HOME) {
    // Subtract rider travel time AND cooking time
    prodDate.setMinutes(whenSlot.minute - deliveryTimeMinutes - prepTimeMinutes);
    return prodDate < createdDate ? createdDate : prodDate;
  }

  return createdDate;
}

export function getTimeSlot(
  fireDate: Date,
  prepTimeMinutes: number,
): { hour: number; minute: number } {
  // We find the "Center of Stress" by adding half the prep time
  const midpointDate = new Date(fireDate);
  midpointDate.setMinutes(midpointDate.getMinutes() + prepTimeMinutes / 2);

  const hours = midpointDate.getHours();
  const minutes = midpointDate.getMinutes();

  // Now we floor the midpoint to the nearest 30m slot
  const slotMinutes = minutes < 30 ? 0 : 30;

  return { hour: hours, minute: slotMinutes };
}

export type BaseCapacityBlock = Omit<
  CapacityBlock,
  | "tableCount"
  | "homeCount"
  | "pickupCount"
  | "total"
  | "pickupImmediateCount"
  | "pickupScheduledCount"
  | "homeImmediateCount"
  | "homeScheduledCount"
>;

export function generateCapacityBlocks(): {
  lunch: BaseCapacityBlock[];
  dinner: BaseCapacityBlock[];
} {
  const fmt = (n: number) => n.toString().padStart(2, "0");

  const buildBlocks = (startH: number, startM: number, endH: number, endM: number) => {
    const arr: Array<BaseCapacityBlock> = [];
    let current = new Date(0, 0, 0, startH, startM);
    const lastStart = new Date(0, 0, 0, endH, endM);

    while (current <= lastStart) {
      const startHour = current.getHours();
      const startMinute = current.getMinutes();
      const next = new Date(current);
      next.setMinutes(startMinute + 30);

      const label = `${fmt(startHour)}:${fmt(startMinute)} - ${fmt(
        next.getHours(),
      )}:${fmt(next.getMinutes())}`;

      arr.push({ label, hour: startHour, minute: startMinute });
      current = next;
    }
    return arr;
  };

  return {
    lunch: buildBlocks(11, 30, 14, 30),
    dinner: buildBlocks(18, 0o0, 22, 30),
  };
}
