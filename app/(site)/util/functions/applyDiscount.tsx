export default function applyDiscount(orderTotal: number, discountPercentage: number): number {
  if (orderTotal <= 0) return 0;

  return parseFloat(
    (orderTotal * (1 - Math.min(Math.max(discountPercentage, 0), 100) / 100)).toFixed(2)
  );
}
