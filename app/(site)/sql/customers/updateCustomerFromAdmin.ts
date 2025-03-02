import { CustomerWithDetails, CustomerWithPhone } from "../../models";
import prisma from "../db";
import { homeAndPickupOrdersInclude } from "../includes";

export default async function updateCustomerFromAdmin(
  customer: CustomerWithPhone
): Promise<CustomerWithDetails> {
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
    },
    include: {
      phone: true,
      addresses: true,
      ...homeAndPickupOrdersInclude
    },
  });
}
