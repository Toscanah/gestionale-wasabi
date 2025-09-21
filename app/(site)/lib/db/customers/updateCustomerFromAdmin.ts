import { CustomerContracts } from "@/app/(site)/lib/shared";
import prisma from "../db";
import { engagementsInclude, homeAndPickupOrdersInclude } from "../includes";

export default async function updateCustomerFromAdmin({
  customer,
}: CustomerContracts.UpdateFromAdmin.Input): Promise<CustomerContracts.UpdateFromAdmin.Output> {
  const { phone, ...customerData } = customer;

  if (!phone) {
    throw new Error("A customer must have a phone number.");
  }

  await prisma.phone.update({
    where: { id: customer.phone_id },
    data: { phone: phone.phone },
  });

  return await prisma.customer.update({
    where: { id: customer.id },
    data: {
      name: customerData.name,
      surname: customerData.surname,
      email: customerData.email,
      preferences: customerData.preferences,
      order_notes: customerData.order_notes,
      origin: customerData.origin,
    },
    include: {
      phone: true,
      addresses: true,
      ...homeAndPickupOrdersInclude,
      ...engagementsInclude,
    },
  });
}
