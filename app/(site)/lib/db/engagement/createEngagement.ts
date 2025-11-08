import { OrderStatus } from "@prisma/client";
import prisma from "../prisma";
import normalizeTemplatePayload from "@/app/(site)/lib/services/engagement/normalizeTemplatePayload";
import { EngagementContracts } from "../../shared";

export default async function createEngagement({
  templateId,
  customerId,
  orderId,
}: EngagementContracts.Create.Input): Promise<EngagementContracts.Create.Output> {
  let finalOrderId = orderId;

  // If only customerId is provided, try to find their first active order
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
              customer_id: customerId,
            },
          },
        ],
        status: OrderStatus.ACTIVE,
      },
      orderBy: {
        created_at: "desc",
      },
      select: {
        id: true,
      },
    });

    if (activeOrder) {
      finalOrderId = activeOrder.id;
    }
  }

  // ❌ Check for existing engagement with same template/customer/order
  const existing = await prisma.engagement.findFirst({
    where: {
      template_id: templateId,
      ...(customerId !== undefined && { customer_id: customerId }),
      ...(finalOrderId !== undefined && { order_id: finalOrderId }),
    },
  });

  if (existing) {
    return null;
  }

  const engagement = await prisma.engagement.create({
    data: {
      template: {
        connect: { id: templateId },
      },
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
    },
    include: {
      template: true,
    },
  });

  return {
    ...engagement,
    template: normalizeTemplatePayload(engagement.template),
  };
}
