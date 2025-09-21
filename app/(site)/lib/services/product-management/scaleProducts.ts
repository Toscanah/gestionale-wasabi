import { ProductInOrder } from "@/app/(site)/lib/shared";
import { OrderType } from "@prisma/client";

type ScaleProductsParams = {
  originalProducts: ProductInOrder[];
  productsToScale: ProductInOrder[];
};

/**
 * Scales the quantities of products in an order based on the quantities specified in `productsToScale`.
 * For each product in `originalProducts`, if a corresponding product exists in `productsToScale` (matched by `id`),
 * the function subtracts the paid quantity from the original quantity. If the remaining quantity is greater than zero,
 * the product is updated with the new quantity and a `paid_quantity` field. If the remaining quantity is zero or less,
 * the product is removed from the result. Products not found in `productsToScale` remain unchanged.
 *
 * @param originalProducts - The array of products in the original order.
 * @param productsToScale - The array of products with quantities to be subtracted from the original products.
 * @returns An object containing the updated array of products (`updatedProducts`), reflecting the scaled quantities.
 */
export default function scaleProducts({
  originalProducts,
  productsToScale,
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
