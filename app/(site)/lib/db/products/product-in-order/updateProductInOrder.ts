import prisma from "../../db";
import { ProductContracts, ProductInOrder } from "@/app/(site)/lib/shared";
import handleProductCodeChange from "./handleCodeChange";
import handleQuantityChange from "./handleQuantityChange";

export default async function updateProductInOrder({
  orderId,
  key,
  value,
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

    if (key === "code") {
      return handleProductCodeChange({ tx, currentOrder, newProductCode: value, productInOrder });
    } else if (key === "quantity") {
      return handleQuantityChange({ tx, currentOrder, newQuantity: Number(value), productInOrder });
    }

    throw new Error("Invalid key provided");
  });
}
