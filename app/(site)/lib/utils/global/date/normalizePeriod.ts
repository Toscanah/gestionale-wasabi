/**
 * Normalizes a period input into an object with `from` and `to` Date properties.
 *
 * @param period - A `Date` object representing a single date, or an object with `from` and optional `to` Date properties.
 * @returns An object with `from` and `to` properties as `Date` instances, or `undefined` if no period is provided.
 *
 * @example
 * normalizePeriod(new Date('2024-01-01'));
 * // Returns: { from: Date('2024-01-01'), to: Date('2024-01-01') }
 *
 * normalizePeriod({ from: new Date('2024-01-01'), to: new Date('2024-01-31') });
 * // Returns: { from: Date('2024-01-01'), to: Date('2024-01-31') }
 *
 * normalizePeriod({ from: new Date('2024-01-01') });
 * // Returns: { from: Date('2024-01-01'), to: Date('2024-01-01') }
 */
export default function normalizePeriod(
  period?: Date | { from: Date; to?: Date }
): { from: Date; to: Date } | undefined {
  if (!period) return undefined;
  if (period instanceof Date) return { from: period, to: period };
  return { from: period.from, to: period.to ?? period.from };
}
