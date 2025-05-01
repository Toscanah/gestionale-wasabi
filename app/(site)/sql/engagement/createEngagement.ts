import { CreateEngagement as CreateEngagementParams } from "../../shared";
import prisma from "../db";

export default async function createEngagement({
  customerId,
  payload,
  type,
  orderId,
}: CreateEngagementParams) {
  let finalOrderId = orderId;

  // If only customerId is provided, try to find their active order
  if (!orderId && customerId !== undefined) {
    const activeOrder = await prisma.order.findFirst({
      where: {
        OR: [
          {
            pickup_order: {
              customer_id: customerId,
            },
          },
          {
            home_order: {
              customer: {
                id: customerId,
              },
            },
          },
        ],
        state: {
          not: "CANCELLED",
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    if (activeOrder) {
      finalOrderId = activeOrder.id;
    }
  }

  return await prisma.engagement.create({
    data: {
      type,
      payload,
      ...(customerId !== undefined && {
        customer: {
          connect: { id: customerId },
        },
      }),
      ...(finalOrderId !== undefined && {
        order: {
          connect: { id: finalOrderId },
        },
      }),
      state: finalOrderId ? "APPLIED" : "PENDING",
      used_at: finalOrderId ? new Date() : null,
    },
  });
}
