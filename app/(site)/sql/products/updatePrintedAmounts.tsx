import { ProductInOrderType } from "../../types/ProductInOrderType";
import prisma from "../db";

export default async function updatePrintedAmounts(products: ProductInOrderType[]) {
  const remainingProducts: ProductInOrderType[] = [];

  console.log(products.filter((product) => product.id !== -1)[0].printedAmount)

  for (const product of products.filter((product) => product.id !== -1)) {
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
