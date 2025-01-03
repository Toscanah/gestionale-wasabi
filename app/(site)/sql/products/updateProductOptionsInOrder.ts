import { OptionInProductOrder } from "../../models";
import prisma from "../db";

export default async function updateProductOptionsInOrder(
  productInOrderId: number,
  optionId: number
): Promise<OptionInProductOrder> {
  // Check if the option already exists in the product order
  console.log("Sono entrato in updateProductOptionsInOrder");
  const optionPresent = await prisma.optionInProductOrder.findFirst({
    where: {
      product_in_order_id: productInOrderId,
      option_id: optionId,
    },
  });

  // Perform the add/remove operation and reset the receipt printed flag
  const result = optionPresent
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

  const productInOrder = await prisma.productInOrder.findUnique({
    where: {
      id: productInOrderId,
    },
    select: {
      order_id: true,
    },
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

  return result;
}
