export default function roundToCents(n: number): number {
  return Number((Math.round(n * 100) / 100).toFixed(2));
}
