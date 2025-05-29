import { ProductInOrder } from "@shared";
import { getProductPrice } from "./getProductPrice";
import { OrderType } from "@prisma/client";

type ScaleProductsParams = {
  originalProducts: ProductInOrder[];
  productsToScale: ProductInOrder[];
  orderType: OrderType;
};

export default function scaleProducts({
  originalProducts,
  productsToScale,
  orderType,
}: ScaleProductsParams): { updatedProducts: ProductInOrder[] } {
  const updatedProducts = originalProducts
    .map((product) => {
      const productToScale = productsToScale.find((p) => p.id === product.id);

      if (productToScale) {
        const paidQuantity = productToScale.quantity;
        const remainingQuantity = product.quantity - paidQuantity;

        const newTotal = remainingQuantity * getProductPrice(product, orderType);
        const newRiceQuantity = remainingQuantity * product.product.rice;

        const isPaidFully = paidQuantity >= product.quantity;

        return remainingQuantity > 0
          ? {
              ...product,
              quantity: remainingQuantity,
              paid_quantity: paidQuantity,
              total: newTotal,
              rice_quantity: newRiceQuantity,
              is_paid_fully: isPaidFully,
            }
          : null;
      }

      return product;
    })
    .filter(Boolean) as ProductInOrder[];

  return { updatedProducts };
}
