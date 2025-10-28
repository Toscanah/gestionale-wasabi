import { OrderType } from "@prisma/client";
import prisma from "../../db";
import { engagementsInclude, homeOrderInclude, productsInOrderInclude, promotionUsagesInclude } from "../../includes";
import { HomeOrder, OrderContracts } from "@/app/(site)/lib/shared";
import { updateOrderShift } from "../updateOrderShift";

export default async function createHomeOrder({
  customerId,
  addressId,
  contactPhone,
}: OrderContracts.CreateHome.Input): Promise<OrderContracts.CreateHome.Output> {
  return await prisma.$transaction(async (tx) => {
    const customerEngagements = await tx.engagement.findMany({
      where: {
        customer_id: customerId,
      },
    });

    // Create the order and attach engagements
    const created = await tx.order.create({
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
        ...promotionUsagesInclude,
      },
    });

    // Mark those engagements as APPLIED
    if (customerEngagements.length > 0) {
      await tx.engagement.updateMany({
        where: { id: { in: customerEngagements.map((e) => e.id) } },
        data: { order_id: created.id },
      });
    }

    const shift = await updateOrderShift({ orderId: created.id, tx });

    if (!created.home_order) {
      throw new Error("Home order creation failed");
    }

    const order: HomeOrder = {
      ...created,
      type: OrderType.HOME,
      home_order: created.home_order,
      shift,
    };

    return order;
  });
}
