import prisma from "../db";
import { PromotionContracts } from "../../shared";
import { TRPCError } from "@trpc/server";
import { getOrderById } from "../orders/getOrderById";

export default async function removePromotionFromOrder(
  input: PromotionContracts.RemoveFromOrder.Input
): Promise<PromotionContracts.RemoveFromOrder.Output> {
  const { usageId } = input;

  const usage = await prisma.promotionUsage.findFirst({
    where: {
      id: usageId,
    },
  });

  if (!usage) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "La promozione non è applicata a questo ordine",
    });
  }

  await prisma.promotionUsage.delete({
    where: { id: usage.id },
  });

  return await getOrderById({ orderId: usage.order_id });
}
