import { EngagementState, OrderType } from "@prisma/client";
import prisma from "../db";
import { productsInOrderInclude } from "../includes";
import { HomeOrder } from "@shared";

export default async function createHomeOrder(
  customerId: number,
  addressId: number,
  notes: string,
  contactPhone: string
): Promise<HomeOrder> {
  return await prisma.$transaction(async (tx) => {
    // 1. Get all PENDING engagements for the customer
    const pendingEngagements = await tx.engagement.findMany({
      where: {
        customer_id: customerId,
        state: EngagementState.PENDING,
      },
    });

    // 2. Create the order and attach engagements
    const order = await tx.order.create({
      data: {
        type: OrderType.HOME,
        total: 0,
        engagement: {
          connect: pendingEngagements.map((e) => ({ id: e.id })),
        },
        home_order: {
          create: {
            address: { connect: { id: addressId } },
            customer: { connect: { id: customerId } },
            contact_phone: contactPhone,
            notes,
            when: "immediate",
          },
        },
      },
      include: {
        payments: true,
        ...productsInOrderInclude,
        engagement: true,
        home_order: {
          include: {
            customer: { include: { phone: true } },
            address: true,
          },
        },
      },
    });

    // 3. Mark those engagements as APPLIED
    if (pendingEngagements.length > 0) {
      await tx.engagement.updateMany({
        where: {
          id: { in: pendingEngagements.map((e) => e.id) },
        },
        data: {
          state: EngagementState.APPLIED,
          order_id: order.id,
        },
      });
    }

    return order;
  });
}
