import { productInOrderInclude } from "../../includes";
import { ProductInOrder } from "@/lib/shared";
import handleDeletion from "./handleDeletion";
import { OrderType, Prisma } from "@/prisma/generated/client/client";

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
  if (Number(newQuantity) === 0) {
    return await handleDeletion({
      tx,
      currentOrderId: currentOrder.id,
      productInOrder,
    });
  }

  const quantityDiff = newQuantity - productInOrder.quantity;

  const updatedProduct = await tx.productInOrder.update({
    where: { id: productInOrder.id },
    data: {
      quantity: {
        increment: quantityDiff,
      },
      ...(quantityDiff < 0 && {
        last_printed_quantity: {
          set: Math.min(productInOrder.last_printed_quantity, newQuantity),
        },
      }),
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
    updatedProductInOrder: {
      ...updatedProduct,
      quantity: updatedProduct.quantity - updatedProduct.paid_quantity,
      to_be_printed: updatedProduct.quantity - updatedProduct.last_printed_quantity,
    },
  };
}
