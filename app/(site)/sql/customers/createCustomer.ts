import prisma from "../db";
import { CreateCustomerInput, CustomerWithDetails } from "../../models";
import { homeAndPickupOrdersInclude } from "../includes";

export default async function createCustomer(
  customer: CreateCustomerInput
): Promise<CustomerWithDetails | null> {
  const { phone, ...customerData } = customer;

  const phoneExists = await prisma.phone.findUnique({
    where: {
      phone,
    },
  });

  if (phoneExists) {
    return null;
  }

  const newPhone = await prisma.phone.create({
    data: { phone },
  });

  return await prisma.customer.create({
    data: {
      ...customerData,
      phone_id: newPhone.id,
    },
    include: {
      phone: true,
      addresses: true,
      ...homeAndPickupOrdersInclude,
    },
  });
}
