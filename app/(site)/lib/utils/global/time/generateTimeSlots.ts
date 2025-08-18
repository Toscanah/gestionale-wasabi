import { useWasabiContext } from "@/app/(site)/context/WasabiContext";

export default function generateTimeSlots(
  startHour: number,
  startMinute: number,
  endHour: number,
  endMinute: number,
  currentHour: number,
  currentMinute: number
): string[] {
  const { settings } = useWasabiContext();

  const times = [];
  let currentSlotHour = startHour;
  let currentSlotMinute = startMinute;

  while (
    currentSlotHour < endHour ||
    (currentSlotHour === endHour && currentSlotMinute <= endMinute)
  ) {
    if (
      currentSlotHour > currentHour ||
      (currentSlotHour === currentHour && currentSlotMinute > currentMinute)
    ) {
      const timeString = `${String(currentSlotHour).padStart(2, "0")}:${String(
        currentSlotMinute
      ).padStart(2, "0")}`;
      times.push(timeString);
    }

    currentSlotMinute += settings.whenSelectorGap || 1;
    if (currentSlotMinute >= 60) {
      currentSlotMinute -= 60;
      currentSlotHour += 1;
    }
  }

  return times;
}
