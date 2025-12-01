import { EngagementLedgerStatus, OrderType } from "@/prisma/generated/client/enums";
import prisma from "../../prisma";
import { EngagementContracts } from "../../../shared";

export default async function issueLedgers({
  orderId,
}: EngagementContracts.IssueLedgers.Input): Promise<EngagementContracts.IssueLedgers.Output> {
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
    throw new Error("Cannot issue engagement ledgers for table orders");
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

  // Get already issued ledgers for this order
  const issuedLedgers = await prisma.engagementLedger.findMany({
    where: {
      issued_on_order_id: orderId,
      status: EngagementLedgerStatus.ISSUED,
    },
    select: {
      engagement_id: true,
    },
  });
  const alreadyIssuedIds = new Set(issuedLedgers.map((l) => l.engagement_id));

  for (const engagement of engagements) {
    if (engagement.template.redeemable && !alreadyIssuedIds.has(engagement.id)) {
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
