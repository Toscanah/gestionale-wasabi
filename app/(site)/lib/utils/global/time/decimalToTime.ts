export default function decimalToTime(decimalHour: number): Date {
  const today = new Date();
  const hours = Math.floor(decimalHour);
  const minutes = Math.round((decimalHour - hours) * 60);
  return new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
}
