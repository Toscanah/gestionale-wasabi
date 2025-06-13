import { OrderType, Prisma } from "@prisma/client";
import { productInOrderInclude } from "../../includes";
import { ProductInOrder } from "@shared";
import handleDeletion from "./handleDeletion";

export default async function handleQuantityChange({
  tx,
  currentOrder,
  newQuantity,
  productInOrder,
}: {
  tx: Prisma.TransactionClient;
  currentOrder: { id: number; type: OrderType };
  newQuantity: number;
  productInOrder: ProductInOrder;
}) {
  const quantityDiff = newQuantity - productInOrder.quantity;

  if (Number(newQuantity) === 0) {
    return await handleDeletion({ tx, currentOrderId: currentOrder.id, productInOrder });
  }

  const updatedProduct = await tx.productInOrder.update({
    where: { id: productInOrder.id },
    data: {
      quantity: {
        increment: quantityDiff,
      },
      printed_amount: {
        increment: quantityDiff > 0 ? 0 : Math.max(quantityDiff, -productInOrder.printed_amount),
      },
    },
    include: { ...productInOrderInclude },
  });

  await tx.order.update({
    where: { id: currentOrder.id },
    data: {
      is_receipt_printed: false,
    },
  });

  return {
    updatedProduct: {
      ...updatedProduct,
      quantity: updatedProduct.quantity - updatedProduct.paid_quantity,
    },
  } as { updatedProduct: ProductInOrder };
}
