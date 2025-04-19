import roundToTwo from "../formatting-parsing/roundToTwo";

export default function applyDiscount(orderTotal: number, discountPercentage: number): number {
  if (orderTotal <= 0 || isNaN(orderTotal) || isNaN(discountPercentage)) return 0;

  return parseFloat(
    roundToTwo(orderTotal * (1 - Math.min(Math.max(discountPercentage, 0), 100) / 100))
  );
}
