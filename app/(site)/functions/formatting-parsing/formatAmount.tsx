export default function formatAmount(amount: number | undefined): string {
  return (amount ?? 0).toFixed(2);
}
