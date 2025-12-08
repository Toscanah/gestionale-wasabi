import prisma from "../../prisma";
import { ProductContracts } from "@/app/(site)/lib/shared";
import handleProductCodeChange from "./handleCodeChange";
import handleQuantityChange from "./handleQuantityChange";

export default async function updateProductInOrder({
  orderId,
  updates,
  productInOrder,
}: ProductContracts.UpdateInOrder.Input): Promise<ProductContracts.UpdateInOrder.Output> {
  return await prisma.$transaction(async (tx) => {
    const currentOrder = await tx.order.findUnique({
      where: { id: orderId },
      select: { id: true, type: true },
    });

    if (!currentOrder) {
      throw new Error("Order not found");
    }

    let updatedProduct = productInOrder;
    let isDeleted = false;

    if (updates.code !== undefined && updates.code !== productInOrder.product.code) {
      const result = await handleProductCodeChange({
        tx,
        currentOrder,
        newProductCode: updates.code,
        productInOrder: updatedProduct,
      });

      updatedProduct = result.updatedProductInOrder;
      isDeleted = result.isDeleted ?? false;
    }

    if (
      !isDeleted &&
      updates.quantity !== undefined &&
      updates.quantity !== updatedProduct.quantity
    ) {

      const result = await handleQuantityChange({
        tx,
        currentOrder,
        newQuantity: updates.quantity,
        productInOrder: updatedProduct,
      });

      updatedProduct = result.updatedProductInOrder;
      isDeleted = result.isDeleted ?? false;
    }

    console.log(isDeleted);

    return {
      updatedProductInOrder: updatedProduct,
      isDeleted,
    };
  });
}
