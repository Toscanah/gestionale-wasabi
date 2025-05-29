type DiscountInput = {
  orderTotal: number;
  discountPercentage: number;
};

export default function getDiscountedTotal({
  orderTotal,
  discountPercentage,
}: DiscountInput): number {
  if (orderTotal <= 0 || isNaN(orderTotal) || isNaN(discountPercentage)) return 0;

  const clampedDiscount = Math.min(Math.max(discountPercentage, 0), 100);
  return orderTotal * (1 - clampedDiscount / 100);
}
