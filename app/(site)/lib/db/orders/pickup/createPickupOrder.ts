import { OrderStatus, OrderType } from "@prisma/client";
import prisma from "../../db";
import { OrderContracts, PickupOrder } from "@/app/(site)/lib/shared";
import { engagementsInclude, productsInOrderInclude } from "../../includes";
import { updateOrderShift } from "../updateOrderShift";

export default async function createPickupOrder({
  name,
  when,
  phone,
}: OrderContracts.CreatePickup.Input): Promise<OrderContracts.CreatePickup.Output> {
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
        status: OrderStatus.ACTIVE,
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

    const customerEngagements =
      customerId !== null
        ? await tx.engagement.findMany({
            where: {
              customer_id: customerId,
            },
          })
        : [];

    // Create the order
    const createdOrder = await tx.order.create({
      data: {
        type: OrderType.PICKUP,
        engagements: {
          connect: customerEngagements.map((e) => ({ id: e.id })),
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

    if (customerEngagements.length > 0) {
      await tx.engagement.updateMany({
        where: {
          id: { in: customerEngagements.map((e) => e.id) },
        },
        data: {
          enabled: true,
          order_id: createdOrder.id,
        },
      });
    }

    const shift = await updateOrderShift({ orderId: createdOrder.id, tx });
    return { order: { ...createdOrder, shift }, isNewOrder: true };
  });
}
