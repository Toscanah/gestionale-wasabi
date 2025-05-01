import { CreateEngagement as CreateEngagementParams } from "../../shared";
import prisma from "../db";

// export default async function createEngagement({
//   customerId,
//   payload,
//   type,
//   orderId,
// }: CreateEngagementParams) {
export default async function createEngagement(
  customerId: CreateEngagementParams["customerId"],
  payload: CreateEngagementParams["payload"],
  type: CreateEngagementParams["type"],
  orderId: CreateEngagementParams["orderId"]
) {
  console.log(type, orderId, customerId, payload);
  return await prisma.engagement.create({
    data: {
      type,
      payload,
      customer_id: customerId,
      order_id: orderId,
    },
  });
}
