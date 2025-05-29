import prisma from "../db";

export default async function deleteProductsFromOrder({
  productIds,
  orderId,
  cooked = false,
}: {
  productIds: number[];
  orderId: number;
  cooked?: boolean;
}) {
  const productsToDelete = await prisma.productInOrder.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    select: {
      id: true,
      total: true,
      state: true,
    },
  });

  const totalToDecrement = productsToDelete.reduce((acc, product) => acc + product.total, 0);

  await prisma.productInOrder.updateMany({
    where: {
      id: {
        in: productIds,
      },
    },
    data: {
      state: cooked ? "DELETED_COOKED" : "DELETED_UNCOOKED",
    },
  });

  await prisma.optionInProductOrder.deleteMany({
    where: {
      product_in_order_id: {
        in: productIds,
      },
    },
  });

  return await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      is_receipt_printed: false,
    },
  });
}
