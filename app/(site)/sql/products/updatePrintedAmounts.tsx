import { ProductInOrderType } from "../../types/ProductInOrderType";
import prisma from "../db";

export default async function updatePrintedAmounts(products: ProductInOrderType[]) {
  const remainingProducts: ProductInOrderType[] = [];

  for (const product of products) {
    const remainingToPrint = product.quantity - product.printedAmount;

    if (remainingToPrint > 0) {
      remainingProducts.push({
        ...product,
        quantity: remainingToPrint,
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
