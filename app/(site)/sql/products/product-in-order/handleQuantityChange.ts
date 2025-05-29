import { OrderType, Prisma } from "@prisma/client";
import { productInOrderInclude } from "../../includes";
import { ProductInOrder } from "@shared";
import { getProductPrice } from "@/app/(site)/lib/product-management/getProductPrice";
import handleProductDeletion from "./handleProductDeletion";

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
  newQuantity = Number(newQuantity);
  const quantityDifference = newQuantity - productInOrder.quantity;

  if (newQuantity === 0) {
    return await handleProductDeletion({ tx, currentOrder, productInOrder });
  }

  const updatedProduct = await tx.productInOrder.update({
    where: { id: productInOrder.id },
    data: {
      quantity: newQuantity,
      rice_quantity: { increment: quantityDifference * productInOrder.product.rice },
      printed_amount: {
        increment:
          quantityDifference > 0 ? 0 : Math.max(quantityDifference, -productInOrder.printed_amount),
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

  return { updatedProduct };
}
