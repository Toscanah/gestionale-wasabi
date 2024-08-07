import { Option, OptionInProductOrder } from "@prisma/client";
import prisma from "../db";

export default async function updateProductOptionsInOrder(
  productInOrderId: number,
  optionId: number
): Promise<OptionInProductOrder & { option: Option }> {
  const optionPresent = await prisma.optionInProductOrder.findFirst({
    where: {
      product_in_order_id: productInOrderId,
      option_id: optionId,
    },
  });

  return optionPresent
    ? await prisma.optionInProductOrder.delete({
        where: {
          id: optionPresent.id,
        },
        include: {
          option: true,
        },
      })
    : await prisma.optionInProductOrder.create({
        data: {
          product_in_order_id: productInOrderId,
          option_id: optionId,
        },
        include: {
          option: true,
        },
      });
}
