import { Customer } from "@prisma/client";
import prisma from "../db";

export default async function createCustomer(data: { customer: Customer; phone: string }) {
  const { phone, customer } = data;

  return await prisma.customer.create({
    data: {
      phone: {
        connect: {
          phone: phone
        }
      },
      ...customer,
    },
  });
}
