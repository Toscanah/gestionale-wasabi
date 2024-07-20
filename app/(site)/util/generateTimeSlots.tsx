export default function generateTimeSlots(
  startHour: number,
  startMinute: number,
  endHour: number,
  endMinute: number
) {
  const times = [];
  let currentHour = startHour;
  let currentMinute = startMinute;

  while (
    currentHour < endHour ||
    (currentHour === endHour && currentMinute <= endMinute)
  ) {
    const timeString = `${String(currentHour).padStart(2, "0")}:${String(
      currentMinute
    ).padStart(2, "0")}`;
    times.push(timeString);

    currentMinute += 15;
    if (currentMinute >= 60) {
      currentMinute -= 60;
      currentHour += 1;
    }
  }

  return times;
}
