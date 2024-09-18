import { Address, Customer, OrderType } from "@prisma/client";
import prisma from "../db";

export default async function createHomeOrder(content: {
  customer: Customer;
  address: Address;
  notes: string;
  contact_phone: string;
}) {
  const { customer, address, notes, contact_phone } = content;

  return await prisma.order.create({
    data: {
      type: OrderType.TO_HOME,
      total: 0,
      home_order: {
        create: {
          address: {
            connect: {
              id: address.id,
            },
          },
          customer: {
            connect: {
              id: customer.id,
            },
          },
          contact_phone,
          notes,
          when: "immediate"
        },
      },
    },
    include: {
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
      home_order: true,
    },
  });
}
