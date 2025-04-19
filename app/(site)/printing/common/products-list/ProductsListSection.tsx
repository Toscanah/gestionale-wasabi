import { ProductInOrder } from "@shared";
import { OrderType } from "@prisma/client";
import aggregateProducts from "../../../lib/product-management/aggregateProducts";
import CustomerProducts from "./CustomerProducts";
import KitchenProducts from "./KitchenProducts";

export type GroupedProductsByOptions = Record<string, ProductInOrder[]>;

export interface ProductLineProps {
  product: ProductInOrder;
}

export default function ProductsListSection(
  products: ProductInOrder[],
  orderType: OrderType,
  discount: number = 0,
  recipient: "kitchen" | "customer"
) {
  const filteredProducts = products
    .filter(
      (product) =>
        product.id !== -1 &&
        product.state !== "DELETED_COOKED" &&
        product.state !== "DELETED_UNCOOKED"
    )
    .sort((a, b) =>
      a.product.code.toLocaleUpperCase().localeCompare(b.product.code.toLocaleUpperCase())
    );

  const groupedProducts: GroupedProductsByOptions = aggregateProducts(filteredProducts, orderType);

  return recipient == "customer"
    ? CustomerProducts({
        groupedProducts,
        discount,
        orderType,
        originalProducts: filteredProducts,
      })
    : KitchenProducts({ groupedProducts });
}
