import { OrderType, Prisma } from "@prisma/client";
import { productInOrderInclude } from "../../includes";
import { ProductInOrder } from "@/app/(site)/models";
import { getProductPrice } from "@/app/(site)/functions/product-management/getProductPrice";
import handleProductDeletion from "./handleProductDeletion";

export default async function handleQuantityChange(
  tx: Prisma.TransactionClient,
  currentOrder: { id: number; total: number; type: OrderType },
  newQuantity: number,
  productInOrder: ProductInOrder
) {
  newQuantity = Number(newQuantity);
  const quantityDifference = newQuantity - productInOrder.quantity;
  const totalDifference = quantityDifference * getProductPrice(productInOrder, currentOrder.type);

  if (newQuantity === 0) {
    return await handleProductDeletion(tx, currentOrder, productInOrder);
  }

  const updatedProduct = await tx.productInOrder.update({
    where: { id: productInOrder.id },
    data: {
      quantity: newQuantity,
      total: { increment: totalDifference },
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
      total: { increment: totalDifference },
      is_receipt_printed: false,
    },
  });

  return { updatedProduct };
}
