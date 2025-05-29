export default function roundToTwo(amount: number | undefined): number {
  return parseFloat((amount ?? 0).toFixed(2));
}
