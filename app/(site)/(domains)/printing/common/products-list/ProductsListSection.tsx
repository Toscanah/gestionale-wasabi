import { ProductInOrder } from "@/app/(site)/lib/shared";
import { OrderType, ProductInOrderStatus } from "@prisma/client";
import aggregateProducts from "../../../../lib/services/product-management/aggregateProducts";
import CustomerProducts from "./CustomerProducts";
import KitchenProducts from "./KitchenProducts";

export type GroupedProductsByOptions = Record<string, ProductInOrder[]>;

export interface ProductLineProps {
  product: ProductInOrder;
}

interface ProductsListSectionProps {
  products: ProductInOrder[];
  orderType: OrderType;
  discount: number;
  recipient: "kitchen" | "customer";
}

export default function ProductsListSection({
  products,
  orderType,
  discount = 0,
  recipient,
}: ProductsListSectionProps) {
  const filteredProducts = products
    .filter((product) => product.id !== -1 && product.status == ProductInOrderStatus.IN_ORDER)
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
