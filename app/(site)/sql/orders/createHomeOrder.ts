import { OrderType } from "@prisma/client";
import prisma from "../db";
import { productsInOrderInclude } from "../includes";
import { HomeOrder } from "@shared"
;

export default async function createHomeOrder(
  customerId: number,
  addressId: number,
  notes: string,
  contactPhone: string
): Promise<HomeOrder> {
  return await prisma.order.create({
    data: {
      type: OrderType.HOME,
      total: 0,
      home_order: {
        create: {
          address: {
            connect: {
              id: addressId,
            },
          },
          customer: {
            connect: {
              id: customerId,
            },
          },
          contact_phone: contactPhone,
          notes,
          when: "immediate",
        },
      },
    },
    include: {
      payments: true,
      ...productsInOrderInclude,
      home_order: {
        include: {
          customer: {
            include: {
              phone: true,
            },
          },
          address: true,
        },
      },
    },
  });
}
