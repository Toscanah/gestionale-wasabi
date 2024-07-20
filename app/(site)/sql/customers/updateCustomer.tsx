import { Customer } from "@prisma/client";
import prisma from "../db";

export default async function updateCustomer(customer: Customer) {
  return await prisma.customer.update({
    where: {
      id: customer.id,
    },
    data: {
      ...customer,
    },
  });
}
