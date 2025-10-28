import { OrderStatus, OrderType } from "@prisma/client";
import prisma from "../../db";
import { OrderContracts, PickupOrder } from "@/app/(site)/lib/shared";
import { engagementsInclude, productsInOrderInclude, promotionUsagesInclude } from "../../includes";
import { updateOrderShift } from "../updateOrderShift";

export default async function createPickupOrder({
  name,
  when,
  phone,
}: OrderContracts.CreatePickup.Input): Promise<OrderContracts.CreatePickup.Output> {
  return await prisma.$transaction(async (tx) => {
    let orderName = name;
    let customerData: { connect: { id: number } } | undefined = undefined;
    let customerId: number | null = null;

    if (phone) {
      const existingPhone = await tx.phone.findUnique({
        where: { phone },
        include: { customer: true },
      });

      if (existingPhone?.customer) {
        customerId = existingPhone.customer.id;
        customerData = { connect: { id: customerId } };
        orderName = existingPhone.customer.surname ?? name;
      } else {
        const newPhone = await tx.phone.create({ data: { phone } });
        const newCustomer = await tx.customer.create({
          data: { phone: { connect: { id: newPhone.id } } },
        });

        customerData = { connect: { id: newCustomer.id } };
        customerId = newCustomer.id;
      }
    }

    // Check if there's already an ACTIVE pickup order with this name
    const existingOrder = await tx.order.findFirst({
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
        ...promotionUsagesInclude,
      },
    });

    if (existingOrder) {
      // Cast into discriminated branch
      const order: PickupOrder = {
        ...existingOrder,
        type: OrderType.PICKUP,
        pickup_order: existingOrder.pickup_order!, // safe: type=Pickup
      };
      return { order, isNewOrder: false };
    }

    const customerEngagements =
      customerId !== null
        ? await tx.engagement.findMany({ where: { customer_id: customerId } })
        : [];

    // Create the order
    const createdOrder = await tx.order.create({
      data: {
        type: OrderType.PICKUP,
        engagements: {
          connect: customerEngagements.map((e) => ({ id: e.id })),
        },
        pickup_order: {
          create: { name: orderName, when, customer: customerData },
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
        ...promotionUsagesInclude,
      },
    });

    if (customerEngagements.length > 0) {
      await tx.engagement.updateMany({
        where: { id: { in: customerEngagements.map((e) => e.id) } },
        data: { enabled: true, order_id: createdOrder.id },
      });
    }

    const shift = await updateOrderShift({ orderId: createdOrder.id, tx });

    if (!createdOrder.pickup_order) {
      throw new Error("Pickup order creation failed");
    }

    const order: PickupOrder = {
      ...createdOrder,
      type: OrderType.PICKUP,
      pickup_order: createdOrder.pickup_order,
      shift,
    };

    return { order, isNewOrder: true };
  });
}
