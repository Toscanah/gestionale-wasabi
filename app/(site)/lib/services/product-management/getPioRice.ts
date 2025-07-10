import { ProductInOrder } from "@prisma/client";

export default function getPioRice(
  product: Partial<ProductInOrder> & {
    product: {
      rice?: number;
    };
    quantity?: number;
  }
): number {
  return (product.product.rice ?? 0) * (product.quantity ?? 0);
}
