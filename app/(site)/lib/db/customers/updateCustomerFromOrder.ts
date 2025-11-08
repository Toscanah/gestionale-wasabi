import prisma from "../prisma";
import { CustomerContracts } from "../../shared";

export default async function updateCustomerFromOrder({
  customer,
}: CustomerContracts.UpdateFromOrder.Input): Promise<CustomerContracts.UpdateFromOrder.Output> {
  return await prisma.customer.update({
    where: {
      id: customer.id,
    },
    data: {
      name: customer.name,
      surname: customer.surname,
      email: customer.email,
      preferences: customer.preferences,
      order_notes: customer.order_notes,
      origin: customer.origin,
    },
  });
}
