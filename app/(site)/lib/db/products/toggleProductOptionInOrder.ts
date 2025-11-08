import { ProductContracts } from "@/app/(site)/lib/shared";
import prisma from "../prisma";

export default async function toggleProductOptionInOrder({
  productInOrderId,
  optionId,
}: ProductContracts.ToggleOptionInOrder.Input): Promise<ProductContracts.ToggleOptionInOrder.Output> {
  return await prisma.$transaction(async (tx) => {
    const existing = await tx.optionInProductOrder.findFirst({
      where: {
        product_in_order_id: productInOrderId,
        option_id: optionId,
      },
      include: { option: true },
    });

    const productInOrder = await tx.productInOrder.findUnique({
      where: { id: productInOrderId },
      select: { order_id: true },
    });

    if (!productInOrder) {
      throw new Error("Product in order not found");
    }

    if (existing) {
      await tx.optionInProductOrder.delete({
        where: { id: existing.id },
      });

      await tx.order.update({
        where: { id: productInOrder.order_id },
        data: { is_receipt_printed: false },
      });

      return { deleted: true, optionInProductOrder: existing };
    }

    const created = await tx.optionInProductOrder.create({
      data: {
        product_in_order_id: productInOrderId,
        option_id: optionId,
      },
      include: { option: true },
    });

    await tx.order.update({
      where: { id: productInOrder.order_id },
      data: { is_receipt_printed: false },
    });

    return { deleted: false, optionInProductOrder: created };
  });
}
