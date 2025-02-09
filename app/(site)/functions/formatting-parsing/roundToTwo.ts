export default function roundToTwo(amount: number | undefined): string {
  if (amount === undefined) return (0).toFixed(2);

  const scaled = amount * 100;
  const rounded = Math.round(scaled); // Normal rounding
  const decimalDiff = scaled - Math.floor(scaled); // Get the decimal part

  // If the decimal part is exactly .50, always round up
  return ((decimalDiff === 0.5 ? Math.ceil(scaled) : rounded) / 100).toString();
}
