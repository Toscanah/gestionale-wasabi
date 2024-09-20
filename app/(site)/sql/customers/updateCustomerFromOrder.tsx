import { Customer } from "@prisma/client";
import prisma from "../db";

export default async function updateCustomerFromOrder(customer: Customer) {
  console.log(customer)

  return await prisma.customer.update({
    where: {
      id: customer.id,
    },
    data: {
      ...customer,
    },
  });
}
