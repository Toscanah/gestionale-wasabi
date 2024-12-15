import { Address, Customer, OrderType } from "@prisma/client";
import prisma from "../db";

export default async function createHomeOrder(
  customerId: number,
  addressId: number,
  notes: string,
  contactPhone: string
) {
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
      products: {
        include: {
          product: {
            include: {
              category: {
                include: {
                  options: {
                    include: {
                      option: true,
                    },
                  },
                },
              },
            },
          },
          options: {
            include: {
              option: true,
            },
          },
        },
      },
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
