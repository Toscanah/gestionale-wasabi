export default function roundToTwo(amount: number | undefined): string {
  return (amount ?? 0).toFixed(2);
}
