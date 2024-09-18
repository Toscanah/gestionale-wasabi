export default function applyDiscount(orderTotal: number, discountPercentage: number): number {
  if (orderTotal <= 0) {
    return 0;
  }

  if (discountPercentage < 0) {
    discountPercentage = 0;
  } else if (discountPercentage > 100) {
    discountPercentage = 100;
  }

  return orderTotal * (1 - discountPercentage / 100);
}
