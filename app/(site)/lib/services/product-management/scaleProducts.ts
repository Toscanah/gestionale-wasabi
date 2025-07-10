import { ProductInOrder } from "@/app/(site)/lib/shared";
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
  const updatedProducts: ProductInOrder[] = originalProducts
    .map((product) => {
      const productToScale = productsToScale.find((p) => p.id === product.id);

      if (productToScale) {
        const paidQuantity = productToScale.quantity;
        const remainingQuantity = product.quantity - paidQuantity;

        return remainingQuantity > 0
          ? {
              ...product,
              quantity: remainingQuantity,
              paid_quantity: paidQuantity,
            }
          : null;
      }

      return product;
    })
    .filter(Boolean) as ProductInOrder[];

  return { updatedProducts };
}
