import { ProductContracts, ProductInOrder } from "@/lib/shared";
import { productInOrderInclude } from "../../includes";
import { Prisma } from "@/prisma/generated/client/browser";

export default async function handleDeletion({
  tx,
  currentOrderId,
  productInOrder,
}: {
  tx: Prisma.TransactionClient;
  currentOrderId: number;
  productInOrder: ProductInOrder;
}): Promise<ProductContracts.UpdateInOrder.Output> {
  if (productInOrder.paid_quantity === 0) {
    await tx.optionInProductOrder.deleteMany({
      where: { product_in_order_id: productInOrder.id },
    });

    const deletedProduct = await tx.productInOrder.delete({
      where: { id: productInOrder.id },
      include: { ...productInOrderInclude },
    });

    await tx.order.update({
      where: { id: currentOrderId },
      data: { is_receipt_printed: false },
    });

    return { updatedProductInOrder: deletedProduct, isDeleted: true };
  }

  const updatedProduct = await tx.productInOrder.update({
    where: { id: productInOrder.id },
    data: {
      quantity: productInOrder.paid_quantity,
    },
    include: { ...productInOrderInclude },
  });

  await tx.order.update({
    where: { id: currentOrderId },
    data: { is_receipt_printed: false },
  });

  return { updatedProductInOrder: updatedProduct, isDeleted: true };
}
