import { getHours, getMinutes } from "date-fns";
import { DEFAULT_WHEN_VALUE } from "@/lib/shared";

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

  const match = when.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;

  const hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const slotMinutes = minute < 30 ? 0 : 30;

  return { hour, minute: slotMinutes };
}

export function getProductionTime(
  createdAt: string | Date,
  prepTimeMinutes: number,
  standardPromiseMinutes: number,
  whenStr?: string,
  isImmediate: boolean = false,
): Date {
  if (isImmediate || !whenStr || whenStr === DEFAULT_WHEN_VALUE) {
    const prodDate = new Date(createdAt);
    prodDate.setMinutes(prodDate.getMinutes() + standardPromiseMinutes - prepTimeMinutes);
    return prodDate;
  }

  const whenSlot = parseWhenToSlot(whenStr);
  if (!whenSlot) {
    const prodDate = new Date(createdAt);
    prodDate.setMinutes(prodDate.getMinutes() + standardPromiseMinutes - prepTimeMinutes);
    return prodDate;
  }

  const prodDate = new Date(createdAt);
  prodDate.setHours(whenSlot.hour);
  prodDate.setMinutes(whenSlot.minute - prepTimeMinutes);
  return prodDate;
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
