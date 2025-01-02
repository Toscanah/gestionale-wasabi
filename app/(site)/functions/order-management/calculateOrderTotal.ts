import { AnyOrder, ProductInOrder } from "@/app/(site)/models";
import { getProductPrice } from "../product-management/getProductPrice";

export default function calculateOrderTotal(order: AnyOrder) {
  return order.products.reduce(
    (acc, product) => acc + product.quantity * getProductPrice(product, order.type),
    0
  );
}
