export default function timeToDecimal(date: Date) {
  return date.getHours() + date.getMinutes() / 60;
}
