import { AnyOrder, ProductInOrder } from "@shared"
;
import { getProductPrice } from "../product-management/getProductPrice";
import { OrderType } from "@prisma/client";

type OrderInput = Partial<AnyOrder> & { products: ProductInOrder[]; type: OrderType };

export default function calculateOrderTotal(order: OrderInput) {
  const { products, type } = order; 

  return products.reduce(
    (acc, product) => acc + product.quantity * getProductPrice(product, type),
    0
  );
}
