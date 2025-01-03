import prisma from "../db";

export default async function deleteProductsFromOrder(
  productIds: number[],
  orderId: number,
  cooked: boolean = false
) {
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

  console.log("Sono entrato in deleteproducts from order")
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
      total: {
        decrement: totalToDecrement,
      },
      is_receipt_printed: false,
    },
  });
}
