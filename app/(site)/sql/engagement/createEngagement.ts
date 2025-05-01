import { CreateEngagement as CreateEngagementParams } from "../../shared";
import prisma from "../db";

export default async function createEngagement({
  customerId,
  payload,
  type,
  orderId,
}: CreateEngagementParams) {
  return await prisma.engagement.create({
    data: {
      type,
      payload,
      ...(customerId && {
        customer: {
          connect: { id: customerId },
        },
      }),
      ...(orderId && {
        order: {
          connect: { id: orderId },
        },
      }),
      state: orderId ? "APPLIED" : "PENDING",
      used_at: orderId ? new Date() : null,
    },
  });
}
