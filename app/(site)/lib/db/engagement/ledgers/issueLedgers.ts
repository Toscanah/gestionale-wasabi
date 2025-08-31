import { EngagementLedgerStatus, OrderType } from "@prisma/client";
import prisma from "../../db";
import { EngagementContract } from "../../../shared";

export default async function issueLedgers({
  orderId,
}: EngagementContract["Requests"]["IssueLedgers"]) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      type: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.type == OrderType.TABLE) {
    return [];
  }

  const engagements = await prisma.engagement.findMany({
    where: {
      enabled: true,
      order_id: orderId,
    },
    select: {
      id: true,
      template: {
        select: {
          id: true,
          redeemable: true,
        },
      },
    },
  });

  for (const engagement of engagements) {
    if (engagement.template.redeemable) {
      await prisma.engagementLedger.create({
        data: {
          engagement_id: engagement.id,
          issued_on_order_id: orderId,
          status: EngagementLedgerStatus.ISSUED,
        },
      });
    }
  }

  return engagements;
}
