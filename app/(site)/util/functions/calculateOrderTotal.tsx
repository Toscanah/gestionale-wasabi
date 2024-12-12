import { AnyOrder } from "../../types/PrismaOrders";
import { getProductPrice } from "./getProductPrice";

export default function calculateOrderTotal(order: AnyOrder) {
  return order.products.reduce(
    (acc, product) => acc + product.quantity * getProductPrice(product, order.type),
    0
  );
}