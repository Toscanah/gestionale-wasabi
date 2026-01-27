export default function roundToTwo(amount: number | undefined | null): string {
  return (amount ?? 0).toFixed(2);
}
