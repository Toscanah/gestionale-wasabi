import { ProductContracts } from "@/lib/shared";
import prisma from "../prisma";
import { getOrderById } from "../orders/getOrderById";
import { cancelProductInOrder } from "./product-in-order/cancelProductInOrder";

export default async function deleteProductsFromOrder({
  productIds,
  orderId,
  cooked = false,
}: ProductContracts.DeleteFromOrder.Input): Promise<ProductContracts.DeleteFromOrder.Output> {
  const productsToDelete = await prisma.productInOrder.findMany({
    where: { id: { in: productIds } },
    include: { options: true },
  });

  for (const pio of productsToDelete) {
    await cancelProductInOrder({
      tx: prisma,
      pio,
      cooked,
    });
  }

  const deletedProducts = (await getOrderById({ orderId })).products.filter((p) =>
    productIds.includes(p.id)
  );

  await prisma.optionInProductOrder.deleteMany({
    where: {
      product_in_order_id: {
        in: productIds,
      },
    },
  });

  return deletedProducts;
}
