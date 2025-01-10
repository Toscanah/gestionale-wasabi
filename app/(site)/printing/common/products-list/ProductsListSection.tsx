import { ProductInOrder } from "@/app/(site)/models";
import { OrderType } from "@prisma/client";
import aggregateProducts from "../../../functions/product-management/aggregateProducts";
import React from "react";
import CustomerProducts from "./CustomerProducts";
import KitchenProducts from "./KitchenProducts";
import joinItemsWithComma from "@/app/(site)/functions/formatting-parsing/joinItemsWithComma";

export type GroupedProductsByOptions = Record<string, ProductInOrder[]>;

function groupProductsByOptions(products: ProductInOrder[]): GroupedProductsByOptions {
  const groupedProducts: Record<string, ProductInOrder[]> = {};

  products.forEach((product) => {
    const optionsKey =
      product.options.length === 0
        ? "no_options"
        : joinItemsWithComma(product, "options", { sort: true });

    if (!groupedProducts[optionsKey]) {
      groupedProducts[optionsKey] = [];
    }

    const existingProductIndex = groupedProducts[optionsKey].findIndex(
      (item) => item.product.code === product.product.code
    );

    if (existingProductIndex !== -1) {
      groupedProducts[optionsKey][existingProductIndex].quantity += product.quantity;
    } else {
      groupedProducts[optionsKey].push({
        ...product,
        options: product.options.map((option) => ({
          ...option,
          option_name: option.option.option_name.slice(0, 6),
        })),
      });
    }
  });

  return groupedProducts;
}

export default function ProductsListSection(
  products: ProductInOrder[],
  orderType: OrderType,
  discount: number = 0,
  recipient: "kitchen" | "customer"
) {
  const aggregatedProducts = aggregateProducts(
    products
      .filter(
        (product) =>
          product.id !== -1 &&
          product.state !== "DELETED_COOKED" &&
          product.state !== "DELETED_UNCOOKED"
      )
      .sort((a, b) =>
        a.product.code.toLocaleUpperCase().localeCompare(b.product.code.toLocaleUpperCase())
      ),
    orderType
  );

  const groupedProducts = groupProductsByOptions(aggregatedProducts);

  return recipient == "customer"
    ? CustomerProducts({
        groupedProducts,
        discount,
        orderType,
        originalProducts: aggregatedProducts,
      })
    : KitchenProducts({ groupedProducts });
}
