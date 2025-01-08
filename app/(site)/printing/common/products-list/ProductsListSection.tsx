import { ProductInOrder } from "@/app/(site)/models";
import { OrderType } from "@prisma/client";
import aggregateProducts from "../../../functions/product-management/aggregateProducts";
import React from "react";
import CustomerProducts from "./CustomerProducts";
import KitchenProducts from "./KitchenProducts";

export default function ProductsListSection(
  products: ProductInOrder[],
  orderType: OrderType,
  discount: number = 0,
  recipient: "kitchen" | "customer"
) {
  const aggregatedProducts = aggregateProducts(
    products.filter(
      (product) =>
        product.id !== -1 &&
        product.state !== "DELETED_COOKED" &&
        product.state !== "DELETED_UNCOOKED"
    ),
    orderType
  );

  return recipient == "customer"
    ? CustomerProducts({ aggregatedProducts, discount, orderType })
    : KitchenProducts({ aggregatedProducts });
}
