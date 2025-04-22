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
      payload: JSON.stringify(payload),
      customer_id: customerId,
      order_id: orderId,
    },
  });
}
