import { Customer } from "@/prisma/generated/zod";
import prisma from "../db";

export default async function updateCustomerFromOrder({
  customer,
}: {
  customer: Customer;
}): Promise<Customer> {
  return await prisma.customer.update({
    where: {
      id: customer.id,
    },
    data: {
      name: customer.name,
      surname: customer.surname,
      email: customer.email,
      preferences: customer.preferences,
    },
  });
}
