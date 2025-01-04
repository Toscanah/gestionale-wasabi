import formatAmount from "../formatting-parsing/formatAmount";

export default function applyDiscount(orderTotal: number, discountPercentage: number): number {
  if (orderTotal <= 0 || isNaN(orderTotal) || isNaN(discountPercentage)) return 0;

  return parseFloat(
    formatAmount(orderTotal * (1 - Math.min(Math.max(discountPercentage, 0), 100) / 100))
  );
}
