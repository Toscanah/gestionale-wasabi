import { AnyOrder, ProductInOrder } from "@/app/(site)/models";
import { getProductPrice } from "../product-management/getProductPrice";
import { OrderType } from "@prisma/client";

// Make all properties of AnyOrder optional except for `products` and `type`
type OrderInput = Partial<AnyOrder> & { products: ProductInOrder[]; type: OrderType };

export default function calculateOrderTotal(order: OrderInput) {
  const { products, type } = order; 

  return products.reduce(
    (acc, product) => acc + product.quantity * getProductPrice(product, type),
    0
  );
}
