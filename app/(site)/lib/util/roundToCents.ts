export default function roundToCents(n: number): number {
  const floored = Math.floor(n * 100);
  const fraction = n * 100 - floored;
  return fraction >= 0.5 ? (floored + 1) / 100 : floored / 100;
}
