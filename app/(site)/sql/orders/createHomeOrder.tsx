import { Address, Customer } from "@prisma/client";
import prisma from "../db";

export default async function createHomeOrder(content: {
  customer: Customer;
  address: Address;
  notes: string;
  when: string;
  contact_phone: string;
}) {
  const { customer, address, notes, when, contact_phone } = content;

  return await prisma.order.create({
    data: {
      type: "TO_HOME",
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
          when,
        },
      },
    },
    include: {
      products: true,
      home_order: true,
    }
  });
}
