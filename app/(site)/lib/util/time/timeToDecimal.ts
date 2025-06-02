export default function timeToDecimal(date: Date): number {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("Invalid date provided");
  }
  return date.getHours() + date.getMinutes() / 60;
}
