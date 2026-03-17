import { getHours, getMinutes } from "date-fns";
import { DEFAULT_WHEN_VALUE } from "@/lib/shared";
import { OrderType } from "@/prisma/generated/client/enums";

export type TimeBlock = {
  label: string;
  hour: number;
  minute: number;
  tableCount: number;
  homeCount: number;
  pickupCount: number;
  total: number;
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

export function getTimeSlot(date: Date): { hour: number; minute: number } {
  const hours = getHours(date);
  const minutes = getMinutes(date);
  const slotMinutes = minutes < 30 ? 0 : 30;
  return { hour: hours, minute: slotMinutes };
}

export function generateTimeBlocks(): Omit<
  TimeBlock,
  "tableCount" | "homeCount" | "pickupCount" | "total"
>[] {
  const blocks: Array<Omit<TimeBlock, "tableCount" | "homeCount" | "pickupCount" | "total">> = [];
  const fmt = (n: number) => n.toString().padStart(2, "0");

  let current = new Date(0, 0, 0, 17, 30);
  const lastStart = new Date(0, 0, 0, 22, 0);

  while (current <= lastStart) {
    const startHour = current.getHours();
    const startMinute = current.getMinutes();
    const next = new Date(current);
    next.setMinutes(startMinute + 30);

    const label = `${fmt(startHour)}:${fmt(startMinute)} - ${fmt(
      next.getHours(),
    )}:${fmt(next.getMinutes())}`;

    blocks.push({ label, hour: startHour, minute: startMinute });
    current = next;
  }

  return blocks;
}
