import prisma from "../../db";
import { ProductInOrder } from "@shared"
;
import handleProductCodeChange from "./handleCodeChange";
import handleQuantityChange from "./handleQuantityChange";

export type UpdateProductInOrderResponse = {
  updatedProduct?: ProductInOrder;
  deletedProduct?: ProductInOrder;
  error?: string;
};

export default async function updateProductInOrder(
  orderId: number,
  key: string,
  value: any,
  productInOrder: ProductInOrder
): Promise<UpdateProductInOrderResponse> {
  return await prisma.$transaction(async (tx) => {
    const currentOrder = await tx.order.findUnique({
      where: { id: orderId },
      select: { id: true, total: true, type: true },
    });

    if (!currentOrder) {
      return { error: "Order not found" };
    }

    if (key === "code") {
      return handleProductCodeChange(tx, currentOrder, value, productInOrder);
    } else if (key === "quantity") {
      return handleQuantityChange(tx, currentOrder, value, productInOrder);
    }

    return { error: "Invalid key" };
  });
}
