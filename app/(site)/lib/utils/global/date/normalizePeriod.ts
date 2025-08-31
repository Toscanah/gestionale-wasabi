export default function normalizePeriod(
  period?: Date | { from: Date; to?: Date }
): { from: Date; to: Date } | undefined {
  if (!period) return undefined;
  if (period instanceof Date) return { from: period, to: period };
  return { from: period.from, to: period.to ?? period.from };
}
