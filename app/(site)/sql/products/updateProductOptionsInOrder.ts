import { OptionInProductOrder } from "../../models";
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

    if (deleted) {
      await tx.optionInProductOrder.delete({
        where: { id: deleted.id },
      });

      await tx.order.updateMany({
        where: { products: { some: { id: productInOrderId } } },
        data: { is_receipt_printed: false },
      });

      return deleted;
    }

    const created = await tx.optionInProductOrder.create({
      data: {
        product_in_order_id: productInOrderId,
        option_id: optionId,
      },
      include: { option: true },
    });

    await tx.order.updateMany({
      where: { products: { some: { id: productInOrderId } } },
      data: { is_receipt_printed: false },
    });

    return created;
  });
}
