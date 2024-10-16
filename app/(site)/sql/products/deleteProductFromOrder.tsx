import prisma from "../db";

export default async function deleteProductFromOrder(
  productIds: number[],
  orderId: number,
  cooked: boolean = false
) {
  // Fetch the products to delete based on the provided productIds
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

  // If products are cooked, update the state instead of deleting
  if (cooked) {
    await prisma.productInOrder.updateMany({
      where: {
        id: {
          in: productIds,
        },
      },
      data: {
        state: "DELETED_COOKED", // Update the state for cooked products
      },
    });
  } else {
    // For uncooked products, update the state to DELETED_UNCOOKED and delete options
    await prisma.productInOrder.updateMany({
      where: {
        id: {
          in: productIds,
        },
      },
      data: {
        state: "DELETED_UNCOOKED", // Update the state for uncooked products
      },
    });
  }

  // Remove associated options regardless of the cooked state
  await prisma.optionInProductOrder.deleteMany({
    where: {
      product_in_order_id: {
        in: productIds,
      },
    },
  });

  // Update the order total
  return await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      total: {
        decrement: totalToDecrement,
      },
    },
  });
}
