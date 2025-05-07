import { OrderType, EngagementState } from "@prisma/client";
import prisma from "../db";
import { PickupOrder } from "@shared";
import { engagementsInclude, productsInOrderInclude } from "../includes";

export default async function createPickupOrder({
  name,
  when,
  phone,
}: {
  name: string;
  when: string;
  phone?: string;
}): Promise<{ order: PickupOrder; isNewOrder: boolean }> {
  return await prisma.$transaction(async (tx) => {
    let orderName = name;
    let customerData = undefined;
    let customerId: number | null = null;

    if (phone) {
      const existingPhone = await tx.phone.findUnique({
        where: { phone: phone },
        include: { customer: true },
      });

      if (existingPhone?.customer) {
        customerId = existingPhone.customer.id;
        customerData = {
          connect: { id: customerId },
        };
        orderName = existingPhone.customer.surname ?? name;
      } else {
        const newPhone = await tx.phone.create({
          data: { phone },
        });

        const newCustomer = await tx.customer.create({
          data: {
            name: name,
            surname: "",
            phone: {
              connect: { id: newPhone.id },
            },
          },
        });

        customerData = {
          connect: { id: newCustomer.id },
        };
        customerId = newCustomer.id;
      }
    }

    // Check if there's already an ACTIVE pickup order with this name
    const existingOrder: PickupOrder | null = await tx.order.findFirst({
      where: {
        type: OrderType.PICKUP,
        pickup_order: { name },
        state: "ACTIVE",
      },
      include: {
        payments: true,
        ...engagementsInclude,
        pickup_order: {
          include: {
            customer: {
              include: { phone: true, ...engagementsInclude },
            },
          },
        },
        ...productsInOrderInclude,
      },
    });

    if (existingOrder) {
      return { order: existingOrder, isNewOrder: false };
    }

    // Fetch engagements if customer exists
    const pendingEngagements =
      customerId !== null
        ? await tx.engagement.findMany({
            where: {
              customer_id: customerId,
              state: EngagementState.PENDING,
            },
          })
        : [];

    // Create the order
    const createdOrder = await tx.order.create({
      data: {
        type: OrderType.PICKUP,
        total: 0,
        engagements: {
          connect: pendingEngagements.map((e) => ({ id: e.id })),
        },
        pickup_order: {
          create: {
            name: orderName,
            when,
            customer: customerData,
          },
        },
      },
      include: {
        payments: true,
        pickup_order: {
          include: {
            customer: {
              include: { phone: true, ...engagementsInclude },
            },
          },
        },
        ...productsInOrderInclude,
        ...engagementsInclude,
      },
    });

    // Update applied engagements
    if (pendingEngagements.length > 0) {
      await tx.engagement.updateMany({
        where: {
          id: { in: pendingEngagements.map((e) => e.id) },
        },
        data: {
          state: EngagementState.APPLIED,
          order_id: createdOrder.id,
        },
      });
    }

    return { order: createdOrder, isNewOrder: true };
  });
}
