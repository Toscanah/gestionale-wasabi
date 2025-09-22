import { MinimalProductInOrder } from "../../shared";

export default function getPioRice(product: MinimalProductInOrder): number {
  return (product.product.rice ?? 0) * (product.quantity ?? 0);
}
