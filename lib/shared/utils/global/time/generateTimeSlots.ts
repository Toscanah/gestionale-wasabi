import { useWasabiContext } from "@/app/(site)/context/WasabiContext";

/**
 * Generates an array of time slot strings between a start and end time, 
 * excluding slots before the current time. The interval between slots is 
 * determined by the `whenSelectorGap` setting from the Wasabi context.
 *
 * @param startHour - The starting hour (0-23) for the time slots.
 * @param startMinute - The starting minute (0-59) for the time slots.
 * @param endHour - The ending hour (0-23) for the time slots.
 * @param endMinute - The ending minute (0-59) for the time slots.
 * @param currentHour - The current hour (0-23); slots before this time are excluded.
 * @param currentMinute - The current minute (0-59); slots before this time are excluded.
 * @returns An array of time slot strings in "HH:mm" format, each representing a valid slot after the current time.
 */
export default function generateTimeSlots(
  startHour: number,
  startMinute: number,
  endHour: number,
  endMinute: number,
  currentHour: number,
  currentMinute: number,
  gap = 1,
): string[] {
  const times: string[] = [];

  const startTotal = startHour * 60 + startMinute;
  const endTotal = endHour * 60 + endMinute;
  const currentTotal = currentHour * 60 + currentMinute;

  let slot = startTotal;

  while (slot <= endTotal) {
    if (slot > currentTotal) {
      const h = Math.floor(slot / 60) % 24;
      const m = slot % 60;
      const timeString = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      times.push(timeString);
    }
    slot += gap;
  }

  return times;
}
