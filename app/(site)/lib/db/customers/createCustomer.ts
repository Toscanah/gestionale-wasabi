import prisma from "../db";
import { CustomerContract, CustomerWithDetails } from "@/app/(site)/lib/shared";
import { engagementsInclude, homeAndPickupOrdersInclude } from "../includes";
import { Customer } from "@prisma/client";

export default async function createCustomer({
  customer,
}: CustomerContract["Requests"]["CreateCustomer"]): Promise<Customer | null> {
  return await prisma.$transaction(async (tx) => {
    const { phone, ...customerData } = customer;

    const phoneExists = await tx.phone.findUnique({
      where: { phone },
    });

    if (phoneExists) {
      return null;
    }

    const newPhone = await tx.phone.create({
      data: { phone },
    });

    return await tx.customer.create({
      data: {
        ...customerData,
        phone_id: newPhone.id,
      },
    });
  });
}
