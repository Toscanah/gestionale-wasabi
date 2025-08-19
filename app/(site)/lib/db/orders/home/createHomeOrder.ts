import { OrderType } from "@prisma/client";
import prisma from "../../db";
import { engagementsInclude, homeOrderInclude, productsInOrderInclude } from "../../includes";
import { HomeOrder } from "@/app/(site)/lib/shared";

export default async function createHomeOrder({
  customerId,
  addressId,
  contactPhone,
}: {
  customerId: number;
  addressId: number;
  contactPhone: string;
}): Promise<HomeOrder> {
  return await prisma.$transaction(async (tx) => {
    const customerEngagements = await tx.engagement.findMany({
      where: {
        customer_id: customerId,
      },
    });

    // 2. Create the order and attach engagements
    const order = await tx.order.create({
      data: {
        type: OrderType.HOME,
        engagements: {
          connect: customerEngagements.map((e) => ({ id: e.id })),
        },
        home_order: {
          create: {
            address: { connect: { id: addressId } },
            customer: { connect: { id: customerId } },
            contact_phone: contactPhone,
            when: "immediate",
          },
        },
      },
      include: {
        payments: true,
        ...productsInOrderInclude,
        ...engagementsInclude,
        ...homeOrderInclude,
      },
    });

    // 3. Mark those engagements as APPLIED
    if (customerEngagements.length > 0) {
      await tx.engagement.updateMany({
        where: {
          id: { in: customerEngagements.map((e) => e.id) },
        },
        data: {
          order_id: order.id,
        },
      });
    }

    return order;
  });
}
