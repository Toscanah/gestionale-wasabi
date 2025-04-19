import { OptionInProductOrder } from "@shared"
;
import prisma from "../db";

export default async function updateProductOptionsInOrder(
  productInOrderId: number,
  optionId: number
): Promise<OptionInProductOrder> {
  return await prisma.$transaction(async (tx) => {
    const deleted = await tx.optionInProductOrder.findFirst({
      where: { product_in_order_id: productInOrderId, option_id: optionId },
      include: { option: true },
    });

    const productInOrder = await prisma.productInOrder.findUnique({
      where: {
        id: productInOrderId,
      },
      select: {
        order_id: true,
      },
    });

    if (deleted) {
      await tx.optionInProductOrder.delete({
        where: { id: deleted.id },
      });

      if (productInOrder) {
        await prisma.order.update({
          where: {
            id: productInOrder.order_id,
          },
          data: {
            is_receipt_printed: false,
          },
        });
      }

      return deleted;
    }

    const created = await tx.optionInProductOrder.create({
      data: {
        product_in_order_id: productInOrderId,
        option_id: optionId,
      },
      include: { option: true },
    });

    if (productInOrder) {
      await prisma.order.update({
        where: {
          id: productInOrder.order_id,
        },
        data: {
          is_receipt_printed: false,
        },
      });
    }

    return created;
  });
}
