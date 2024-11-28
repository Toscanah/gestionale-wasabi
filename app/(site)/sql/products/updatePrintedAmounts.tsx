import { ProductInOrderType } from "../../types/ProductInOrderType";
import prisma from "../db";

export default async function updatePrintedAmounts(products: ProductInOrderType[]) {
  const remainingProducts: ProductInOrderType[] = [];
  const originalProducts = products.filter((product) => product.id !== -1);

  if (originalProducts.length == 0) return [];

  for (const product of originalProducts) {
    const remainingToPrint = product.quantity - product.printedAmount;

    if (remainingToPrint > 0) {
      remainingProducts.push({
        ...product,
        printedAmount: remainingToPrint,
      });

      await prisma.productInOrder.update({
        where: { id: product.id },
        data: {
          printedAmount: {
            increment: remainingToPrint,
          },
        },
      });
    }
  }

  return remainingProducts;
}
