/**
 * Converts a Date object to a decimal representation of the time.
 * @param date - The Date object to convert
 * @returns A decimal number representing the time (hours + minutes as decimal fraction)
 * @example
 * const date = new Date('2024-01-01T14:30:00');
 * const decimal = timeToDecimal(date); // Returns 14.5
 */
export default function timeToDecimal(date: Date): number {
  return date.getHours() + date.getMinutes() / 60;
}
