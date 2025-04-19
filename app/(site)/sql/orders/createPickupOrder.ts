import { OrderType } from "@prisma/client";
import prisma from "../db";
import { PickupOrder } from "@shared"
;
import { productsInOrderInclude } from "../includes";

export default async function createPickupOrder(
  name: string,
  when: string,
  phone?: string
): Promise<{ order: PickupOrder; isNewOrder: boolean }> {
  let orderName = name;
  let customerData = undefined;

  if (phone) {
    const existingPhone = await prisma.phone.findUnique({
      where: { phone: phone },
      include: { customer: true },
    });

    if (existingPhone?.customer) {
      customerData = {
        connect: { id: existingPhone.customer.id },
      };
      orderName = existingPhone.customer.surname ?? name;
    } else {
      const newPhone = await prisma.phone.create({
        data: { phone },
      });

      customerData = {
        create: {
          name: name,
          surname: "",
          phone: {
            connect: { id: newPhone.id },
          },
        },
      };
    }
  }

  const existingOrder: PickupOrder | null = await prisma.order.findFirst({
    where: {
      type: OrderType.PICKUP,
      pickup_order: { name },
      state: "ACTIVE",
    },
    include: {
      payments: true,
      pickup_order: {
        include: {
          customer: {
            include: { phone: true },
          },
        },
      },
      ...productsInOrderInclude,
    },
  });

  if (existingOrder) {
    return { order: existingOrder, isNewOrder: false };
  }

  const createdOrder = await prisma.order.create({
    data: {
      type: OrderType.PICKUP,
      total: 0,
      pickup_order: {
        create: {
          name: orderName,
          when: when,
          customer: customerData,
        },
      },
    },
    include: {
      payments: true,
      pickup_order: {
        include: {
          customer: {
            include: { phone: true },
          },
        },
      },
      ...productsInOrderInclude,
    },
  });

  return { order: createdOrder, isNewOrder: true };
}
