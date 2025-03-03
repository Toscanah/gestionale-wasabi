import { ProductInOrder } from "@/app/(site)/models";
import { Prisma } from "@prisma/client";
import { productInOrderInclude } from "../../includes";

export default async function handleProductDeletion(
  tx: Prisma.TransactionClient,
  currentOrder: { id: number; total: number },
  productInOrder: ProductInOrder
) {
  if (productInOrder.paid_quantity === 0) {
    await tx.optionInProductOrder.deleteMany({
      where: { product_in_order_id: productInOrder.id },
    });

    const deletedProduct = await tx.productInOrder.delete({
      where: { id: productInOrder.id },
      include: { ...productInOrderInclude },
    });

    await tx.order.update({
      where: { id: currentOrder.id },
      data: {
        total: { decrement: productInOrder.total },
        is_receipt_printed: false,
      },
    });

    return { deletedProduct };
  }

  const updatedProduct = await tx.productInOrder.update({
    where: { id: productInOrder.id },
    data: {
      quantity: { decrement: productInOrder.quantity },
      total: { decrement: productInOrder.total },
      is_paid_fully: productInOrder.paid_quantity >= productInOrder.quantity,
    },
    include: { ...productInOrderInclude },
  });

  await tx.order.update({
    where: { id: currentOrder.id },
    data: {
      total: { decrement: productInOrder.total },
      is_receipt_printed: false,
    },
  });

  return { deletedProduct: { ...updatedProduct, quantity: 0, total: 0 } };
}
