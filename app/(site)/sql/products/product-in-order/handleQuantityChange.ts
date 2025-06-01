import { OrderType, Prisma } from "@prisma/client";
import { productInOrderInclude } from "../../includes";
import { ProductInOrder } from "@shared";
import { getProductPrice } from "@/app/(site)/lib/product-management/getProductPrice";
import handleProductDeletion from "./handleProductDeletion";
import { update } from "lodash";

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

  if (newQuantity === 0) {
    return await handleProductDeletion({ tx, currentOrder, productInOrder });
  }

  const updatedProduct = await tx.productInOrder.update({
    where: { id: productInOrder.id },
    data: {
      quantity: {
        increment: quantityDiff,
      },
      total: {
        increment:
          quantityDiff * getProductPrice({ product: productInOrder.product }, currentOrder.type),
      },
      rice_quantity: { increment: quantityDiff * productInOrder.product.rice },
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
      total:
        updatedProduct.total -
        updatedProduct.paid_quantity *
          getProductPrice({ product: updatedProduct.product }, currentOrder.type),
    },
  } as { updatedProduct: ProductInOrder };
}
